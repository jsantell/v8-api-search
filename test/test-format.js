import { assert, assertEquals } from 'https://deno.land/std/testing/asserts.ts';
import { formatResults } from '../src/format.js';

export const tests = [
['format functions', function () {
  const match = {
    "name": "get",
    "ns": "v8_inspector::V8InspectorSession::Inspectable::get()",
    "url": "https://v8docs.nodesource.com/node-16.0/d5/d14/classv8__inspector_1_1_v8_inspector_session_1_1_inspectable.html#a21506ac0fa10b8d574caa19c9d07002b"
  };
  const [results] = formatResults([match], 'Get', true);
  assertEquals(results.content, match.url);
  assertEquals(results.description, `v8_inspector::V8InspectorSession::Inspectable::<match>get</match>`); 
}],

['hides redundant namespace', function () {
  const match = {
    "name": "Isolate",
    "ns": "Isolate",
    "url": "..."
  };
  const [results] = formatResults([match]);
  assertEquals(results.content, match.url);
  assertEquals(results.description, `Isolate`);
}],

['applies case insensitive <match>', function () {
  const match = {
    "name": "Isolate",
    "ns": "Isolate",
    "url": "..."
  };
  const [results] = formatResults([match], 'isolate', true);
  assertEquals(results.content, match.url);
  assertEquals(results.description, `<match>Isolate</match>`);
}],

];
