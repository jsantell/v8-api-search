import { tests as formatTests } from './test-format.js';
import { tests as matchTests } from './test-match.js';

const tests = [
  ...formatTests,
  ...matchTests,
];

let passes = 0;
let failures = 0;
for (let [desc, fn] of tests) {
  try {
    fn();
    passes++;
  } catch(e) {
    failures++;
    console.error(`${desc}: ${e}`);
  }
}

const exit = failures > 0 ? 1 : 0;
console.log(`${passes} tests passed, ${failures} failed.`);
Deno.exit(exit);
