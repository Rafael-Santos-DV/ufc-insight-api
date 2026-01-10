import { UfcApiResponse, UfcInsightApiResponse } from "../types/index.js";

export class UfcService {
  private readonly api =
    "https://www.paramountplus.com/shows/ufc-portugues/xhr/episodes/page/0/size/18/xs/0/season";

  constructor() {}

  public async events() {
    const events = await fetch(this.api, {
      method: "GET",
    });

    const {
      result: { data },
    } = (await events.json()) as UfcApiResponse;

    const customData: UfcInsightApiResponse[] = data.map((fighter) => ({
      title: fighter.title,
      seriesTitle: fighter.series_title[0],
      label: fighter.label,
      shortDescription: fighter.shortDescription,
      description: fighter.description,
      thumbnails: fighter.thumb,
      type: fighter.type,
      genre: fighter.genre,
      streaming: fighter.live_streaming_url,
      urls: {
        pageUrl: fighter.url,
        appUrl: fighter.app_url,
        rawUrl: fighter.raw_url,
      },
      status: fighter.status,
      brand: fighter.brand,
      airDateISO: fighter.airdate_iso,
      airDateTimestamp: fighter.airdate,
      expiryDateISO: fighter.airdate_iso,
      durationLabel: fighter.duration,
      durationSeconds: fighter.duration_raw,
      seasonNumber: fighter.season_number,
      episodeNumber: fighter.episode_number,
      contentId: fighter.content_id,
    }));

    return customData;
  }
}
