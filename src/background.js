import { match } from './match.js';
import { formatResults } from './format.js';
import { APIData } from './APIData.js';
import * as storage from './storage.js';

const useMarkup = !/Firefox/i.test(navigator.userAgent); //forgive me
const browser = self.browser ?? self.chrome;

async function setAPI(name) {
  self.api = await new APIData(name).initialize();
  let description = `V8 API Documentation`;
  description += '   ';
  description += useMarkup ? '<dim>' : '(';
  description += `V8 ${api.versionV8}, Node.js ${api.versionNode}`;
  description += useMarkup ? '</dim>' : ')';
  description += '   ';

  browser.omnibox.setDefaultSuggestion({
    description,
  });

}

self.api = null;
async function initialize() {
  let store = await storage.get();
  await setAPI(store['api-version'] ?? 'node-16');

  browser.storage.onChanged.addListener(async (changes, ns) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      if (key === 'api-version') {
        await setAPI(newValue);
      }
    }
  });

  browser.omnibox.onInputChanged.addListener((text, suggest) => {
    if (!text) { return; }
    console.time('match');
    const results = match(text, api);
    console.timeEnd('match');
    const suggestions = formatResults(results, text, useMarkup);
    suggest(suggestions);
  });

  browser.omnibox.onInputEntered.addListener((url, disposition) => {
    if (url.substr(0, 8) !== 'https://') {
      // Default suggestion will just have the text input as url
      url = api.root;
    }

    switch (disposition) {
      case 'currentTab':
        chrome.tabs.update({ url }); break;
      case 'newForegroundTab':
        chrome.tabs.create({ url }); break;
      case 'newBackgroundTab':
        chrome.tabs.create({ url, active: false }); break;
    }
  });
}
initialize().catch(console.error);
