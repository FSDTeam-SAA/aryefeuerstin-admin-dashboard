// Plan item
export interface Plan {
  _id: string;
  title: string;
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
  status: "active" | "inactive";
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  totalSubscribers: number;
}

// Pagination info
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// API data wrapper
export interface PlansData {
  items: Plan[];
  pagination: Pagination;
}

// Full API response
export interface PlansApiResponse {
  status: boolean;
  message: string;
  data: PlansData;
}
