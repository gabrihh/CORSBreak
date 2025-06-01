export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    res.status(400).json({ error: "Missing 'url' parameter" });
    return;
  }
  try {
    const response = await fetch(url);
    const headers = {};
    response.headers.forEach((value, key) => (headers[key] = value));

    res.status(response.status);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Content-Type", headers["content-type"] || "application/octet-stream");

    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
      }
