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

export interface AttachedDoc {
  id: string;
  name: string;
  size: string;
  type: 'pdf' | 'image' | 'other';
  dataUrl: string; // Base64 or external URL
  uploadDate: string;
}

export interface AdminPost {
  id: string;
  title: string;
  refNumber: string;
  content: string; // Description
  category: string;
  author: string;
  date: string;
  status: 'Published' | 'Draft';
  imageUrl: string; // Primary featured image
  galleryImages: string[]; // All uploaded pictures
  attachedDocuments: AttachedDoc[]; // PDF & Document upload option
  readTime: string;
  badges: string[];

  // Customer / Candidate Details for Full PDF Generation
  candidateName?: string;
  candidatePhotoUrl?: string;
  passportNumber?: string;
  nationality?: string;
  dateOfBirth?: string;
  jobTitle?: string;
  employerName?: string;
  workLocation?: string;
  salaryPackage?: string;
  visaSubclass?: string;
  issueDate?: string;
  expiryDate?: string;
  verificationIdNo?: string;
}

export interface PostCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
}
