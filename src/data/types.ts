export type ListingStatus = "buy" | "rent";

export type PropertyType =
  | "Apartment"
  | "Villa"
  | "Penthouse"
  | "Townhouse"
  | "Office"
  | "Land";

export interface Agent {
  id: string;
  slug: string;
  name: string;
  title: string;
  location: string;
  nationality: string;
  rating: number;
  reviews: number;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
  bio: string;
  languages: string[];
  specialties: string[];
  featured?: boolean;
  /** Populated by the /agents list page; not stored on the agent row. */
  listingsCount?: number;
}

export interface AgentSummary {
  id: string;
  slug: string;
  name: string;
  title: string;
  photo: string;
  phone: string;
  whatsapp: string;
  email: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  status: ListingStatus;
  type: PropertyType;
  featured: boolean;
  area: string;
  city: string;
  price: number;
  priceUnit: "total" | "month";
  beds: number;
  baths: number;
  size: number;
  yearBuilt: number;
  lat: number;
  lng: number;
  description: string;
  amenities: string[];
  images: string[];
  agentId: string;
  reference: string;
  agent?: AgentSummary | null;
  pfAgentName?: string | null;
  pfAgentPhoto?: string | null;
  pfAgentPhone?: string | null;
  pfAgentWhatsapp?: string | null;
  pfAgentEmail?: string | null;
  pfAgentTitle?: string | null;
  source: "manual" | "property_finder";
  externalUrl?: string | null;
}

export type OffPlanStatus = "Pre-Launch" | "Off-Plan" | "Under Construction" | "Nearing Completion";

export interface OffPlanProject {
  id: string;
  slug: string;
  name: string;
  developer: string;
  status: OffPlanStatus;
  area: string;
  city: string;
  handover: string;
  startingPrice: number;
  unitTypes: string[];
  minSize: number;
  maxSize: number;
  paymentPlan: string;
  description: string;
  amenities: string[];
  images: string[];
  featured: boolean;
  reference: string;
  agentId: string;
  lat: number;
  lng: number;
  brochureUrl?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: string;
  published: boolean;
  publishedAt: string | null;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  rating: number;
}

