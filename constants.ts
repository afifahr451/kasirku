import { MenuItem } from './types';

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Nasi Cumi Hitam Original',
    description: 'Our signature rice dish with savory squid cooked in its own premium black ink sauce. Deep savory flavor.',
    price: 3.00,
    image: 'https://images.unsplash.com/photo-1602184629266-8c74e4e01b88?q=80&w=800&auto=format&fit=crop',
    category: 'main',
    isPopular: true,
    isAvailable: true
  },
  {
    id: '2',
    name: 'Nasi Cumi + Telor Ceplok',
    description: 'The signature black squid rice served with a perfectly fried sunny-side-up egg (Telor Ceplok).',
    price: 3.50,
    image: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?q=80&w=800&auto=format&fit=crop',
    category: 'main',
    isPopular: true,
    isAvailable: true
  },
  {
    id: '3',
    name: 'Nasi Cumi Royal (Komplit)',
    description: 'The ultimate portion. Squid, egg, crispy tofu, and sambal bawang.',
    price: 4.50,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800&auto=format&fit=crop',
    category: 'main',
    isAvailable: true
  },
  {
    id: '4',
    name: 'Es Jeruk Pontianak',
    description: 'Sweet and tangy freshly squeezed orange juice.',
    price: 1.00,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?q=80&w=800&auto=format&fit=crop',
    category: 'drink',
    isAvailable: true
  },
  {
    id: '5',
    name: 'Peyek Kacang',
    description: 'Crispy peanut crackers to add crunch to your meal.',
    price: 0.50,
    image: 'https://images.unsplash.com/photo-1626114260722-f1a5c452143f?q=80&w=800&auto=format&fit=crop',
    category: 'extra',
    isAvailable: true
  }
];

export const CURRENCY_FORMAT = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});