import { FastifyRedis } from "@fastify/redis";
import { UfcApiResponse, UfcInsightApiResponse } from "../types/index.js";

type GetEventsParams = {
  skip: number;
  limit: number;
};
export class UfcService {
  private readonly api =
    "https://www.paramountplus.com/shows/ufc-portugues/xhr/episodes";

  constructor(private fastifyRedis: FastifyRedis) {}

  public async getEvents({
    limit,
    skip,
  }: GetEventsParams): Promise<UfcInsightApiResponse[]> {
    try {
      const events = await fetch(
        `${this.api}/page/${skip}/size/${limit}/xs/0/season`,
        {
          method: "GET",
        }
      );

      const {
        result: { data },
      } = (await events.json()) as UfcApiResponse;

      return data.map((event) => ({
        title: event.title,
        seriesTitle: event.series_title[0],
        label: event.label,
        shortDescription: event.shortDescription,
        description: event.description,
        thumbnails: event.thumb,
        type: event.type,
        genre: event.genre,
        streaming: {
          streamingUrl: event.streaming_url,
          liveStreamingUrl: event.live_streaming_url,
        },
        urls: {
          pageUrl: event.url,
          appUrl: event.app_url,
          rawUrl: event.raw_url,
        },
        status: event.status,
        brand: event.brand,
        airDateISO: event.airdate_iso,
        airDateTimestamp: event.airdate,
        expiryDateISO: event.airdate_iso,
        durationLabel: event.duration,
        durationSeconds: event.duration_raw,
        seasonNumber: event.season_number,
        episodeNumber: event.episode_number,
        contentId: event.content_id,
      }));
    } catch (err) {
      throw new Error("Failed to fetch UFC getEvents");
    }
  }

  public getEvent = async (eventName: string) => {
    let events: UfcInsightApiResponse[] | null = null;

    events =
      JSON.parse((await this.fastifyRedis.get("events:all")) as string) ?? null;

    if (!events) {
      console.log("new fetch");
      const response = await fetch(
        `${this.api}/page/${0}/size/${100}/xs/0/season`,
        {
          method: "GET",
        }
      );

      const {
        result: { data },
      } = (await response.json()) as UfcApiResponse;

      events = data.map((event) => ({
        title: event.title,
        seriesTitle: event.series_title[0],
        label: event.label,
        shortDescription: event.shortDescription,
        description: event.description,
        thumbnails: event.thumb,
        type: event.type,
        genre: event.genre,
        streaming: {
          streamingUrl: event.streaming_url,
          liveStreamingUrl: event.live_streaming_url,
        },
        urls: {
          pageUrl: event.url,
          appUrl: event.app_url,
          rawUrl: event.raw_url,
        },
        status: event.status,
        brand: event.brand,
        airDateISO: event.airdate_iso,
        airDateTimestamp: event.airdate,
        expiryDateISO: event.airdate_iso,
        durationLabel: event.duration,
        durationSeconds: event.duration_raw,
        seasonNumber: event.season_number,
        episodeNumber: event.episode_number,
        contentId: event.content_id,
      }));

      await this.fastifyRedis.set("events:all", JSON.stringify(events));
    }

    console.log("events cache");

    return events;
  };
}
