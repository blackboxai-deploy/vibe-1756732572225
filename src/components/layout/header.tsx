'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Header() {
  const [searchQuery, setSearchQuery] = useState('')
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search products, SKU, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-4"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="outline" size="sm">
                Stock In
              </Button>
              <Button variant="outline" size="sm">
                Stock Out
              </Button>
              <Button size="sm">
                Add Product
              </Button>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Button variant="outline" size="sm" className="relative">
                Alerts
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </div>
            
            {/* User Menu */}
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">Last login: Today</p>
              </div>
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">A</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Quick Actions */}
        <div className="md:hidden mt-4 flex space-x-2">
          <Button variant="outline" size="sm" className="flex-1">
            Stock In
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Stock Out
          </Button>
          <Button size="sm" className="flex-1">
            Add Product
          </Button>
        </div>
      </div>
    </header>
  )
}