export function match (input, api, maxResults=10) {
  const matches = [];
  const inputLC = input.toLowerCase();
  const hasNS = input.indexOf(':') !== -1;

  for (let entry of api.data) {
    const [id, contents] = entry;
    const entryName = contents[0];
    let weight = 0;
    const entryNameLC = entryName.toLowerCase();
    const index = entryNameLC.indexOf(inputLC);

    if (entryName.charAt(0) === '~') { continue; }
    if (!hasNS && index === -1) { continue; }

    // weight++ when search string matches the
    // start of method name.
    if (index === 0) { weight += 1; }

    // weight++ if equal
    if (entryNameLC === inputLC) { weight += 1; }

    for (let i = 1; i < contents.length; i++) {
      const [urlFragment, _, ns] = contents[i];

      if (hasNS) {
        const index = ns.toLowerCase().indexOf(inputLC);
        if (index === -1) continue;
      }

      let w = weight;
      const item = {
        url: new URL(urlFragment, api.search).href,
        ns,
        name: entryName,
      };

      // weight++ if links to a class or struct
      if (urlFragment.substr(-5) === '.html') {
        if (urlFragment.indexOf('class') >= 0) {
          w += 1;
	} else if (urlFragment.indexOf('struct') >= 0) {
          w += 0.9;
        }
      }
      matches.push({ weight: w, item });
    }
  }

  const results = [];
  const length = Math.min(maxResults, matches.length);
  matches.sort((a, b) => a.weight > b.weight ? -1 : 1);
  for (let i = 0; i < length; i++) {
    results.push(matches[i].item);
  }

  return results;
}
