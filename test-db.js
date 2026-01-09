
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
const envConfig = dotenv.parse(fs.readFileSync(envPath));

const url = envConfig.VITE_SUPABASE_URL;
const key = envConfig.VITE_SUPABASE_ANON_KEY;

console.log('Testing connection to:', url);

const supabase = createClient(url, key);

async function test() {
    const tables = ['site_settings', 'hero_content', 'projects', 'blog_posts', 'services', 'testimonials'];
    for (const table of tables) {
        const { data, error } = await supabase.from(table).select('*').limit(1);
        if (error) {
            console.error(`Error table ${table}:`, error.message);
        } else {
            console.log(`Success ${table}:`, data ? (data.length > 0 ? 'HAS_DATA' : 'EMPTY_ARRAY') : 'NULL');
        }
    }
}

test();
