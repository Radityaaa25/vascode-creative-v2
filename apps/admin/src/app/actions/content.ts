'use server'

import { supabaseAdmin } from "@/lib/supabase-server"
import { cookies } from "next/headers"

async function verifyAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  if (!token) throw new Error("Unauthorized")
  return true
}

export type SettingRow = { key: string; value: string; description: string | null }

export async function getSettings(): Promise<{ success: true; data: SettingRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('settings').select('*').order('key')
    if (error) throw error
    return { success: true, data: data as SettingRow[] }
  } catch (e: any) {
    console.error("getSettings error:", e)
    return { success: false, error: e.message }
  }
}

export async function updateSetting(key: string, value: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('settings').upsert({ key, value, updated_at: new Date().toISOString() })
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    console.error("updateSetting error:", e)
    return { success: false, error: e.message }
  }
}

export type StatRow = {
  id: string
  label_id: string
  label_en: string
  value: string
  order_index: number
  created_at: string
}

export type StatInput = {
  label_id: string
  label_en: string
  value: string
  order_index?: number
}

export async function getStats(): Promise<{ success: true; data: StatRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('stats').select('*').order('order_index')
    if (error) throw error
    return { success: true, data: data as StatRow[] }
  } catch (e: any) {
    console.error("getStats error:", e)
    return { success: false, error: e.message }
  }
}

export async function createStat(input: StatInput): Promise<{ success: true; data: StatRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('stats').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as StatRow }
  } catch (e: any) {
    console.error("createStat error:", e)
    return { success: false, error: e.message }
  }
}

export async function updateStat(id: string, input: Partial<StatInput>): Promise<{ success: true; data: StatRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('stats').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as StatRow }
  } catch (e: any) {
    console.error("updateStat error:", e)
    return { success: false, error: e.message }
  }
}

export async function deleteStat(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('stats').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    console.error("deleteStat error:", e)
    return { success: false, error: e.message }
  }
}

export type ServiceRow = {
  id: string
  title_id: string
  title_en: string
  icon: string
  description_id: string
  description_en: string
  wa_template_id: string
  wa_template_en: string
  order_index: number
  created_at: string
}

export type ServiceInput = {
  title_id: string
  title_en: string
  icon: string
  description_id: string
  description_en: string
  wa_template_id: string
  wa_template_en: string
  order_index?: number
}

export async function getServices(): Promise<{ success: true; data: ServiceRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('services').select('*').order('order_index')
    if (error) throw error
    return { success: true, data: data as ServiceRow[] }
  } catch (e: any) {
    console.error("getServices error:", e)
    return { success: false, error: e.message }
  }
}

export async function createService(input: ServiceInput): Promise<{ success: true; data: ServiceRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('services').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as ServiceRow }
  } catch (e: any) {
    console.error("createService error:", e)
    return { success: false, error: e.message }
  }
}

export async function updateService(id: string, input: Partial<ServiceInput>): Promise<{ success: true; data: ServiceRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('services').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as ServiceRow }
  } catch (e: any) {
    console.error("updateService error:", e)
    return { success: false, error: e.message }
  }
}

export async function deleteService(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('services').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    console.error("deleteService error:", e)
    return { success: false, error: e.message }
  }
}

export type ProjectRow = {
  id: string
  title_id: string
  title_en: string
  category: string
  description_id: string
  description_en: string
  image_url: string | null
  tech_stack: string | null
  project_url: string | null
  order_index: number
  created_at: string
}

export type ProjectInput = {
  title_id: string
  title_en: string
  category: string
  description_id: string
  description_en: string
  image_url?: string
  tech_stack?: string
  project_url?: string
  order_index?: number
}

export async function getProjects(): Promise<{ success: true; data: ProjectRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('projects').select('*').order('order_index')
    if (error) throw error
    return { success: true, data: data as ProjectRow[] }
  } catch (e: any) {
    console.error("getProjects error:", e)
    return { success: false, error: e.message }
  }
}

export async function createProject(input: ProjectInput): Promise<{ success: true; data: ProjectRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('projects').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as ProjectRow }
  } catch (e: any) {
    console.error("createProject error:", e)
    return { success: false, error: e.message }
  }
}

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<{ success: true; data: ProjectRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('projects').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as ProjectRow }
  } catch (e: any) {
    console.error("updateProject error:", e)
    return { success: false, error: e.message }
  }
}

export async function deleteProject(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    console.error("deleteProject error:", e)
    return { success: false, error: e.message }
  }
}

export async function updateSettings(
  updates: { key: string; value: string }[]
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    for (const u of updates) {
      const { error } = await supabaseAdmin.from('settings').upsert({ key: u.key, value: u.value, updated_at: new Date().toISOString() })
      if (error) throw error
    }
    return { success: true }
  } catch (e: any) {
    console.error("updateSettings error:", e)
    return { success: false, error: e.message }
  }
}
