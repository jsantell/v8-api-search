const json = async function (url) {
  const req = await fetch(url);
  return await req.json();
}

export class APIData {
  constructor(name) {
    this.name = name;
    this.root = null;
    this.search = null;
    this.versionV8 = null;
    this.versionNode = null;
    this.data = null;
  }

  async initialize() {
    const apiRoot = await json('../data/api.json');
    const api = apiRoot[this.name];
    if (!api) {
      throw new Error(`Unknown API "${this.name}"`);
    }
    this.root = api.root;
    this.search = api.search;
    this.versionV8 = api.v8;
    this.versionNode = api.node;
    this.data = await json(`../data/${this.name}.json`);
    return this;
  }
}
