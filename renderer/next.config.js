/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ['@xterm/xterm', '@xterm/addon-fit'],
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  webpack: (config) => {
    return config
  },
}
