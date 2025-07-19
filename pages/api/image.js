import fs from 'fs';
import path from 'path';
import mime from 'mime-types';

export default function handler(req, res) {
  // Basic Auth
  const auth = req.headers.authorization || '';
  const [scheme, credentials] = auth.split(' ');

  if (scheme !== 'Basic' || !credentials) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Secure Area"');
    return res.status(401).end('Authentication required');
  }

  const decoded = Buffer.from(credentials, 'base64').toString();
  const [user, pass] = decoded.split(':');

  if (
    user !== 'admin' ||
    pass !== 'admin'
  ) {
    return res.status(403).end('Forbidden');
  }

  const { name } = req.query;
  if (!name) {
    return res.status(400).end('Missing image name');
  }

  const imageDir = path.join(process.cwd(), 'protected_images');
  // Path traversal protection
  const safeName = path.normalize(name).replace(/^\.+/,'');
  const imagePath = path.join(imageDir, safeName);

  // Ensure the resolved path is still inside the imageDir
  if (!imagePath.startsWith(imageDir + path.sep)) {
    return res.status(400).end('Invalid image path');
  }

  if (!fs.existsSync(imagePath)) {
    return res.status(404).end('Image not found');
  }

  const contentType = mime.lookup(imagePath) || 'application/octet-stream';
  res.setHeader('Content-Type', contentType);
  const stream = fs.createReadStream(imagePath);
  stream.pipe(res);
}
