import type { MetadataRoute } from 'next'
import { SITE } from './site'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${SITE}/`, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    { url: `${SITE}/work`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE}/kitchens`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/bathrooms`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/painting`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE}/card`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ]
}
