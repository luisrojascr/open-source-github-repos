import { NextResponse } from "next/server"
import { supabase } from "@/lib/db"

export async function DELETE(
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
      .delete()
      .eq('id', params.keyId)
      .eq('user_id', session.user.id)

    if (error) throw error

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { keyId: string } }
) {
  try {
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    
    if (authError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, created_at, last_used, revoked')
      .eq('id', params.keyId)
      .eq('user_id', session.user.id)
      .single()

    if (error) throw error

    return NextResponse.json(data)

  } catch (error) {
    console.error('Fetch error:', error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
} 