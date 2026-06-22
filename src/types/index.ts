export interface User {
  _id: string;
  username: string;
  email: string;
  mobile: string;
  role: 'user' | 'admin';
  subscriptionName: string | null;
  subscriptionExpiry: string | null;
  purchasedComics: Comic[];
  readingHistory: Comic[];
  token?: string;
}

export interface Comic {
  _id: string;
  id?: string;
  title: string;
  author: string;
  price: number;
  description?: string;
  coverImage?: string;
  img?: string;          // mapped alias for coverImage used in App.tsx data loader
  genre?: string;
  tagline?: string;
  synopsis?: string;
  creator?: string;
  issuesInfo?: string;
  pageCount?: number;
  accentColor?: string;
  pdfUrl?: string;
  pages?: string[];
  badge?: string;
  categories?: string[] | Category[];
  rating?: number;
  publishedDate?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface CartItem extends Comic {
  quantity?: number;
}

export interface Order {
  _id: string;
  user: User;
  itemType: 'comic' | 'subscription';
  comicId: Comic | null;
  subscriptionName: string | null;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  status: string;
  createdAt: string;
}

export interface HeroSlide {
  _id: string;
  title: string;
  subtitle: string;
  image: string;
  ctaText: string;
  ctaLink: string;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}
