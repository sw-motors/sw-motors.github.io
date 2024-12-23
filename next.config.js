const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true
  },
  assetPrefix: isProd ? '/sw-motors-invoice/' : '',
  basePath:  isProd ? "/sw-motors-invoice" : '',
  output: "export"
};

export default nextConfig;