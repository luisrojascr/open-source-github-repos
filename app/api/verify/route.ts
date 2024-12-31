import { NextResponse } from "next/server"
import { supabase } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: "Invalid authorization header" }, { status: 401 })
    }

    const apiKey = authHeader.slice(7) // Remove 'Bearer ' prefix

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, user_id, revoked')
      .eq('key', apiKey)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    if (data.revoked) {
      return NextResponse.json({ error: "API key has been revoked" }, { status: 401 })
    }

    // Update last_used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', data.id)

    return NextResponse.json({ 
      valid: true,
      user_id: data.user_id
    })

  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 