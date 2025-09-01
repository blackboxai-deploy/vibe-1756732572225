'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { dataService } from '@/lib/data/data-service'
import { DashboardStats, StockAlert, StockTransaction } from '@/types'
import Link from 'next/link'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [recentTransactions, setRecentTransactions] = useState<StockTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDashboardData = () => {
      try {
        // Initialize data on first load
        dataService.initializeData()
        
        // Load dashboard data
        const dashboardStats = dataService.getDashboardStats()
        const stockAlerts = dataService.getStockAlerts()
        const allTransactions = dataService.getTransactions()
        
        // Get last 5 transactions
        const recentTrans = allTransactions
          .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime())
          .slice(0, 5)

        setStats(dashboardStats)
        setAlerts(stockAlerts.slice(0, 10)) // Show top 10 alerts
        setRecentTransactions(recentTrans)
        setLoading(false)
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'destructive'
      case 'high':
        return 'destructive'
      case 'medium':
        return 'secondary'
      case 'low':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getTransactionTypeColor = (type: string) => {
    switch (type) {
      case 'in':
        return 'bg-green-100 text-green-800'
      case 'out':
        return 'bg-red-100 text-red-800'
      case 'adjustment':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-2">Overview of your inventory and recent activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">📦</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalProducts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active inventory items
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">💰</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats?.totalValue || 0)}</div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">⚠️</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.lowStockItems || 0}</div>
            <p className="text-xs text-muted-foreground">
              Items below minimum level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <div className="h-4 w-4 text-muted-foreground">🚨</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.outOfStockItems || 0}</div>
            <p className="text-xs text-muted-foreground">
              Items with zero stock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Stock Alerts</CardTitle>
            <CardDescription>Items requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            {alerts.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No stock alerts at the moment
              </div>
            ) : (
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Link href={`/products/${alert.productId}`} className="font-medium hover:text-blue-600">
                        {alert.productName}
                      </Link>
                      <div className="text-sm text-gray-500">
                        Current: {alert.currentStock} | Min: {alert.minStockLevel}
                      </div>
                    </div>
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.alertType.replace('_', ' ')}
                    </Badge>
                  </div>
                ))}
                {alerts.length > 5 && (
                  <div className="text-center pt-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/reports">View All Alerts</Link>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Transactions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Latest stock movements</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                No recent transactions
              </div>
            ) : (
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{transaction.productName}</div>
                      <div className="text-sm text-gray-500">
                        {transaction.reason} • {formatDate(transaction.performedAt)}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTransactionTypeColor(transaction.type)}`}>
                        {transaction.type === 'in' ? '+' : transaction.type === 'out' ? '-' : '±'}{transaction.quantity}
                      </span>
                      {transaction.totalValue && (
                        <div className="text-sm text-gray-500 mt-1">
                          {formatCurrency(transaction.totalValue)}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                <div className="text-center pt-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/stock/transactions">View All Transactions</Link>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild className="h-20 flex-col">
              <Link href="/products/new">
                <div className="text-2xl mb-2">📦</div>
                Add Product
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/stock?action=in">
                <div className="text-2xl mb-2">📈</div>
                Stock In
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/stock?action=out">
                <div className="text-2xl mb-2">📉</div>
                Stock Out
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-20 flex-col">
              <Link href="/reports">
                <div className="text-2xl mb-2">📊</div>
                View Reports
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}