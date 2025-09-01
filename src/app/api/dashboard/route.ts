import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/data/data-service'

export async function GET(_request: NextRequest) {
  try {
    const stats = dataService.getDashboardStats()
    const alerts = dataService.getStockAlerts()
    const recentTransactions = dataService.getTransactions()
      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
      .slice(0, 10)
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        alerts: alerts.slice(0, 10), // Top 10 alerts
        recentTransactions
      }
    })
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}