import { CommodityItem, EventItem, NewsItem, ReportItem, StockMarketData } from './types';

export const STOCK_DATA: Record<string, StockMarketData> = {
  ASX: {
    symbol: 'BHP',
    exchange: 'ASX',
    name: 'BHP Group Ltd (BHP)',
    price: '60.20',
    currency: 'AUD',
    currencyDisplay: 'Price displayed in AUD:',
    changePercent: '+1.60%',
    isPositive: true,
    timestamp: 'As of 2026-09-17 03:03:07 AEST',
  },
  LSE: {
    symbol: 'BHP',
    exchange: 'LSE',
    name: 'BHP Group Ltd (BHP)',
    price: '2,185.00',
    currency: 'GBX',
    currencyDisplay: 'Price displayed in GBX:',
    changePercent: '+0.92%',
    isPositive: true,
    timestamp: 'As of 2026-09-16 16:35:12 BST',
  },
  NYSE: {
    symbol: 'BHP',
    exchange: 'NYSE (Ltd ADR)',
    name: 'BHP Group Ltd ADR (BHP)',
    price: '58.45',
    currency: 'USD',
    currencyDisplay: 'Price displayed in USD:',
    changePercent: '+1.24%',
    isPositive: true,
    timestamp: 'As of 2026-09-16 16:00:02 EDT',
  },
  JSE: {
    symbol: 'BHG',
    exchange: 'JSE',
    name: 'BHP Group Ltd (BHG)',
    price: '74,250',
    currency: 'ZAc',
    currencyDisplay: 'Price displayed in ZAc:',
    changePercent: '+1.45%',
    isPositive: true,
    timestamp: 'As of 2026-09-16 17:10:00 SAST',
  },
};

export const COMMODITIES: CommodityItem[] = [
  {
    id: 'copper',
    name: 'Copper',
    description:
      'Copper has electricity conducting, corrosion resistance and antimicrobial properties and is used in everyday household products.',
    secondaryText:
      'Critical for renewable energy systems, wind turbines, electric vehicles, battery storage and modern power grids.',
    ctaText: 'Find out more',
    // Authentic copper electrowinning / cathode refining industrial facility photo
    imageUrl:
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { label: 'Global Rank', value: '#1 in Scale' },
      { label: 'Key Operations', value: 'Escondida & Olympic Dam' },
    ],
  },
  {
    id: 'iron-ore',
    name: 'Iron ore',
    description:
      'Iron ore is the primary raw material used to produce steel – the foundation of modern infrastructure, transport systems and low-carbon tech.',
    secondaryText:
      'Our Western Australia Iron Ore (WAIO) operations comprise a complex integrated system of four processing hubs and two port facilities.',
    ctaText: 'Find out more',
    imageUrl:
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { label: 'Annual Output', value: '250+ Mt' },
      { label: 'Asset', value: 'Western Australia (WAIO)' },
    ],
  },
  {
    id: 'steelmaking-coal',
    name: 'Steelmaking coal',
    description:
      'High-quality metallurgical coal enables primary steel production, creating materials essential for wind turbines, rail networks and construction.',
    secondaryText:
      'BHP operates world-class metallurgical coal assets in the Bowen Basin in Queensland, Australia through BMA.',
    ctaText: 'Find out more',
    imageUrl:
      'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { label: 'Product Type', value: 'Premium Hard Coking Coal' },
      { label: 'Location', value: 'Bowen Basin, Queensland' },
    ],
  },
  {
    id: 'potash',
    name: 'Potash',
    description:
      'Potash is a potassium-rich fertilizer crucial for global food security, improving plant water retention, crop yield and nutrient density.',
    secondaryText:
      'Our Jansen project in Saskatchewan, Canada will be one of the modern, lowest-cost and lowest-emission potash mines in the world.',
    ctaText: 'Find out more',
    imageUrl:
      'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    stats: [
      { label: 'Project', value: 'Jansen Stage 1 & 2' },
      { label: 'Expected Production', value: '8.5 Mtpa' },
    ],
  },
];

export const NEWS_ARTICLES: NewsItem[] = [
  {
    id: 'news-1',
    badges: ['CASE STUDY', 'NEWS', 'SUSTAINABILITY'],
    title: 'BHP supports mobile creative studio in partnership with Curtin University',
    date: '12 Sep 2026',
    readTime: '3 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    linkText: 'Read article',
  },
  {
    id: 'news-2',
    badges: ['NEWS'],
    title: 'New Rio Doce Agreement transfers over R$ 1.2 billion in new payments for reparations',
    date: '08 Sep 2026',
    readTime: '4 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80',
    linkText: 'Read article',
  },
  {
    id: 'news-3',
    badges: ['NEWS'],
    title: 'Novo Acordo do Rio Doce repassa mais de R$ 1,2 bilhão em novos pagamentos para a reparação',
    date: '08 Sep 2026',
    readTime: '4 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&w=800&q=80',
    linkText: 'Ler notícia',
  },
  {
    id: 'news-4',
    badges: ['COMMUNITY', 'SUSTAINABILITY'],
    title: 'Jansen Potash project accelerates community training initiatives across Saskatchewan',
    date: '02 Sep 2026',
    readTime: '5 min read',
    imageUrl:
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    linkText: 'Read article',
  },
];

export const REPORTS: ReportItem[] = [
  {
    id: 'rep-1',
    tag: 'Our latest reports',
    title: 'Reflecting our long-term commitment to transparency.',
    description:
      "Learn more about our achievements and financial, economic, social and environmental performance in BHP's Annual, Economic Contribution and Sustainability reports.",
    downloadUrl: '#',
    pageCount: '194 pages',
    year: '2026',
    imageUrl:
      'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'rep-2',
    tag: 'Climate Action Report',
    title: 'Decarbonisation and Climate Transition Action Plan 2026.',
    description:
      'Detailed tracking of our operational Scope 1 & 2 emissions reduction pathway, partner collaborations for Scope 3 steelmaking, and renewable power contracts.',
    downloadUrl: '#',
    pageCount: '88 pages',
    year: '2026',
    imageUrl:
      'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'rep-3',
    tag: 'Economic Contribution',
    title: 'Generating shared sustainable value across communities.',
    description:
      'In FY2026, BHP contributed over $45 billion to suppliers, governments, shareholders and local communities through taxes, royalties, and community investment.',
    downloadUrl: '#',
    pageCount: '64 pages',
    year: '2026',
    imageUrl:
      'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=1200&q=80',
  },
];

export const UPCOMING_EVENTS: EventItem[] = [
  {
    id: 'event-1',
    day: '20',
    month: 'OCT',
    year: '2026',
    title: 'BHP Operational Review',
    description: 'for the quarter ended 30 September 2026',
    time: '08:30 AEST / 22:30 GMT',
    location: 'Melbourne, Australia & Live Global Webcast',
    status: 'Upcoming',
  },
];
