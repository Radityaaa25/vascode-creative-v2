'use server'

import { supabaseAdmin } from "@/lib/supabase-server"
import { cookies } from "next/headers"

async function verifyAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  if (!token) throw new Error("Unauthorized")
  return true
}

export type ClientCRM = {
  id: string
  name: string
  company: string
  email: string
  phone_wa: string
  status: "Active" | "Completed" | "Pending"
  projects_count: number
  joined_at: string
  created_at: string
}

export type CreateClientInput = {
  name: string
  company: string
  email?: string
  phone_wa?: string
  status?: "Active" | "Completed" | "Pending"
  projects_count?: number
  joined_at?: string
}

export async function getClients(): Promise<{ success: true; data: ClientCRM[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()

    const { data, error } = await supabaseAdmin
      .from('client_crm')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return { success: true, data: data as ClientCRM[] }
  } catch (error: any) {
    console.error("getClients error:", error)
    return { success: false, error: error.message }
  }
}

export async function createClient(input: CreateClientInput): Promise<{ success: true; data: ClientCRM } | { success: false; error: string }> {
  try {
    await verifyAdmin()

    const { data, error } = await supabaseAdmin
      .from('client_crm')
      .insert([{
        name: input.name,
        company: input.company,
        email: input.email || '',
        phone_wa: input.phone_wa || '',
        status: input.status || 'Active',
        projects_count: input.projects_count || 0,
        joined_at: input.joined_at || new Date().toISOString().split('T')[0],
      }])
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as ClientCRM }
  } catch (error: any) {
    console.error("createClient error:", error)
    return { success: false, error: error.message }
  }
}

export async function updateClient(id: string, input: Partial<CreateClientInput>): Promise<{ success: true; data: ClientCRM } | { success: false; error: string }> {
  try {
    await verifyAdmin()

    const { data, error } = await supabaseAdmin
      .from('client_crm')
      .update(input)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return { success: true, data: data as ClientCRM }
  } catch (error: any) {
    console.error("updateClient error:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteClient(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()

    const { error } = await supabaseAdmin
      .from('client_crm')
      .delete()
      .eq('id', id)

    if (error) throw error

    return { success: true }
  } catch (error: any) {
    console.error("deleteClient error:", error)
    return { success: false, error: error.message }
  }
}
