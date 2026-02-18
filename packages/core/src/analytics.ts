export interface AnalyticsClient {
  track: (event: string, payload?: Record<string, unknown>) => void;
  identify: (userId: string, traits?: Record<string, unknown>) => void;
}

export const analyticsClient: AnalyticsClient = {
  track: (event, payload) => {
    console.info('[analytics] track', event, payload ?? {});
  },
  identify: (userId, traits) => {
    console.info('[analytics] identify', userId, traits ?? {});
  },
};
