export const defaults = {
  api: 'node-16',
};

export async function getStorage() {
  return new Promise((resolve, reject) => {
    browser.storage.sync.get(defaults, (items) => {
      if (browser.runtime.lastError) {
        return reject(browser.runtime.lastError);
      }
      resolve(items);
    });
  });
}
