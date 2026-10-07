export interface Restaurant {
  id: string;
  name: string;
  city: string;
  area: string;
  logo_url: string;
}

export interface MenuItem {
  id: string;
  name: string;
  quantity: number;
  serving_size: number;
  unit_price: number;
  total_price: number;
  type: "Deal" | "Single";
}

export interface MatchOption {
  id: string;
  restaurant: Restaurant;
  items: MenuItem[];
  total_servings: number;
  total_price: number;
  budget: number;
  amount_saved: number;
  cost_per_person: number;
  headline: string;
  score: number;
}

export interface MatchResponse {
  query: {
    budget: number;
    persons: number;
    city: string;
    per_head_budget: number;
  };
  count: number;
  options: MatchOption[];
}
