export interface Product {
  id?: string | 0;
  name?: string;
  price?: string;
  amount?: string;
  description?: string;
  manufacturer?: string;
  caregory?: string;
  status?: 'New' | 'Old' | 'Refurbished';
  url?: string;
  image?: string;
}
