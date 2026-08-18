import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zucxcvifjwmrfkforzzh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_Sk_1WZIu21WVN2qAUR77cg_LsLWbnYn'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
