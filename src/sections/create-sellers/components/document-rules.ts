// ----------------------------------------------------------------------
// Espejo de Interrapidisimo\Seller\Model\SellerDocumentRequirements (PHP).
// Si el backend cambia las reglas, mantener este archivo sincronizado.
// ----------------------------------------------------------------------

export const PERSON_TYPE_NATURAL = 'natural_person';
export const PERSON_TYPE_LEGAL = 'legal_person';

export const COUNTRY_CHINA = 'CN';
export const COUNTRY_USA = 'US';

export const COMMON_DOCS = [
  'national_id_document',
  'bank_account_document',
  'business_license_document',
] as const;

type DocRules = {
  required: readonly string[];
  oneOf: readonly (readonly string[])[];
};

const RULES: Record<string, Record<string, DocRules>> = {
  [COUNTRY_CHINA]: {
    [PERSON_TYPE_LEGAL]: {
      required: ['uscc_document', 'export_license_document'],
      oneOf: [],
    },
    [PERSON_TYPE_NATURAL]: {
      required: ['personal_tax_identification_document', 'commercial_agreement_document'],
      oneOf: [],
    },
  },
  [COUNTRY_USA]: {
    [PERSON_TYPE_LEGAL]: {
      required: ['ein_document', 'w9_form_document', 'articles_of_incorporation_document'],
      oneOf: [['ssn_document', 'itin_document']],
    },
    [PERSON_TYPE_NATURAL]: {
      required: ['sales_tax_permit_document', 'w9_form_document'],
      oneOf: [['ssn_document', 'itin_document']],
    },
  },
};

// ----------------------------------------------------------------------

export type DocRequirements = {
  required: string[];
  oneOf: string[][];
};

export function getDocRequirements(country: string, personType: string): DocRequirements | null {
  const rules = RULES[country]?.[personType];
  if (!rules) return null;
  return {
    required: [...COMMON_DOCS, ...rules.required],
    oneOf: rules.oneOf.map((alts) => [...alts]),
  };
}

export const ALL_DOC_CODES: string[] = Array.from(
  new Set([
    ...COMMON_DOCS,
    ...Object.values(RULES).flatMap((byType) =>
      Object.values(byType).flatMap((r) => [...r.required, ...r.oneOf.flat()])
    ),
  ])
);

// ----------------------------------------------------------------------

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_MIME = 'application/pdf';
