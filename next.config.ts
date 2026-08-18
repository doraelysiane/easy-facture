import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false as any,
  env: {
    DATA_SOURCE: 'supabase',
    NEXT_PUBLIC_SUPABASE_URL: 'https://zucxcvifjwmrfkforzzh.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: 'sb_publishable_Sk_1WZIu21WVN2qAUR77cg_LsLWbnYn',
  },
};

export default nextConfig;
