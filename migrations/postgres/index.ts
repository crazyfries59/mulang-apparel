import * as migration_20261022_160341_initial_payload from './20261022_160341_initial_payload.ts';
import * as migration_20261022_173021_payload_auth_security from './20261022_173021_payload_auth_security.ts';
import * as migration_20261023_082701_private_payload_access from './20261023_082701_private_payload_access.ts';

export const migrations = [
  {
    up: migration_20261022_160341_initial_payload.up,
    down: migration_20261022_160341_initial_payload.down,
    name: '20261022_160341_initial_payload',
  },
  {
    up: migration_20261022_173021_payload_auth_security.up,
    down: migration_20261022_173021_payload_auth_security.down,
    name: '20261022_173021_payload_auth_security',
  },
  {
    up: migration_20261023_082701_private_payload_access.up,
    down: migration_20261023_082701_private_payload_access.down,
    name: '20261023_082701_private_payload_access'
  },
];
