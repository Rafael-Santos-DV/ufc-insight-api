import { FastifyReply, FastifyRequest } from "fastify";

export interface UfcApiResponse {
  result: UfcResult;
  success: boolean;
}

export interface UfcResult {
  title: string;
  data: UfcEpisode[];
  total: number;
}

export interface UfcEpisode {
  type: string;
  title: string;
  series_title: string;
  label: string;
  content_id: string;

  airdate: string;
  airdate_ts: number;
  airdate_iso: string;
  expiredate_raw: string;

  season_number: string;
  episode_number: string;

  duration: string;
  duration_raw: number;

  rating: string;
  description: string;
  shortDescription: string;

  thumb: UfcThumbnails;

  url: string;
  app_url: string;

  amazon_est_url: string;
  itunes_est_url: string;

  streaming_url: string;
  live_streaming_url: string;

  status: string;
  expiry_date: string;

  is_paid_content: boolean;
  is_live: boolean;

  genre: string;
  brand: string;

  regionalRatings: RegionalRating;
  metaData: MetaData;

  apiMetadata: ApiMetadata;

  media_content_type: string;
  raw_url: string;

  episode_title: string;
  displayTitle: string;
  displayDescription: string;

  isUserSubscriber: boolean;
  is_protected: boolean;
}

export interface UfcThumbnails {
  large: string;
  small: string;
  "640x360": string;
  "640x480": string;
  "1400x2100": string;
  poster: string | null;
}

export interface RegionalRating {
  region: string;
  rating: string;
  disclaimer: string | null;
  secondaryDescriptors: string | null;
  subratings: SubRating[];
  consumerAdvice: string | null;
  ratingIcon: string;
}

export interface MetaData {
  airdate_iso: string;
  airdate_tv: boolean;
  brand: string;
  contentId: string;
  episodeNumber: string;
  seasonNumber: string;
  seriesTitle: string;
  videoLength: number;
  videoTitle: string;
  label: string;
  rating: string;
  fullEpisode: boolean;
  subscriptionLevel: "PAID" | "FREE";
  regionalRatings: RegionalRating[];
}

export interface ApiMetadata {
  genre: string;
  status: string;
  airDate: number;
  description: string;
  shortDescription: string;
  label: string;
  fullEpisode: boolean;
  contentId: string;
  title: string;
  episodeNum: string;
  seasonNum: string;
  brand: string;
  seriesTitle: string;
  duration: number;
  rating: string;
  streamingUrl: string;
  expirationDate: number;
  isLive: boolean;
  isProtected: boolean;
  availableForProfileTypes: string[];
}

export interface SubRating {
  code: string;
  description: string;
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

export interface VideoURLs {
  pageUrl: string;
  appUrl: string;
  rawUrl: string;
}

export type IFastifyRequest = FastifyRequest & FastifyReply;

export interface UfcInsightApiResponse {
  contentId: string;
  title: string;
  label: string;
  description: string;
  shortDescription: string;

  type: string;
  genre: string;
  brand: string;

  seriesTitle: string;
  seasonNumber: string; // ex: "319"
  episodeNumber: string; // ex: "12"

  durationSeconds: number;
  durationLabel: string; // ex: "16M"

  airDateISO: string;
  airDateTimestamp: string;

  expiryDateISO: string;

  thumbnails: UfcThumbnails;
  streaming: {
    streamingUrl: string;
    liveStreamingUrl: string;
  };

  urls: VideoURLs;
}
