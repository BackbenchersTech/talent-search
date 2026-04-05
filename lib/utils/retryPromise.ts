export const retryPromise = async <T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 300,
): Promise<T> => {
  try {
    return await fn();
  } catch (err: unknown) {
    if (retries === 0) throw err;

    await new Promise((res) => setTimeout(res, delayMs));
    return retryPromise(fn, retries - 1, delayMs * 2);
  }
};
