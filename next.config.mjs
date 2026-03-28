/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'izougyauvmzulmmfrkaw.supabase.co',
      },
    ],
  },
}

export default nextConfig
