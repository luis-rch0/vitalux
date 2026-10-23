import { spawn } from 'node:child_process';
const port = process.env.TEST_PORT || '3100';
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', port], { stdio: ['ignore', 'pipe', 'pipe'] });
let settled = false;
const finish = code => { server.kill(); process.exitCode = code; };
const timer = setTimeout(() => { console.error('UI server startup timed out'); finish(1); }, 30000);
server.stdout.on('data', chunk => {
  if (!settled && chunk.toString().includes('Ready')) {
    settled = true; clearTimeout(timer);
    const test = spawn(process.execPath, ['scripts/ui-regression.mjs'], { stdio: 'inherit', env: { ...process.env, TEST_BASE_URL: `http://127.0.0.1:${port}` } });
    test.on('exit', code => finish(code ?? 1));
  }
});
server.stderr.on('data', chunk => process.stderr.write(chunk));
server.on('exit', code => { if (!settled) { clearTimeout(timer); process.exitCode = code || 1; } });
