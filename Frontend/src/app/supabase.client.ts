// src/app/supabase.client.ts
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xsrftgqgdaelhmpzzksk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzcmZ0Z3FnZGFlbGhtcHp6a3NrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2MDU4NDMsImV4cCI6MjA2NDE4MTg0M30.QzUTKq3JJ6Cj6Mlu79YJcW3g_viLaLogtd13wKyRICw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
