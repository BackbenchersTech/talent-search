import baseX from 'base-x';

const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const base62 = baseX(BASE62);

export const encodeUUID = (uuid: string) => {
  const hex = uuid.replace(/-/g, '');
  const bytes = Buffer.from(hex, 'hex');
  return base62.encode(bytes);
};

export const decodeUUID = (encoded: string) => {
  const bytes = Buffer.from(base62.decode(encoded)); // Buffer
  const hex = bytes.toString('hex'); // entire buffer as hex string

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
};
