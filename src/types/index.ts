export interface UFCData {
  contentId: string;
  title: string;
  label: string;
  description: string;
  shortDescription: string;

  type: "Full Episode";
  genre: "Sports";
  brand: string;

  seriesTitle: string;
  seasonNumber: string; // ex: "319"
  episodeNumber: string; // ex: "12"

  durationSeconds: number;
  durationLabel: string; // ex: "16M"

  airDateISO: string;
  airDateTimestamp: number;

  expiryDateISO: string;

  rating: ContentRating;

  thumbnails: Thumbnails;

  urls: VideoURLs;

  streaming: StreamingInfo;

  status: "AVAILABLE" | "UNAVAILABLE";
  isPaid: boolean;
  isLive: boolean;
}

export interface ContentRating {
  region: string; // "BR"
  rating: string; // "14"
  descriptors: RatingDescriptor[];
}

export interface RatingDescriptor {
  code: string; // "LI", "VE"
  description: string; // "Linguagem Imprópria", "Violência Extrema"
}

export interface Thumbnails {
  small: string;
  large: string;
  w640h360: string;
  w640h480: string;
  poster?: string | null;
}

export interface VideoURLs {
  pageUrl: string;
  appUrl: string;
  rawUrl: string;
}

export interface StreamingInfo {
  mpdUrl: string;
  isProtected: boolean;
  drm: boolean;
}
