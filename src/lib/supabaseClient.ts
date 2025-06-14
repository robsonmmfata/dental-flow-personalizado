import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://weylieuzfkbnwhymxqdm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndleWxpZXV6ZmtibndoeW14cWRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4NzUxMjIsImV4cCI6MjA2NTQ1MTEyMn0.YL7qdqIOnUXk4mhS8WsN1Di0zTiuxikUF0i2bHnaBHA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
