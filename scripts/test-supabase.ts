import 'dotenv/config'
import { supabase } from '../lib/db'

async function main() {
  // First, check if environment variables are loaded
  console.log('Checking environment variables...')
  console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Present' : 'Missing')
  console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Present' : 'Missing')

  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .limit(1)
    
    if (error) throw error
    console.log('Supabase connection successful!')
    console.log('Data:', data)
  } catch (error) {
    console.error('Supabase connection failed:', error)
  }
}

main() 