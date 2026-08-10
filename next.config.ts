import type { NextConfig } from "next";
import type { RemotePattern } from "next/dist/shared/lib/image-config";

const remotePatterns: RemotePattern[] = [
  {
    protocol: "https",
    hostname: "images.unsplash.com",
    pathname: "/**",
  },
];

// Allow avatar images served from the project's Supabase Storage bucket. The
// host is derived from the same env var the Supabase client uses, so it always
// matches the project we upload to. Skipped gracefully if the URL is unset.
if (process.env.NEXT_PUBLIC_SUPABASE_URL) {
  try {
    remotePatterns.push({
      protocol: "https",
      hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname,
      pathname: "/storage/v1/object/public/**",
    });
  } catch {
    // Malformed URL — leave the Supabase pattern out rather than crash config load.
  }
}

const nextConfig: NextConfig = {
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1536, 1920, 2304, 2560, 3840],
    remotePatterns,
  },
  experimental: {
    // Avatar uploads accept files up to 2 MB (see uploadAvatarAction), but the
    // default Server Action body limit is 1 MB — a larger photo would be
    // rejected with a raw 500 before our own size check runs. Raise it above
    // 2 MB so a full-size file reaches the action and hits the friendly
    // "over 2 MB" message instead. The headroom covers multipart overhead.
    serverActions: {
      bodySizeLimit: "3mb",
    },
  },
};

export default nextConfig;
