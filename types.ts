export enum OrderStatus {
  PENDING = 'PENDING',
  COOKING = 'COOKING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isPopular?: boolean;
  category: 'main' | 'drink' | 'extra';
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  timestamp: number;
  note?: string;
}

export interface AIChefResponse {
  description: string;
  pairingSuggestion: string;
}