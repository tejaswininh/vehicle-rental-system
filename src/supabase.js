import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ghfpepvefzyllctbspuv.supabase.co'
const supabaseKey = 'sb_publishable_EBE1AtHEaYJs7A8Ofksn-Q_Vyv9_3uU'

export const supabase = createClient(supabaseUrl, supabaseKey)