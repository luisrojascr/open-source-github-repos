import 'dotenv/config'
import { supabase } from '../lib/db'
import crypto from 'crypto'

async function main() {
  try {
    // Generate a test API key
    const apiKey = `sk_${crypto.randomBytes(24).toString('hex')}`
    
    // Create a test key in the database
    const { data, error } = await supabase
      .from('api_keys')
      .insert({
        name: 'Test API Key',
        key: apiKey,
        user_id: '00000000-0000-0000-0000-000000000000', // Dummy UUID for testing
      })
      .select()
      .single()
    
    if (error) throw error

    console.log('API Key created successfully!')
    console.log('Key details:', {
      id: data.id,
      name: data.name,
      key: apiKey, // Only show this once
      created_at: data.created_at
    })

    // Verify we can retrieve the key
    const { data: retrievedKey, error: retrieveError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('id', data.id)
      .single()

    if (retrieveError) throw retrieveError

    console.log('\nSuccessfully retrieved key from database:', {
      id: retrievedKey.id,
      name: retrievedKey.name,
      created_at: retrievedKey.created_at
    })

  } catch (error) {
    console.error('Failed to create API key:', error)
  }
}

main() 