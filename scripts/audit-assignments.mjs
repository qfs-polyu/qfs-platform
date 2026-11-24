import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = fileURLToPath(new URL('..', import.meta.url));
const filename = path.join(root, 'src/content/assignments.ts');
const source = fs.readFileSync(filename, 'utf8');
const {outputText} = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020
  }
});
const commonJsModule = {exports: {}};
vm.runInNewContext(
  outputText,
  {module: commonJsModule, exports: commonJsModule.exports},
  {filename}
);
const assignments = commonJsModule.exports.ASSIGNMENTS;
if (!assignments) throw new Error('assignments.ts does not export ASSIGNMENTS');

const configuredPython = process.env.PYTHON;
const candidates = configuredPython
  ? [configuredPython]
  : process.platform === 'win32'
    ? ['python', 'python3']
    : ['python3', 'python'];

let result;
for (const python of candidates) {
  result = spawnSync(python, [path.join(root, 'scripts', 'audit_assignments.py')], {
    cwd: root,
    input: JSON.stringify({assignments}),
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024
  });
  if (!result.error || result.error.code !== 'ENOENT') break;
}

if (!result) throw new Error('No Python interpreter was selected');
if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);
if (result.error) {
  console.error(
    `Unable to run Python (${result.error.message}). ` +
      'Install Python 3 with NumPy and pandas, or set PYTHON to its executable.'
  );
  process.exitCode = 1;
} else {
  process.exitCode = result.status ?? 1;
}
