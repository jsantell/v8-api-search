const apiName = Deno.args[0];
const apiManifest = JSON.parse(Deno.readTextFileSync(new URL('../data/api.json', import.meta.url)));
const api = apiManifest[apiName];

if (!api) { throw new Error(`No API defined for ${apiName}`); }
const jsonRegex = new RegExp(/^[\w\s]+\=(.*);\s*$/, 's');

async function run() {
  const results = [];
  // Doxygen stores each API entry in chunks separated by
  // the first character. The available chunks for each API can be found
  // in e.g. https://v8docs.nodesource.com/node-16.0/search/searchdata.js
  // as `indexSectionsWithContent[0]` (the 0th element represents the "all" query).
  // Rather than parsing that, just iterate over all potential prefixes, since
  // they're keyed by (hexidecimal) index anyway, so go until we 404.
  let i = 0;
  while (i++ >= 0) {
    const url = `${api.search}all_${i.toString(16)}.js`;
    const items = await fetchChunk(url);
    if (!items) {
      break;
    }
    results.push(...items);
  }

  try {
    await Deno.mkdir('data');
  } catch (e) {}
  const writeData = new TextEncoder().encode(JSON.stringify(results));
  await Deno.writeFile(`data/${apiName}.json`, writeData);
}

async function fetchChunk(url) {
  console.log(`Fetching ${url}`);
  const res = await fetch(url, { mode: 'no-cors' });
  if (!res.ok) {
    return null;
  }
  const text = await res.text();
  const matches = text.match(jsonRegex);
  if (!matches || matches.length < 2) {
    throw new Error(`Could not parse data from ${url}`);
  }
  const [_, match] = matches; 
  const results = JSON.parse(match.replace(/\'/g, '"'));
  console.log(`Parsed ${results.length} results`);
  return results;
}

run().catch(console.error);
