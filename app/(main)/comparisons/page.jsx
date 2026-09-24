import { permanentRedirect } from 'next/navigation';
import { buildComparisonSlug } from '@/lib/devices/comparison-helpers';

/**
 * Backward compatibility route for legacy `/comparisons` URLs.
 * Automatically issues a permanent (308) redirect to the new SEO-friendly `/compare` routes:
 * - `/comparisons` -> `/compare`
 * - `/comparisons?ids=a,b` -> `/compare/a-vs-b`
 */
export default async function LegacyComparisonsPage({ searchParams }) {
  const resolvedParams = await searchParams;

  let ids = [];
  if (resolvedParams?.ids) {
    ids = String(resolvedParams.ids).split(',').filter(Boolean);
  } else if (resolvedParams?.q) {
    ids = String(resolvedParams.q).split(',').filter(Boolean);
  }

  if (ids.length > 0) {
    const canonicalSlug = buildComparisonSlug(ids);
    if (canonicalSlug) {
      permanentRedirect(`/compare/${canonicalSlug}`);
    }
  }

  permanentRedirect('/compare');
}
