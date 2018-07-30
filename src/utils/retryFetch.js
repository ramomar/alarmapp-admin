export function retryFetch(url, options, retries) {
  if (retries === 1) {
    return fetch(url, options);
  }
  else {
    return fetch(url, options)
      .catch(retryFetch(url, options, retries-1))
  }
}
