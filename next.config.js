/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export',
  images: {
    unoptimized: true,
  },
  transpilePackages: [
    '@hanzo/ui',
    '@hanzo/auth',
    '@hanzo/commerce',
    '@luxfi/ui',
    '@luxfi/data',
    '@luxfi/menu-icons'
  ],
  webpack: (config) => {
    // @hanzo/ui renders through @hanzo/gui, whose one substrate is react-native
    // primitives — which on the web means react-native-web. Unmapped, the build
    // reaches react-native's own Flow-typed source and stops at "Expected
    // 'from', got 'typeof'", an error that names no file.
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      'react-native': 'react-native-web',
      // react-native-svg asks for the asset registry by its react-native path;
      // react-native-web ships the same module elsewhere, so the alias above
      // cannot reach it and the build stops inside an icon set.
      '@react-native/assets-registry/registry':
        'react-native-web/dist/modules/AssetRegistry',
    }
    // react-native-svg's web build imports bare `react-native`, and its entry
    // only reaches that build when `.web.js` outranks `.js`.
    config.resolve.extensions = [
      '.web.js', '.web.jsx', '.web.ts', '.web.tsx',
      ...config.resolve.extensions,
    ]
    return config
  },

}

module.exports = nextConfig
