export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const urlParam = req.url.split('?url=')[1];
  if (!urlParam) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const targetUrl = decodeURIComponent(urlParam);
  try {
    const response = await fetch(targetUrl);
    const data = await response.text();

    res.setHeader('Content-Type', 'text/plain');
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
      }
