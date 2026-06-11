/* generate-headers.mjs — génère _headers pour Basic Auth Netlify */

import { writeFileSync } from 'node:fs';

const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER || 'leonis';
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

if (!BASIC_AUTH_PASSWORD) {
  writeFileSync('_headers', '');
  console.log('Protection désactivée : BASIC_AUTH_PASSWORD non défini.');
  process.exit(0);
}

const headers = `/*
  Basic-Auth: ${BASIC_AUTH_USER}:${BASIC_AUTH_PASSWORD}
`;

writeFileSync('_headers', headers);
console.log(`Protection activée pour l'utilisateur « ${BASIC_AUTH_USER} ».`);
