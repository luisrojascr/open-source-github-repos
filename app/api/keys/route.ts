import { NextResponse } from "next/server"
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { nanoid } from "nanoid"
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const { data: { session } } = await supabase.auth.getSession()
  
  console.log('Session:', session)
  console.log('Auth cookie:', cookies().get('sb-idqvrslldjlytzqplwaa-auth-token'))

  if (!session) {
    return new NextResponse(
      JSON.stringify({ error: "Unauthorized" }),
      { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }

  const { name, limit } = await req.json()
  const apiKey = `tvly_${nanoid(40)}`

  const { data, error } = await supabase
    .from('api_keys')
    .insert([
      {
        name,
        key: apiKey,
        limit: limit,
        user_id: session.user.id,
        usage: 0,
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Database error:', error)
    throw error
  }

  return new NextResponse(
    JSON.stringify(data),
    { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    }
  )
}

export async function GET(req: Request) {
  try {
    const supabase = createRouteHandlerClient(
      { 
        cookies: async () => {
          const cookieStore = await cookies()
          return cookieStore
        }
      }
    )

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: "Unauthorized" }),
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      )
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return new NextResponse(
      JSON.stringify(data),
      { 
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  } catch (error) {
    console.error('Error in GET /api/keys:', error)
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch API keys" }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}