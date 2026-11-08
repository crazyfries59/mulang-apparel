import * as migration_20261022_160341_initial_payload from './20261022_160341_initial_payload';
import * as migration_20261022_173021_payload_auth_security from './20261022_173021_payload_auth_security';
import * as migration_20261023_082701_private_payload_access from './20261023_082701_private_payload_access';
import * as migration_20261024_115512_product_catalog from './20261024_115512_product_catalog';
import * as migration_20261029_112249_crm_backend from './20261029_112249_crm_backend';
import * as migration_20261107_164000_invoices from './20261107_164000_invoices';
import * as migration_20261107_174500_invoice_grants from './20261107_174500_invoice_grants';
import * as migration_20261107_180500_customer_company from './20261107_180500_customer_company';
import * as migration_20261108_170000_invoice_country from './20261108_170000_invoice_country';

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
    name: '20261023_082701_private_payload_access',
  },
  {
    up: migration_20261024_115512_product_catalog.up,
    down: migration_20261024_115512_product_catalog.down,
    name: '20261024_115512_product_catalog',
  },
  {
    up: migration_20261029_112249_crm_backend.up,
    down: migration_20261029_112249_crm_backend.down,
    name: '20261029_112249_crm_backend'
  },
  {
    up: migration_20261107_164000_invoices.up,
    down: migration_20261107_164000_invoices.down,
    name: '20261107_164000_invoices'
  },
  {
    up: migration_20261107_174500_invoice_grants.up,
    down: migration_20261107_174500_invoice_grants.down,
    name: '20261107_174500_invoice_grants'
  },
  {
    up: migration_20261107_180500_customer_company.up,
    down: migration_20261107_180500_customer_company.down,
    name: '20261107_180500_customer_company'
  },
  {
    up: migration_20261108_170000_invoice_country.up,
    down: migration_20261108_170000_invoice_country.down,
    name: '20261108_170000_invoice_country'
  },
];
