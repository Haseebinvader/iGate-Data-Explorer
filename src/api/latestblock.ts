import type { VercelRequest, VercelResponse } from "@vercel/node";

// Shape of the Blockchain.info `/latestblock` response
interface LatestBlockResponse {
  hash: string;
  time: number;
  block_index: number;
  height: number;
  txIndexes: number[];
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  try {
    const response = await fetch("https://blockchain.info/latestblock");

    if (!response.ok) {
      res.status(response.status).json({
        error: `Upstream API error: ${response.statusText}`,
      });
      return;
    }

    const data: LatestBlockResponse = await response.json();
    res.status(200).json(data);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown server error";
    res.status(500).json({ error: message });
  }
}
