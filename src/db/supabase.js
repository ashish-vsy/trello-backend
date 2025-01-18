
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xzthbtzzicflrgyvkquq.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_API_KEY)

module.exports = { supabase }