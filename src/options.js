import * as storage from './storage.js';

(async () => {

const browser = self.browser ?? self.chrome;
const api = await (await fetch('../data/api.json')).json();

async function render() {
  const state = await storage.get();
  const apiVersions = Object.keys(api);
  const version = state['api-version'];

  document.body.innerHTML = `
<div id="content">
  <h1>V8 API Search Configuration</h1>
  <div class="group">
    <label for="api-version">V8 Version:</label>
    <select id="api-version">
	${apiVersions.map(v => 
      `<option ${v === version ? 'selected' : ''} value="${v}">
        ${v} (V8 ${api[v].v8}, Node.js ${api[v].node})
       </option>`)}
	</select>
  </div>
</div>
`;
  document.querySelector('#api-version').addEventListener('change', e => {
    storage.set('api-version', e.target.value);
  });
}

render();
})();
