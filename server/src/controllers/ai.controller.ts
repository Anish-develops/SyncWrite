import { Request, Response } from 'express';
import https from 'https';

export const AIController = {
  /**
   * Anthropic doesn't support browser CORS directly,
   * so forward the request directly without saving the user's API key.
   */
  async proxyAnthropic(req: Request, res: Response) {
    const apiKey = req.headers['x-api-key'] || req.body?.apiKey;
    if (!apiKey) {
      return res.status(400).json({ error: { message: 'Missing x-api-key header or body apiKey' } });
    }

    const payload = JSON.stringify(req.body.payload || req.body);

    const options = {
      hostname: 'api.anthropic.com',
      port: 443,
      path: '/v1/messages',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.status(proxyRes.statusCode || 200);
      for (const [key, value] of Object.entries(proxyRes.headers)) {
        if (value) res.setHeader(key, value);
      }
      proxyRes.pipe(res);
    });

    proxyReq.on('error', (err) => {
      res.status(502).json({ error: { message: `Anthropic proxy error: ${err.message}` } });
    });

    proxyReq.write(payload);
    proxyReq.end();
  },
};
