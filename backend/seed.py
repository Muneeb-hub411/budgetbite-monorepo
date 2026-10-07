import os
from bson import ObjectId
from database import get_database

def seed_database():
    db = get_database()
    restaurants_col = db["restaurants"]
    menu_items_col = db["menu_items"]

    print("Cleaning existing seed data...")
    restaurants_col.delete_many({})
    menu_items_col.delete_many({})

    restaurants_data = [
        {
            "_id": ObjectId("660000000000000000000001"),
            "name": "KFC",
            "city": "Islamabad",
            "area": "F-7 Markaz",
            "logo_url": "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=128&auto=format&fit=crop&q=80"
        },
        {
            "_id": ObjectId("660000000000000000000002"),
            "name": "Cheezious",
            "city": "Islamabad",
            "area": "F-11 Markaz",
            "logo_url": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=128&auto=format&fit=crop&q=80"
        },
        {
            "_id": ObjectId("660000000000000000000003"),
            "name": "Ranchers",
            "city": "Islamabad",
            "area": "I-8 Markaz",
            "logo_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=128&auto=format&fit=crop&q=80"
        },
        {
            "_id": ObjectId("660000000000000000000004"),
            "name": "OPTP",
            "city": "Islamabad",
            "area": "Blue Area",
            "logo_url": "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=128&auto=format&fit=crop&q=80"
        },
        {
            "_id": ObjectId("660000000000000000000005"),
            "name": "Broadway Pizza",
            "city": "Islamabad",
            "area": "G-9 Markaz",
            "logo_url": "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=128&auto=format&fit=crop&q=80"
        }
    ]

    restaurants_col.insert_many(restaurants_data)
    print(f"Inserted {len(restaurants_data)} restaurants.")

    menu_items_data = [
        # KFC Items
        {
            "restaurant_id": ObjectId("660000000000000000000001"),
            "item_name": "Krunch Burger",
            "price": 310,
            "serving_size": 1,
            "type": "Single"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000001"),
            "item_name": "Zinger Burger Combo",
            "price": 650,
            "serving_size": 1,
            "type": "Single"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000001"),
            "item_name": "Family Festival 1 (4 Zinger Burgers + 4 Fries + 1.5L Drink)",
            "price": 2450,
            "serving_size": 4,
            "type": "Deal"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000001"),
            "item_name": "Mitao Bhook Duo (2 Krunch Burgers + 2 Chicken Pieces + 2 Drinks)",
            "price": 1050,
            "serving_size": 2,
            "type": "Deal"
        },

        # Cheezious Items
        {
            "restaurant_id": ObjectId("660000000000000000000002"),
            "item_name": "Special Regular Pizza",
            "price": 990,
            "serving_size": 2,
            "type": "Deal"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000002"),
            "item_name": "Crown Crust Large Pizza",
            "price": 1850,
            "serving_size": 4,
            "type": "Deal"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000002"),
            "item_name": "Baita Deal (1 Baita Burger + Reg Fries + Drink)",
            "price": 590,
            "serving_size": 1,
            "type": "Single"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000002"),
            "item_name": "Cheezious Squad Feast (2 Large Pizzas + 1 Garlic Bread + 1.5L Drink)",
            "price": 3200,
            "serving_size": 6,
            "type": "Deal"
        },

        # Ranchers Items
        {
            "restaurant_id": ObjectId("660000000000000000000003"),
            "item_name": "Rodeo Single Burger",
            "price": 490,
            "serving_size": 1,
            "type": "Single"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000003"),
            "item_name": "Cowboy Feast for 3 (3 Rodeo Burgers + Large Fries + 3 Drinks)",
            "price": 1690,
            "serving_size": 3,
            "type": "Deal"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000003"),
            "item_name": "Outlaw Squad Deal (4 Crispy Burgers + Loaded Fries + 1.5L Drink)",
            "price": 1950,
            "serving_size": 4,
            "type": "Deal"
        },

        # OPTP Items
        {
            "restaurant_id": ObjectId("660000000000000000000004"),
            "item_name": "GMC Burger (Gourmet Monster Chicken)",
            "price": 550,
            "serving_size": 1,
            "type": "Single"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000004"),
            "item_name": "Original Belgian Fries (Large)",
            "price": 390,
            "serving_size": 1,
            "type": "Single"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000004"),
            "item_name": "OPTP Buddy Box (2 GMC Burgers + 1 Large Mayo Fries + 2 Drinks)",
            "price": 1250,
            "serving_size": 2,
            "type": "Deal"
        },

        # Broadway Pizza Items
        {
            "restaurant_id": ObjectId("660000000000000000000005"),
            "item_name": "10-inch Medium Pizza Deal (Includes 2 Soft Drinks)",
            "price": 1390,
            "serving_size": 2,
            "type": "Deal"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000005"),
            "item_name": "13-inch Large Pizza Feast (Includes 1.5L Drink)",
            "price": 1990,
            "serving_size": 4,
            "type": "Deal"
        },
        {
            "restaurant_id": ObjectId("660000000000000000000005"),
            "item_name": "Pocket Calzone & Drink",
            "price": 450,
            "serving_size": 1,
            "type": "Single"
        }
    ]

    menu_items_col.insert_many(menu_items_data)
    print(f"Inserted {len(menu_items_data)} menu items.")
    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()
