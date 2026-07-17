'use server'

import { supabaseAdmin } from "@/lib/supabase-server"
import { verifyAdmin, sanitizeError } from "@/lib/auth"

export type SettingRow = { key: string; value: string; description: string | null }

export async function getSettings(): Promise<{ success: true; data: SettingRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('settings').select('*').order('key')
    if (error) throw error
    return { success: true, data: data as SettingRow[] }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "getSettings") }
  }
}

export async function updateSetting(key: string, value: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('settings').upsert({ key, value, updated_at: new Date().toISOString() })
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "updateSetting") }
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
    return { success: false, error: await sanitizeError(e, "getStats") }
  }
}

export async function createStat(input: StatInput): Promise<{ success: true; data: StatRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('stats').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as StatRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "createStat") }
  }
}

export async function updateStat(id: string, input: Partial<StatInput>): Promise<{ success: true; data: StatRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('stats').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as StatRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "updateStat") }
  }
}

export async function deleteStat(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('stats').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "deleteStat") }
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
    return { success: false, error: await sanitizeError(e, "getServices") }
  }
}

export async function createService(input: ServiceInput): Promise<{ success: true; data: ServiceRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('services').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as ServiceRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "createService") }
  }
}

export async function updateService(id: string, input: Partial<ServiceInput>): Promise<{ success: true; data: ServiceRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('services').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as ServiceRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "updateService") }
  }
}

export async function deleteService(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('services').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "deleteService") }
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
  links: { label: string; url: string }[] | null
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
  links?: { label: string; url: string }[]
  order_index?: number
}

export async function getProjects(): Promise<{ success: true; data: ProjectRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('projects').select('*').order('order_index')
    if (error) throw error
    return { success: true, data: data as ProjectRow[] }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "getProjects") }
  }
}

export async function createProject(input: ProjectInput): Promise<{ success: true; data: ProjectRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('projects').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as ProjectRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "createProject") }
  }
}

export async function updateProject(id: string, input: Partial<ProjectInput>): Promise<{ success: true; data: ProjectRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('projects').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as ProjectRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "updateProject") }
  }
}

export async function deleteProject(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('projects').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "deleteProject") }
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
    return { success: false, error: await sanitizeError(e, "updateSettings") }
  }
}

/* ─── FAQ ─── */

export type FaqRow = {
  id: string
  question_id: string
  question_en: string
  answer_id: string
  answer_en: string
  order_index: number
  created_at: string
}

export type FaqInput = {
  question_id: string
  question_en: string
  answer_id: string
  answer_en: string
  order_index?: number
}

export async function getFAQ(): Promise<{ success: true; data: FaqRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('faq').select('*').order('order_index')
    if (error) throw error
    return { success: true, data: data as FaqRow[] }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "getFAQ") }
  }
}

export async function createFAQ(input: FaqInput): Promise<{ success: true; data: FaqRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('faq').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as FaqRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "createFAQ") }
  }
}

export async function updateFAQ(id: string, input: Partial<FaqInput>): Promise<{ success: true; data: FaqRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('faq').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as FaqRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "updateFAQ") }
  }
}

export async function deleteFAQ(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('faq').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "deleteFAQ") }
  }
}

/* ─── HOW TO ORDER STEPS ─── */

export type HowToOrderRow = {
  id: string
  title_id: string
  title_en: string
  description_id: string
  description_en: string
  icon: string
  step_number: number
  order_index: number
  created_at: string
}

export type HowToOrderInput = {
  title_id: string
  title_en: string
  description_id?: string
  description_en?: string
  icon: string
  step_number: number
  order_index?: number
}

export async function getHowToOrderSteps(): Promise<{ success: true; data: HowToOrderRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('how_to_order_steps').select('*').order('order_index')
    if (error) throw error
    return { success: true, data: data as HowToOrderRow[] }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "getHowToOrderSteps") }
  }
}

export async function createHowToOrderStep(input: HowToOrderInput): Promise<{ success: true; data: HowToOrderRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('how_to_order_steps').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as HowToOrderRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "createHowToOrderStep") }
  }
}

export async function updateHowToOrderStep(id: string, input: Partial<HowToOrderInput>): Promise<{ success: true; data: HowToOrderRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('how_to_order_steps').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as HowToOrderRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "updateHowToOrderStep") }
  }
}

export async function deleteHowToOrderStep(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('how_to_order_steps').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "deleteHowToOrderStep") }
  }
}

/* ─── SOCIAL LINKS ─── */

export type SocialLinkRow = {
  id: string
  platform: string
  icon: string
  url: string
  label_id: string
  label_en: string
  order_index: number
  is_active: boolean
  created_at: string
}

export type SocialLinkInput = {
  platform: string
  icon: string
  url: string
  label_id: string
  label_en: string
  order_index?: number
  is_active?: boolean
}

export async function getSocialLinks(): Promise<{ success: true; data: SocialLinkRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('social_links').select('*').order('order_index')
    if (error) throw error
    return { success: true, data: data as SocialLinkRow[] }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "getSocialLinks") }
  }
}

export async function createSocialLink(input: SocialLinkInput): Promise<{ success: true; data: SocialLinkRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('social_links').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as SocialLinkRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "createSocialLink") }
  }
}

export async function updateSocialLink(id: string, input: Partial<SocialLinkInput>): Promise<{ success: true; data: SocialLinkRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('social_links').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as SocialLinkRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "updateSocialLink") }
  }
}

export async function deleteSocialLink(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('social_links').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "deleteSocialLink") }
  }
}

/* ─── TOOLS ─── */

export type ToolRow = {
  id: string
  name: string
  logo_url: string
  order_index: number
  created_at: string
}

export type ToolInput = {
  name: string
  logo_url: string
  order_index?: number
}

export async function getTools(): Promise<{ success: true; data: ToolRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('tools').select('*').order('order_index')
    if (error) throw error
    return { success: true, data: data as ToolRow[] }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "getTools") }
  }
}

export async function createTool(input: ToolInput): Promise<{ success: true; data: ToolRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('tools').insert([input]).select().single()
    if (error) throw error
    return { success: true, data: data as ToolRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "createTool") }
  }
}

export async function updateTool(id: string, input: Partial<ToolInput>): Promise<{ success: true; data: ToolRow } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('tools').update(input).eq('id', id).select().single()
    if (error) throw error
    return { success: true, data: data as ToolRow }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "updateTool") }
  }
}

export async function deleteTool(id: string): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('tools').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "deleteTool") }
  }
}

/* ─── ADMIN LOGS ─── */

export type AdminLogRow = {
  id: number
  action: string
  entity: string
  entity_id: string | null
  details: any
  created_at: string
}

export async function logAdminAction(action: string, entity: string, entityId?: string, details?: any): Promise<void> {
  try {
    await supabaseAdmin.from('admin_logs').insert({
      action,
      entity,
      entity_id: entityId || null,
      details: details || null,
    })
  } catch (e) {
    console.error("logAdminAction error:", e)
  }
}

export async function getAdminLogs(limit = 50): Promise<{ success: true; data: AdminLogRow[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { data, error } = await supabaseAdmin.from('admin_logs').select('*').order('created_at', { ascending: false }).limit(limit)
    if (error) throw error
    return { success: true, data: data as AdminLogRow[] }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "getAdminLogs") }
  }
}

export async function getTableStats(): Promise<{ success: true; data: { table: string; count: number }[] } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const tables = ['settings', 'stats', 'services', 'projects', 'faq', 'how_to_order_steps', 'social_links', 'tools', 'admin_logs']
    const results = await Promise.all(
      tables.map(async (table) => {
        const { count, error } = await supabaseAdmin.from(table).select('*', { count: 'exact', head: true })
        return { table, count: error ? 0 : (count || 0) }
      })
    )
    return { success: true, data: results }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "getTableStats") }
  }
}

export async function clearAdminLogs(): Promise<{ success: true } | { success: false; error: string }> {
  try {
    await verifyAdmin()
    const { error } = await supabaseAdmin.from('admin_logs').delete().neq('id', 0)
    if (error) throw error
    return { success: true }
  } catch (e: any) {
    return { success: false, error: await sanitizeError(e, "clearAdminLogs") }
  }
}
