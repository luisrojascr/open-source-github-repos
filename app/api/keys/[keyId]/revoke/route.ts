import { NextResponse } from "next/server"
import { supabase } from "@/lib/db"

export async function POST(
  req: Request,
  { params }: { params: { keyId: string } }
) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase
      .from('api_keys')
      .update({ revoked: true })
      .eq('id', params.keyId)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Revoke error:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 