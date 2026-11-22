export type Field = { label: string; value: string };

export type Account = {
  flag: string;
  region: string;
  bank: string;
  currency: string;
  method: string;
  anchor: string;
  fields: Field[];
  remarks?: string;
};

/* Account details copied from the XTransfer "export all accounts" export.
   Only fields a buyer needs to pay are shown - no internal notes, compliance
   paragraphs or restricted-country lists. Shared by the payment page and the
   About Us payment section so account details live in one place. */
export const ACCOUNTS: Account[] = [
  {
    flag: "🌐",
    region: "Global Account",
    bank: "JPMorgan Chase Bank, N.A., Hong Kong Branch",
    currency: "Multi-currency",
    method: "SWIFT / CHATS / FPS payment",
    anchor: "global",
    fields: [
      { label: "Account number", value: "63004294296" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "CHASHKHH" },
      { label: "Bank code / Branch code", value: "007 / 863" },
      { label: "Bank name", value: "JPMorgan Chase Bank, N.A., Hong Kong Branch" },
      { label: "Bank address", value: "18/F, 20/F, 22-29/F, CHATER HOUSE, 8 CONNAUGHT ROAD CENTRAL, HONG KONG" },
    ],
  },
  {
    flag: "🇺🇸",
    region: "USA Local Bank Account",
    bank: "Community Federal Savings Bank",
    currency: "USD",
    method: "ACH / Fedwire payment",
    anchor: "usa",
    fields: [
      { label: "Account number", value: "8335582789" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "ABA / Routing number", value: "026073008 (Fedwire) · 026073150 (ACH)" },
      { label: "Bank name", value: "Community Federal Savings Bank" },
      { label: "Bank address", value: "5 Penn Plaza, 14th Floor, New York, NY 10001" },
    ],
  },
  {
    flag: "🇨🇦",
    region: "Canada Local Bank Account",
    bank: "Digital Commerce Bank",
    currency: "CAD",
    method: "EFT payment",
    anchor: "canada",
    fields: [
      { label: "Account number", value: "969264597" },
      { label: "Account name", value: "Shantou Longhu District Mulang Department Store Sole Proprietorship" },
      { label: "Bank name", value: "Digital Commerce Bank" },
      { label: "Bank address", value: "736 Meridian Road N.E, Calgary, Alberta, CA" },
      { label: "Routing number", value: "035210009" },
      { label: "Clearing system", value: "EFT" },
    ],
    remarks: "Please include the following contents to your receiver when making a payment: [Seller Name]; [Product]; [PI/Contract Number]",
  },
  {
    flag: "🇬🇧",
    region: "UK Local Bank Account",
    bank: "Banking Circle S.A. UK Branch",
    currency: "GBP",
    method: "CHAPS / BACS / FPS payment",
    anchor: "uk",
    fields: [
      { label: "Account number", value: "47351043" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "SAPYGB2L" },
      { label: "Sort code", value: "608382" },
      { label: "Bank name", value: "Banking Circle S.A. UK Branch" },
      { label: "Bank address", value: "24 King William Street, London, EC4R 9AT" },
    ],
  },
  {
    flag: "🇪🇺",
    region: "EU Local Bank Account",
    bank: "Banking Circle S.A. UK Branch",
    currency: "EUR",
    method: "SEPA Inst / SEPA SCT payment",
    anchor: "eu",
    fields: [
      { label: "IBAN", value: "GB33SAPY60838247351043" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "SAPYGB2L" },
      { label: "Bank name", value: "Banking Circle S.A. UK Branch" },
      { label: "Bank address", value: "24 King William Street, London, EC4R 9AT" },
    ],
  },
  {
    flag: "🇩🇰",
    region: "Denmark Local Bank Account",
    bank: "Banking Circle Denmark",
    currency: "DKK",
    method: "DKK local payment",
    anchor: "denmark",
    fields: [
      { label: "Account number", value: "0047351043" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "SXPYDKKK" },
      { label: "Reg number", value: "8900" },
      { label: "Bank name", value: "Banking Circle Denmark" },
      { label: "Bank address", value: "Lautrupsgade 13-15, 2100 Copenhagen" },
    ],
  },
  {
    flag: "🇦🇺",
    region: "Australia Local Bank Account",
    bank: "JPMorgan Chase Bank, N.A.",
    currency: "AUD",
    method: "ACH / Instant payment",
    anchor: "australia",
    fields: [
      { label: "Account number", value: "492389771" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "BSB", value: "212200" },
      { label: "Bank name", value: "JPMorgan Chase Bank, National Association" },
      { label: "Bank address", value: "Level 35, 259 George St, Sydney, New South Wales 2000, Australia" },
    ],
  },
  {
    flag: "🇳🇬",
    region: "Nigeria Local Bank Account",
    bank: "Zenith Bank Plc",
    currency: "NGN",
    method: "NIBSS local payment",
    anchor: "nigeria",
    fields: [
      { label: "Account number", value: "1962973386" },
      { label: "Account name", value: "Shantou Mulang Department Store" },
      { label: "SWIFT / BIC code", value: "ZEIBNGLAXXX" },
      { label: "Bank code", value: "057" },
      { label: "Bank name", value: "Zenith Bank Plc" },
      { label: "Bank address", value: "87 AJOSE ADEOGUN STREET, ZENITH HEIGHTS, VICTORIA ISLAND, Nigeria" },
    ],
  },
];
