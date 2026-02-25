// Partner logo mapping: domain → local logo path
const PARTNER_LOGOS = {
  'fusacq.com': '/images/partners/fusacq.svg',
  'cessionpme.com': '/images/partners/cessionpme.svg',
};

export function getPartnerLogoUrl(externalUrl) {
  if (!externalUrl) return null;
  for (const [domain, logo] of Object.entries(PARTNER_LOGOS)) {
    if (externalUrl.includes(domain)) return logo;
  }
  return null;
}
