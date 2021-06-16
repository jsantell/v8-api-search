const browser = self.browser ?? self.chrome;

export const defaults = {
  'api-version': 'node-16',
};

export async function get() {
  return new Promise((resolve, reject) => {
    browser.storage.local.get(defaults, (items) => {
      if (browser.runtime.lastError) {
        return reject(browser.runtime.lastError);
      }
      resolve(items);
    });
  });
}

export async function set(key, value) {
  return new Promise((resolve, reject) => {
    browser.storage.local.set({ [key]: value }, () => {
      if (browser.runtime.lastError) {
        return reject(browser.runtime.lastError);
      }
      resolve();
    });
  });
}