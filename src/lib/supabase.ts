import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://aevgceuuxybcgccscjhl.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFldmdjZXV1eHliY2djY3NjamhsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5NDQ1NzQsImV4cCI6MjA2MzUyMDU3NH0.in-xhvKpw5uCzXs4Mgqd95GruwCwdoLPUGNzatUUsiA";

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 