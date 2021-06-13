import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { APIData } from '../src/APIData.js';
import { match } from '../src/match.js';

const apiManifest = JSON.parse(Deno.readTextFileSync(new URL('../data/api.json', import.meta.url)));
const node16data = JSON.parse(Deno.readTextFileSync(new URL('../data/node-16.json', import.meta.url)));

const api = Object.assign({}, {
  data: node16data,
  name: 'node-16',
}, apiManifest['node-16']);

export const tests = [
['fuzzy search', function () {
  const results = match('getd', api);
  assert(results.find(r => r.name === 'GetData' && r.ns === 'v8::Isolate'));
  assert(results.find(r => r.name === 'SetGetDetachednessCallback' && r.ns === 'v8::HeapProfiler'));
  assert(results.find(r => r.name === 'GetDataFromSnapshotOnce' && r.ns === 'v8::Isolate::GetDataFromSnapshotOnce()' ));
}],

['skips destructors', function () {
  const results = match('client', api);
  assert(results.find(r => r.name === 'Client' && r.ns === 'v8::WasmStreaming'));
  assert(results.every(r => r.name !== '~Client'));
}],

['Weight exact matches', function () {
  const results = match('isolate', api);
  assert(results[0].name === 'Isolate');
  assert(results[0].ns === 'Isolate');
}],

['Return no more than maxResults=10 by default', function () {
  const results = match('isolate', api);
  assert(results.length === 10);
}],

['Return no more than maxResults', function () {
  const results = match('isolate', api, 5);
  assert(results.length === 5);
}],

['Uppercase query', function () {
  const results = match('Mod', api);
  assert(results.find(r => r.name === 'Module' && r.ns === 'v8'));
}],

['Prioritize classes, then structs, then others', function () {
  const results = match('mod', api);
  // classes first
  assertEquals(results[0].name, 'Module');
  assertEquals(results[0].ns, 'v8');
  assertEquals(results[1].name, 'ModuleRequest');
  assertEquals(results[1].ns, 'v8');
  // then structs
  assertEquals(results[2].name, 'ModifyCodeGenerationFromStringsResult');
  // then classes that do not start with the name
  assertEquals(results[3].name, 'CompiledWasmModule');
}],

['Search namespaces when :: provided', function () {
  const results = match('::createparams', api);
  assert(results[0].name === 'CreateParams');
  assert(results[0].ns === 'Isolate::CreateParams');
}],


];
