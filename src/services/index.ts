import { FastifyRedis } from "@fastify/redis";
import { UfcApiResponse, UfcInsightApiResponse } from "../types/index.js";

type GetEventsParams = {
  skip: number;
  limit: number;
};
type APIS = {
  url: string;
  pages: number;
  season?: Array<number>;
}[];

export class UfcService {
  private readonly api =
    "https://www.paramountplus.com/shows/ufc-portugues/xhr/episodes";

  private readonly apis = JSON.parse(process.env.APIS as string) as APIS;

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
        },
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

  public getEvent = async (eventName = "") => {
    console.time("MeuProcesso");

    const CACHE_KEY = "events:all";

    const cacheData = await this.fastifyRedis.get(CACHE_KEY);

    if (cacheData) {
      console.log("Serving from cache");
      const events: UfcInsightApiResponse[] = JSON.parse(cacheData);

      return events.filter((event) =>
        event.title.toLocaleLowerCase().includes(eventName.toLocaleLowerCase()),
      );
    }

    console.log("Cache miss: New fetch started");

    const fetchPromises = this.apis.map((api) => {
      if (api.season) {
        return api.season.map(async (season) => {
          try {
            const res = await fetch(
              `${api.url}/page/${0}/size/${50}/xs/0/season/${season}`,
            );

            if (!res.ok) throw new Error(`Erro na API: ${res.status}`);

            return await res.json();
          } catch (error) {
            console.error(
              `Falha ao buscar ${api.url} temporada ${season}:`,
              error,
            );
            return [];
          }
        }) as Promise<UfcApiResponse>[];
      }

      return Array.from({ length: api.pages }).map(async (_, page) => {
        try {
          const res = await fetch(
            `${api.url}/page/${page}/size/${50}/xs/0/season`,
          );

          if (!res.ok) throw new Error(`Erro na API: ${res.status}`);

          return await res.json();
        } catch (error) {
          console.error(`Falha ao buscar ${api.url} página ${page}:`, error);
          return [];
        }
      }) as Promise<UfcApiResponse>[];
    });

    const responses: UfcApiResponse[] = await Promise.all(
      fetchPromises.flatMap((item) => item),
    );

    const allRawData = responses.flatMap((res) => res.result.data);

    console.log({
      paginas: responses
        .map((r, i) => `Pág ${i}: ${r.result.data.length}`)
        .join(", "),
      total: allRawData.length,
    });

    const events: UfcInsightApiResponse[] = allRawData.map((event) => ({
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

    await this.fastifyRedis.set(
      "events:all",
      JSON.stringify(events),
      "EX",
      3600,
    );

    if (!eventName) {
      return events;
    }

    return events.filter((event) =>
      event.title.toLocaleLowerCase().includes(eventName.toLocaleLowerCase()),
    );
  };
}
