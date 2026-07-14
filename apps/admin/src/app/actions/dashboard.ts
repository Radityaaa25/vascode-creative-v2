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

    // 1. Fetch Clients (Filter by start_date or created_at)
    // We use start_date for clients if available, fallback to created_at
    const { data: clients, error: clientsError } = await supabaseAdmin
      .from('clients')
      .select('*')
      .gte('created_at', pastDateIso) // Only fetch data within the selected time range

    if (clientsError) throw clientsError

    // 2. Fetch Projects (from projects table)
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select('*')
      .gte('created_at', pastDateIso)

    if (projectsError) throw projectsError

    // Calculate Stats
    const totalClients = clients?.length || 0
    const activeProjects = projects?.length || 0 
    
    // Revenue from clients table (project_value)
    const totalRevenue = clients?.reduce((acc, client) => acc + (Number(client.project_value) || 0), 0) || 0

    // Chart Data - Revenue by Month (Dummy logic based on start_date or created_at)
    const monthlyRevenue: Record<string, number> = {}
    clients?.forEach(client => {
      // Use start_date if it exists, otherwise use created_at
      const dateString = client.start_date || client.created_at;
      if (dateString) {
        const month = new Date(dateString).toLocaleString('en-US', { month: 'short' })
        monthlyRevenue[month] = (monthlyRevenue[month] || 0) + (Number(client.project_value) || 0)
      }
    })

    const chartData = Object.entries(monthlyRevenue).map(([name, Total]) => ({ name, Total }))
    // If empty, provide some dummy data so chart doesn't look empty
    if (chartData.length === 0) {
      chartData.push(
        { name: "Jan", Total: 0 },
        { name: "Feb", Total: 0 },
        { name: "Mar", Total: 0 }
      )
    }

    // Client Status Data
    const statusCounts: Record<string, number> = {}
    clients?.forEach(client => {
      const status = client.status || 'Unknown'
      statusCounts[status] = (statusCounts[status] || 0) + 1
    })
    
    const clientStatusData = Object.entries(statusCounts).map(([name, value]) => ({ name, value }))
    // If empty, provide dummy
    if (clientStatusData.length === 0) {
      clientStatusData.push({ name: "No Data", value: 1 })
    }

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
