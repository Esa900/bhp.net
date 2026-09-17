export interface StockMarketData {
  symbol: string;
  exchange: string;
  name: string;
  price: string;
  currency: string;
  currencyDisplay: string;
  changePercent: string;
  isPositive: boolean;
  timestamp: string;
}

export interface CommodityItem {
  id: string;
  name: string;
  description: string;
  secondaryText: string;
  ctaText: string;
  imageUrl: string;
  stats: {
    label: string;
    value: string;
  }[];
}

export interface NewsItem {
  id: string;
  title: string;
  badges: string[];
  date: string;
  readTime: string;
  imageUrl: string;
  linkText: string;
}

export interface ReportItem {
  id: string;
  tag: string;
  title: string;
  description: string;
  downloadUrl: string;
  pageCount: string;
  year: string;
  imageUrl: string;
}

export interface EventItem {
  id: string;
  day: string;
  month: string;
  year: string;
  title: string;
  description: string;
  time: string;
  location: string;
  status: 'Upcoming' | 'Webcast Available' | 'Completed';
}
