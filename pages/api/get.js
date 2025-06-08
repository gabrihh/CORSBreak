export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  const requestHeaders = Object.keys(req.headers).join(',');
  res.setHeader('Access-Control-Allow-Headers', requestHeaders);

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const urlParam = req.url.split('?url=')[1];
  if (!urlParam) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  const targetUrl = decodeURIComponent(urlParam);

  const forbiddenHeaders = ['host', 'content-length', 'accept-encoding', 'connection'];

  const fetchHeaders = {};
  for (const [key, value] of Object.entries(req.headers)) {
    if (!forbiddenHeaders.includes(key.toLowerCase())) {
      fetchHeaders[key] = value;
    }
  }

  try {
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: fetchHeaders,
    });

    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== 'content-encoding') {
        res.setHeader(key, value);
      }
    });

    res.status(response.status);

    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json') || contentType.includes('text')) {
      const data = await response.text();
      res.send(data);
    } else {
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
      }
