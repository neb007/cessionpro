export function createPageUrl(pageName: string) {
    return '/' + pageName.replace(/ /g, '-');
}

const slugifyForUrl = (value: string) => {
    return String(value || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .toLowerCase();
};

export function buildListingSlug({
    title,
    location,
    referenceNumber
}: {
    title?: string;
    location?: string;
    referenceNumber?: string;
}) {
    const titlePart = slugifyForUrl(title || 'annonce');
    const locationPart = slugifyForUrl(location || 'localisation');
    const referencePart = slugifyForUrl(referenceNumber || 'reference');
    return [titlePart, locationPart, referencePart].filter(Boolean).join('-');
}

export function extractReferenceFromListingSlug(listingSlug?: string | null) {
    const lastSegment = String(listingSlug || '').split('/').filter(Boolean).pop() || '';
    const match = lastSegment.match(/(riv-\d+|ref-\d+)$/i);
    return match ? match[1].toUpperCase() : null;
}

type ListingLike = {
    id?: string | null;
    title?: string | null;
    location?: string | null;
    reference_number?: string | null;
    referenceNumber?: string | null;
};

export function createBusinessDetailsUrl(listing: ListingLike = {}) {
    const reference = listing.reference_number || listing.referenceNumber || '';

    if (reference) {
        const slug = buildListingSlug({
            title: listing.title || 'annonce',
            location: listing.location || 'localisation',
            referenceNumber: reference
        });
        return createPageUrl(`BusinessDetails/${slug}`);
    }

    if (listing.id) {
        return createPageUrl(`BusinessDetails?id=${listing.id}`);
    }

    return createPageUrl('BusinessDetails');
}
