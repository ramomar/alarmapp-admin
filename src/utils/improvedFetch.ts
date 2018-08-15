// Won't use angular http because it looks really complicated
// and I want to experiment with fetch lol.

function timeoutFetch(url, options, timeout) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(_ => reject(new Error('Request timeout')), timeout);

    fetch(url, options).then(response => {
      clearTimeout(timer);
      resolve(response)
    }).catch(error => {
      clearTimeout(timer);
      reject(error);
    });
  });
}

export function improvedFetch(url, options, retries, timeout) {
  if (retries <= 1) {
    return timeoutFetch(url, options, timeout);
  }
  else {
    return timeoutFetch(url, options, timeout)
      .catch(improvedFetch(url, options, retries-1, timeout));
  }
}
