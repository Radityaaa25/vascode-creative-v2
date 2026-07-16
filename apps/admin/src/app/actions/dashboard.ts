'use server'

import { supabaseAdmin } from "@/lib/supabase-server"
import { cookies } from "next/headers"

type ActivityItem = {
  id: string
  title: string
  description: string
  time: string
  icon: string
}

// Helper function to verify admin access
async function verifyAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')
  if (!token) throw new Error("Unauthorized")
  return true
}

export async function getDashboardData(timeRange: string = '12m') {
  await verifyAdmin()

  try {
    const now = new Date()
    let pastDate = new Date()
    
    if (timeRange === '7d') {
      pastDate.setDate(now.getDate() - 7)
    } else if (timeRange === '30d') {
      pastDate.setDate(now.getDate() - 30)
    } else {
      // 12m default
      pastDate.setFullYear(now.getFullYear() - 1)
    }

    const pastDateIso = pastDate.toISOString()

    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('id, client_name, project_name, project_value, status, created_at, start_date')
      .gte('created_at', pastDateIso)

    if (clientsError) throw clientsError

    const { data: projects, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('id, title_id, created_at')
      .gte('created_at', pastDateIso)

    if (projectsError) throw projectsError

    // Calculate Stats
    const totalClients = clients?.length || 0
    const activeProjects = projects?.length || 0 
    
    // Revenue from clients table (project_value)
    const totalRevenue = clients?.reduce((acc, client) => acc + (Number(client.project_value) || 0), 0) || 0

    const monthlyRevenue: Record<string, number> = {}
    clients?.forEach(client => {
      const dateString = client.start_date || client.created_at;
      if (dateString) {
        const d = new Date(dateString)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        monthlyRevenue[key] = (monthlyRevenue[key] || 0) + (Number(client.project_value) || 0)
      }
    })

    const shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const chartData = Object.entries(monthlyRevenue)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, Total]) => {
        const m = shortMonths[parseInt(key.split('-')[1], 10) - 1] || key
        return { name: `${m} ${key.split('-')[0]}`, Total }
      })

    const statusCounts: Record<string, number> = {}
    clients?.forEach(client => {
      const s = client.status || 'Unknown'
      statusCounts[s] = (statusCounts[s] || 0) + 1
    })
    
    const clientStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))

    // Recent Activity (Combine latest clients and projects)
    const recentActivity: ActivityItem[] = []
    
    clients?.slice(0, 3).forEach(c => {
      recentActivity.push({
        id: c.id,
        title: "New Client Onboarded",
        description: `${c.client_name} - ${c.project_name}`,
        time: c.created_at,
        icon: "Users"
      })
    })

    projects?.slice(0, 3).forEach(p => {
      recentActivity.push({
        id: p.id,
        title: "Project Added",
        description: p.title_id,
        time: p.created_at,
        icon: "Briefcase"
      })
    })

    // Sort by created_at descending
    recentActivity.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return {
      success: true,
      data: {
        totalClients,
        activeProjects,
        totalRevenue,
        chartData,
        clientStatusData,
        recentActivity: recentActivity.slice(0, 5)
      }
    }

  } catch (error: any) {
    console.error("Dashboard fetch error:", error)
    return { success: false, error: error.message }
  }
}
