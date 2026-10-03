import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yvvzdrojkvvjxkhqxcyd.supabase.co';           // Project URL của bạn
const supabaseKey = 'sb_publishable_S_tR7DolrztNDVDNqX2DNA_vlfBYjRb';  
export const supabase = createClient(supabaseUrl, supabaseKey);