import 'dotenv/config'
import { supabase } from '../lib/db'

async function main() {
  try {
    // Create a test user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'testpassword123',
    })

    if (authError) throw authError

    const userId = authData.user?.id
    console.log('Test user created successfully!')
    console.log('User ID:', userId)

    // Now create an API key for this user
    const apiKey = `sk_${Buffer.from(crypto.randomBytes(24)).toString('hex')}`
    
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .insert({
        name: 'Test API Key',
        key: apiKey,
        user_id: userId,
      })
      .select()
      .single()

    if (keyError) throw keyError

    console.log('\nAPI Key created successfully!')
    console.log('Key details:', {
      id: keyData.id,
      name: keyData.name,
      key: apiKey, // Only show this once
      created_at: keyData.created_at
    })

  } catch (error) {
    console.error('Failed:', error)
  }
}

main() 