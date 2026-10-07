import math
from typing import List, Dict, Any
from bson import ObjectId
from database import get_database

def find_meal_matches(budget: float, persons: int, city: str) -> List[Dict[str, Any]]:
    db = get_database()
    restaurants_col = db["restaurants"]
    menu_items_col = db["menu_items"]

    # Normalize city search
    clean_city = city.strip()
    restaurants = list(restaurants_col.find(
        {"city": {"$regex": f"^{clean_city}$", "$options": "i"}}
    ))

    # Fallback to all restaurants if specific city has none in dummy data
    if not restaurants:
        restaurants = list(restaurants_col.find({}))

    if not restaurants or persons <= 0 or budget <= 0:
        return []

    restaurant_map = {str(r["_id"]): r for r in restaurants}
    restaurant_ids = [r["_id"] for r in restaurants]

    # Fetch menu items for these restaurants
    all_items = list(menu_items_col.find({"restaurant_id": {"$in": restaurant_ids}}))

    # Group items by restaurant
    items_by_restaurant: Dict[str, List[Dict[str, Any]]] = {}
    for item in all_items:
        r_id = str(item["restaurant_id"])
        items_by_restaurant.setdefault(r_id, []).append(item)

    candidates: List[Dict[str, Any]] = []

    for r_id, items in items_by_restaurant.items():
        rest = restaurant_map.get(r_id)
        if not rest:
            continue

        # Strategy 1: Single item (single deal or multiple identical single items)
        for item in items:
            serving_size = max(1, item.get("serving_size", 1))
            price = item.get("price", 0)

            # Minimum quantity required to serve all persons
            needed_qty = math.ceil(persons / serving_size)
            total_price = needed_qty * price
            total_servings = needed_qty * serving_size

            # Check constraints
            if total_price <= budget and total_servings >= persons:
                amount_saved = budget - total_price
                qty_str = f"{needed_qty}x " if needed_qty > 1 else "1 "
                headline = f"Buy {qty_str}{item['item_name']} from {rest['name']}, serves {total_servings}, saves Rs {int(amount_saved)}"
                
                candidates.append({
                    "id": f"single_{item['_id']}_{needed_qty}",
                    "restaurant": {
                        "id": str(rest["_id"]),
                        "name": rest["name"],
                        "city": rest["city"],
                        "area": rest["area"],
                        "logo_url": rest.get("logo_url", "")
                    },
                    "items": [
                        {
                            "id": str(item["_id"]),
                            "name": item["item_name"],
                            "quantity": needed_qty,
                            "serving_size": serving_size,
                            "unit_price": price,
                            "total_price": total_price,
                            "type": item.get("type", "Single")
                        }
                    ],
                    "total_servings": total_servings,
                    "total_price": total_price,
                    "budget": budget,
                    "amount_saved": amount_saved,
                    "cost_per_person": round(total_price / persons, 2),
                    "headline": headline,
                    "score": total_price / budget  # Higher score = closer to budget without exceeding
                })

        # Strategy 2: Pair combinations of two distinct items from the same restaurant
        n_items = len(items)
        for i in range(n_items):
            for j in range(i + 1, n_items):
                item1 = items[i]
                item2 = items[j]

                s1 = max(1, item1.get("serving_size", 1))
                s2 = max(1, item2.get("serving_size", 1))
                p1 = item1.get("price", 0)
                p2 = item2.get("price", 0)

                # Search small quantities (up to persons)
                max_q1 = max(1, math.ceil(persons / s1))
                max_q2 = max(1, math.ceil(persons / s2))

                for q1 in range(1, max_q1 + 1):
                    for q2 in range(1, max_q2 + 1):
                        tot_servings = (q1 * s1) + (q2 * s2)
                        tot_price = (q1 * p1) + (q2 * p2)

                        # We want exact or near exact servings (don't over-serve by more than 2 persons)
                        if tot_price <= budget and persons <= tot_servings <= (persons + 2):
                            amount_saved = budget - tot_price
                            desc_items = f"{q1}x {item1['item_name']} + {q2}x {item2['item_name']}"
                            headline = f"Buy {desc_items} from {rest['name']}, serves {tot_servings}, saves Rs {int(amount_saved)}"

                            candidates.append({
                                "id": f"combo_{item1['_id']}_{item2['_id']}_{q1}_{q2}",
                                "restaurant": {
                                    "id": str(rest["_id"]),
                                    "name": rest["name"],
                                    "city": rest["city"],
                                    "area": rest["area"],
                                    "logo_url": rest.get("logo_url", "")
                                },
                                "items": [
                                    {
                                        "id": str(item1["_id"]),
                                        "name": item1["item_name"],
                                        "quantity": q1,
                                        "serving_size": s1,
                                        "unit_price": p1,
                                        "total_price": q1 * p1,
                                        "type": item1.get("type", "Single")
                                    },
                                    {
                                        "id": str(item2["_id"]),
                                        "name": item2["item_name"],
                                        "quantity": q2,
                                        "serving_size": s2,
                                        "unit_price": p2,
                                        "total_price": q2 * p2,
                                        "type": item2.get("type", "Single")
                                    }
                                ],
                                "total_servings": tot_servings,
                                "total_price": tot_price,
                                "budget": budget,
                                "amount_saved": amount_saved,
                                "cost_per_person": round(tot_price / persons, 2),
                                "headline": headline,
                                "score": tot_price / budget
                            })

    # Sort candidates by best budget fit (highest score <= 1.0, meaning closest to total budget without exceeding)
    # If scores are close, prefer deals over singles
    candidates.sort(
        key=lambda c: (
            c["score"], 
            any(it["type"] == "Deal" for it in c["items"]),
            -c["amount_saved"]
        ),
        reverse=True
    )

    # Curate top 3 options with restaurant diversity
    curated: List[Dict[str, Any]] = []
    seen_restaurants = set()

    for cand in candidates:
        rest_id = cand["restaurant"]["id"]
        if rest_id not in seen_restaurants:
            curated.append(cand)
            seen_restaurants.add(rest_id)
        if len(curated) == 3:
            break

    # If we have fewer than 3 unique restaurants, fill remaining from remaining candidates
    if len(curated) < 3:
        for cand in candidates:
            if cand not in curated:
                curated.append(cand)
            if len(curated) == 3:
                break

    return curated
