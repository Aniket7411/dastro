export const SHOP_CATEGORIES = [
  {
    name: 'Premium Gemstones',
    desc: 'Certified & Authentic Gems',
    image: '/images/shop-gemstones.png',
    count: '120+ Items',
    path: 'gemstones',
    accent: '#8B4A1E',
  },
  {
    name: 'Sacred Rudraksha',
    desc: 'Energized Himalayan Beads',
    image: '/images/shop-rudraksha.png',
    count: '45+ Items',
    path: 'rudraksha',
    accent: '#C8832A',
  },
  {
    name: 'Vedic Yantras',
    desc: 'Geometric Energy Shields',
    image: '/images/shop-yantras.png',
    count: '30+ Items',
    path: 'yantras',
    accent: '#5C2D12',
  },
  {
    name: 'Puja Essentials',
    desc: 'Pure Ritual Components',
    image: '/images/shop-puja.png',
    count: '85+ Items',
    path: 'puja-kits',
    accent: '#8B4A1E',
  },
];

export const FEATURED_PRODUCTS = [
  {
    id: 1,
    name: 'Natural Blue Sapphire (Neelam)',
    price: '₹15,000',
    priceNum: 15000,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=400',
    tag: 'Top Choice',
    category: 'gemstones',
    inStock: true,
  },
  {
    id: 2,
    name: '7 Mukhi Rudraksha Bead',
    price: '₹2,500',
    priceNum: 2500,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1605000797439-75a150088f44?auto=format&fit=crop&q=80&w=400',
    tag: 'Energized',
    category: 'rudraksha',
    inStock: true,
  },
  {
    id: 3,
    name: 'Shree Yantra Gold Plated',
    price: '₹4,999',
    priceNum: 4999,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=400',
    tag: 'Powerful',
    category: 'yantras',
    inStock: true,
  },
  {
    id: 4,
    name: 'Crystal Quartz Healing Mala',
    price: '₹1,200',
    priceNum: 1200,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1596944229581-7951ef4957ad?auto=format&fit=crop&q=80&w=400',
    tag: 'Pure',
    category: 'puja-kits',
    inStock: true,
  },
  {
    id: 5,
    name: 'Panna (Emerald) - Zambian',
    price: '₹8,400',
    priceNum: 8400,
    rating: 4,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400',
    tag: 'Certified',
    category: 'gemstones',
    inStock: true,
  },
  {
    id: 6,
    name: '5 Mukhi Rudraksha Mala',
    price: '₹450',
    priceNum: 450,
    rating: 5,
    image: 'https://images.unsplash.com/photo-1605000797439-75a150088f44?auto=format&fit=crop&q=80&w=400',
    tag: 'Bestseller',
    category: 'rudraksha',
    inStock: true,
  },
];

export const SHOP_CATALOG = {
  gemstones: {
    title: 'Premium Gemstones',
    desc: 'Authentic and certified gemstones for planetary balance and prosperity.',
    banner: '/images/shop-gemstones.png',
    products: [
      { id: 1, name: 'Natural Blue Sapphire (Neelam)', price: '₹12,500', priceNum: 12500, rating: 5, image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 2, name: 'Panna (Emerald) - Zambian', price: '₹8,400', priceNum: 8400, rating: 4, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 3, name: 'Red Coral (Moonga)', price: '₹4,200', priceNum: 4200, rating: 5, image: 'https://images.unsplash.com/photo-1588444839799-eb00f490a6d8?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 4, name: 'Yellow Sapphire (Pukhraj)', price: '₹15,000', priceNum: 15000, rating: 5, image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=400', inStock: false },
      { id: 5, name: 'Ruby (Manik) - Burma', price: '₹22,000', priceNum: 22000, rating: 5, image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 6, name: 'Pearl (Moti) - South Sea', price: '₹6,800', priceNum: 6800, rating: 4, image: 'https://images.unsplash.com/photo-1596944229581-7951ef4957ad?auto=format&fit=crop&q=80&w=400', inStock: true },
    ],
  },
  rudraksha: {
    title: 'Sacred Rudraksha',
    desc: 'Divine beads from the Himalayas for protection and spiritual growth.',
    banner: '/images/shop-rudraksha.png',
    products: [
      { id: 1, name: '5 Mukhi Rudraksha Mala', price: '₹450', priceNum: 450, rating: 5, image: 'https://images.unsplash.com/photo-1605000797439-75a150088f44?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 2, name: '7 Mukhi Rudraksha Bead', price: '₹2,500', priceNum: 2500, rating: 5, image: 'https://images.unsplash.com/photo-1596944229581-7951ef4957ad?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 3, name: '12 Mukhi Surya Rudraksha', price: '₹5,500', priceNum: 5500, rating: 5, image: 'https://images.unsplash.com/photo-1605000797439-75a150088f44?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 4, name: 'Gauri Shankar Rudraksha', price: '₹8,000', priceNum: 8000, rating: 5, image: 'https://images.unsplash.com/photo-1596944229581-7951ef4957ad?auto=format&fit=crop&q=80&w=400', inStock: false },
    ],
  },
  yantras: {
    title: 'Vedic Yantras',
    desc: 'Sacred geometrical diagrams for attracting positive cosmic energy.',
    banner: '/images/shop-yantras.png',
    products: [
      { id: 1, name: 'Shree Yantra - 24k Gold Plated', price: '₹3,999', priceNum: 3999, rating: 5, image: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 2, name: 'Kuber Yantra for Wealth', price: '₹1,500', priceNum: 1500, rating: 4, image: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 3, name: 'Mahamrityunjay Yantra', price: '₹2,100', priceNum: 2100, rating: 5, image: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 4, name: 'Vyapar Vriddhi Yantra', price: '₹2,500', priceNum: 2500, rating: 5, image: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=400', inStock: true },
    ],
  },
  'puja-kits': {
    title: 'Premium Puja Kits',
    desc: 'Complete ceremonial sets for rituals, festivals, and spiritual practices.',
    banner: '/images/shop-puja.png',
    products: [
      { id: 1, name: 'Diwali Maha Puja Kit', price: '₹4,500', priceNum: 4500, rating: 5, image: 'https://images.unsplash.com/photo-1596944229581-7951ef4957ad?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 2, name: 'Navratri Durga Puja Set', price: '₹3,200', priceNum: 3200, rating: 5, image: 'https://images.unsplash.com/photo-1596944229581-7951ef4957ad?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 3, name: 'Daily Morning Puja Box', price: '₹1,200', priceNum: 1200, rating: 4, image: 'https://images.unsplash.com/photo-1596944229581-7951ef4957ad?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 4, name: 'Havan Samagri Premium', price: '₹850', priceNum: 850, rating: 5, image: 'https://images.unsplash.com/photo-1596944229581-7951ef4957ad?auto=format&fit=crop&q=80&w=400', inStock: true },
    ],
  },
  bracelets: {
    title: 'Cosmic Bracelets',
    desc: 'Fashionable healing jewelry energized with planetary vibrations.',
    banner: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=1200',
    products: [
      { id: 1, name: 'Amethyst Healing Bracelet', price: '₹899', priceNum: 899, rating: 5, image: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 2, name: 'Rose Quartz Love Bracelet', price: '₹750', priceNum: 750, rating: 5, image: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 3, name: 'Evil Eye Protection Bracelet', price: '₹650', priceNum: 650, rating: 5, image: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=400', inStock: true },
      { id: 4, name: '7 Chakra Balance Bracelet', price: '₹1,100', priceNum: 1100, rating: 5, image: 'https://images.unsplash.com/photo-1590736962100-36940a08e16a?auto=format&fit=crop&q=80&w=400', inStock: false },
    ],
  },
};

export function filterShopProducts(products, { search = '', sort = 'featured', minRating = 0, priceRange = 'all', inStockOnly = false }) {
  let list = [...products];

  if (search.trim()) {
    const q = search.trim().toLowerCase();
    list = list.filter((p) => p.name.toLowerCase().includes(q));
  }

  if (minRating > 0) {
    list = list.filter((p) => p.rating >= minRating);
  }

  if (inStockOnly) {
    list = list.filter((p) => p.inStock !== false);
  }

  if (priceRange === 'under1k') list = list.filter((p) => p.priceNum < 1000);
  else if (priceRange === '1k-5k') list = list.filter((p) => p.priceNum >= 1000 && p.priceNum <= 5000);
  else if (priceRange === '5k+') list = list.filter((p) => p.priceNum > 5000);

  if (sort === 'price-asc') list.sort((a, b) => a.priceNum - b.priceNum);
  else if (sort === 'price-desc') list.sort((a, b) => b.priceNum - a.priceNum);
  else if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);

  return list;
}
