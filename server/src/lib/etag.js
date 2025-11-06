import crypto from 'crypto';
export function withEtag(req, res, next) {
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    const payload = JSON.stringify(body);
    const etag = crypto.createHash('md5').update(payload).digest('hex');
    res.set('ETag', etag);
    if (req.headers['if-none-match'] === etag) return res.status(304).end();
    return originalJson(body);
  };
  next();
}
