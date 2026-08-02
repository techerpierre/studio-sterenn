/**
 * Ensures a promise is not settled before the minimum delay has passed.
 * Settles with the original promise result only after both the promise
 * has settled (fulfilled or rejected) and `ms` have elapsed.
 */
export async function minimumDelay<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T> {
  const [result] = await Promise.allSettled([
    promise,
    new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    }),
  ]);

  if (result.status === 'fulfilled') {
    return result.value;
  }

  throw result.reason;
}
