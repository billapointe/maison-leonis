/* generate-auth-config.mjs — génère js/auth-config.js au déploiement */

import { createHash } from 'node:crypto';
import { writeFileSync } from 'node:fs';

const envPassword = process.env.GATE_PASSWORD;

let password = '';
let isEnabled = false;

if (envPassword) {
  isEnabled = true;
  password = envPassword;
}

const hash = password
  ? createHash('sha256').update(password).digest('hex')
  : '';

const content = `/* Généré par scripts/generate-auth-config.mjs — ne pas modifier à la main */
export const GATE_PASSWORD_HASH = '${hash}';
export const GATE_ENABLED = ${isEnabled};
`;

writeFileSync('js/auth-config.js', content);

if (isEnabled) {
  console.log('Protection par mot de passe activée.');
} else {
  console.log('Protection désactivée (gate off).');
}
