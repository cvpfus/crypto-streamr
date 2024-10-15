/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["keyv"],
  // experimental: {
  //   serverComponentsExternalPackages: ["keyv"],
  // },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mp3$/,
      use: [
        {
          loader: "file-loader",
        },
      ],
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        hostname: "api.dicebear.com",
      },
      {
        hostname: "ui-avatars.com",
      },
      {
        hostname: "storage2.cvpfus.xyz",
      },
    ],
  },
};

export default nextConfig;
