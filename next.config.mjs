/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  agentRules: false,
  async headers() {
    // Every visit used to re-validate every photograph. A day is long enough that a return
    // visit paints from cache, short enough that a swapped file still shows up tomorrow.
    const day = 'public, max-age=86400, stale-while-revalidate=604800'
    return [
      { source: '/:dir(assets|full|work|video)/:path*', headers: [{ key: 'Cache-Control', value: day }] },
      // the globe's sheet carries a content hash in its name, so it can be kept for good
      { source: '/work/:file(atlas-[a-f0-9]+\\.jpg)', headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }] },
    ]
  },
}

export default nextConfig
