const { spawn } = require('node:child_process');

const scope = process.argv[2];
const args = process.argv.slice(3);

if (!['app', 'all'].includes(scope) || args.length === 0) {
  console.error('Usage: node scripts/compose.js <app|all> <docker-compose-args...>');
  process.exit(1);
}

const files = scope === 'app'
  ? ['-f', 'apps/bookstore/docker-compose.yml']
  : ['-f', 'apps/bookstore/docker-compose.yml', '-f', 'docker-compose.tests.yml'];

const child = spawn('docker', ['compose', ...files, ...args], { stdio: 'inherit' });
child.on('exit', (code) => process.exit(code || 0));
