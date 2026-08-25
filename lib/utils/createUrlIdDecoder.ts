import { decodeUUID } from './base62';

// URL ids are prefixed, base62-encoded uuids (e.g. 'cand_5fKx9Q'). The
// prefix identifies the entity type and guards against decoding ids of the
// wrong kind. Returns null — never throws — when the prefix is missing or
// the payload doesn't decode to a valid uuid, so callers can treat
// malformed ids as "not found" instead of catching.
export const createUrlIdDecoder = (prefix: string) => (urlId: string) =>
  urlId.startsWith(prefix) ? decodeUUID(urlId.slice(prefix.length)) : null;
