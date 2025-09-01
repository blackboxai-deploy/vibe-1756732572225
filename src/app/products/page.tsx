'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { dataService } from '@/lib/data/data-service'
import { Product } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = () => {
      try {
        const allProducts = dataService.getProducts()
        setProducts(allProducts)
        setFilteredProducts(allProducts)
        setLoading(false)
      } catch (error) {
        console.error('Error loading products:', error)
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  useEffect(() => {
    let filtered = products

    // Apply search filter
    if (searchQuery) {
      filtered = dataService.searchProducts(searchQuery)
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter)
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter)
    }

    setFilteredProducts(filtered)
  }, [searchQuery, categoryFilter, statusFilter, products])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStockStatus = (product: Product) => {
    if (product.currentStock === 0) {
      return { label: 'Out of Stock', variant: 'destructive' as const }
    } else if (product.currentStock <= product.minStockLevel) {
      return { label: 'Low Stock', variant: 'secondary' as const }
    } else if (product.currentStock <= product.reorderPoint) {
      return { label: 'Reorder Soon', variant: 'outline' as const }
    } else {
      return { label: 'In Stock', variant: 'default' as const }
    }
  }

  const categories = [...new Set(products.map(p => p.category))]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-500 mt-2">Manage your product inventory</p>
        </div>
        <Button asChild>
          <Link href="/products/new">Add Product</Link>
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
          <CardDescription>Find products by name, SKU, category, or supplier</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search products, SKU, category, or supplier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products ({filteredProducts.length})</CardTitle>
          <CardDescription>
            {searchQuery && `Showing results for "${searchQuery}"`}
            {categoryFilter !== 'all' && ` in ${categoryFilter}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredProducts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-4">No products found</div>
              {searchQuery || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('')
                    setCategoryFilter('all')
                    setStatusFilter('all')
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/products/new">Add Your First Product</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Details</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Current Stock</TableHead>
                    <TableHead>Cost Price</TableHead>
                    <TableHead>Selling Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product)
                    return (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div>
                            <Link 
                              href={`/products/${product.id}`}
                              className="font-medium text-blue-600 hover:text-blue-800"
                            >
                              {product.name}
                            </Link>
                            {product.description && (
                              <div className="text-sm text-gray-500 mt-1">
                                {product.description.length > 50 
                                  ? product.description.substring(0, 50) + '...'
                                  : product.description
                                }
                              </div>
                            )}
                            <div className="text-xs text-gray-400 mt-1">
                              Supplier: {product.supplier}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-mono text-sm">{product.sku}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{product.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.currentStock} {product.unit}</div>
                            <Badge variant={stockStatus.variant} className="text-xs">
                              {stockStatus.label}
                            </Badge>
                            <div className="text-xs text-gray-500 mt-1">
                              Min: {product.minStockLevel} | Reorder: {product.reorderPoint}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatCurrency(product.costPrice)}</TableCell>
                        <TableCell>{formatCurrency(product.sellingPrice)}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={product.status === 'active' ? 'default' : 'secondary'}
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/products/${product.id}`}>View</Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/products/${product.id}/edit`}>Edit</Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Total Products</div>
              <div className="text-2xl font-bold">{filteredProducts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Total Stock Value</div>
              <div className="text-2xl font-bold">
                {formatCurrency(
                  filteredProducts.reduce((sum, p) => sum + (p.currentStock * p.costPrice), 0)
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Low Stock Items</div>
              <div className="text-2xl font-bold text-orange-600">
                {filteredProducts.filter(p => p.currentStock <= p.minStockLevel).length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-gray-500">Out of Stock</div>
              <div className="text-2xl font-bold text-red-600">
                {filteredProducts.filter(p => p.currentStock === 0).length}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}