import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("🚀 API invoked");

    const response = await fetch("https://blockchain.info/latestblock");
    console.log("🌐 Response status:", response.status);

    if (!response.ok) {
      console.error("❌ Upstream fetch failed");
      return res.status(response.status).json({ error: "Failed to fetch blockchain data" });
    }

    const text = await response.text();
    console.log("📦 Raw text received:", text.slice(0, 200)); // print first 200 chars

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("⚠️ JSON parse error:", err);
      return res.status(500).json({ error: "Invalid JSON from blockchain API" });
    }

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(data);
  } catch (err: any) {
    console.error("🔥 Server Error:", err);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
