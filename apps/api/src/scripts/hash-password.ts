import { hashPassword } from '../lib/password.js';

const password = process.argv[2];

if (!password) {
  console.error('Uso: npm run hash-password -w @cms/api -- "tu-password"');
  process.exit(1);
}

console.log(await hashPassword(password));
