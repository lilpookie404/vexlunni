export type SpikeStatus = {
  service: string;
  message: string;
};

export async function getSpikeStatus(
  fetcher: typeof fetch = fetch,
): Promise<SpikeStatus> {
  const response = await fetcher("/api/spike");

  if (!response.ok) {
    throw new Error(`API request failed (${response.status})`);
  }

  return (await response.json()) as SpikeStatus;
}
