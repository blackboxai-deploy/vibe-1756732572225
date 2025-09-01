'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { dataService } from '@/lib/data/data-service'
import { Product, StockTransaction } from '@/types'

function StockOperationsContent() {
  const searchParams = useSearchParams()
  const defaultAction = searchParams.get('action') || 'in'
  
  const [products, setProducts] = useState<Product[]>([])
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [transactionType, setTransactionType] = useState<'in' | 'out' | 'adjustment'>(
    defaultAction === 'out' ? 'out' : 'in'
  )
  const [formData, setFormData] = useState({
    quantity: '',
    unitPrice: '',
    reason: '',
    reference: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const loadProducts = () => {
      try {
        const allProducts = dataService.getProducts()
        setProducts(allProducts)
      } catch (error) {
        console.error('Error loading products:', error)
      }
    }

    loadProducts()
  }, [])

  const handleProductChange = (productId: string) => {
    const product = products.find(p => p.id === productId)
    setSelectedProduct(product || null)
    
    // Set default unit price based on transaction type
    if (product) {
      setFormData(prev => ({
        ...prev,
        unitPrice: transactionType === 'in' 
          ? product.costPrice.toString() 
          : product.sellingPrice.toString()
      }))
    }
  }

  const handleTransactionTypeChange = (type: 'in' | 'out' | 'adjustment') => {
    setTransactionType(type)
    
    // Update default unit price when type changes
    if (selectedProduct) {
      setFormData(prev => ({
        ...prev,
        unitPrice: type === 'in' 
          ? selectedProduct.costPrice.toString() 
          : selectedProduct.sellingPrice.toString(),
        reason: type === 'in' ? 'Purchase Order' : 
                type === 'out' ? 'Sale' : 
                'Stock Adjustment'
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        reason: type === 'in' ? 'Purchase Order' : 
                type === 'out' ? 'Sale' : 
                'Stock Adjustment'
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedProduct || !formData.quantity) {
      setMessage({ type: 'error', text: 'Please select a product and enter quantity' })
      return
    }

    const quantity = parseInt(formData.quantity)
    if (isNaN(quantity) || quantity <= 0) {
      setMessage({ type: 'error', text: 'Please enter a valid quantity' })
      return
    }

    // Check if stock out would result in negative stock
    if (transactionType === 'out' && quantity > selectedProduct.currentStock) {
      setMessage({ 
        type: 'error', 
        text: `Insufficient stock. Available: ${selectedProduct.currentStock} ${selectedProduct.unit}` 
      })
      return
    }

    setLoading(true)
    try {
      const unitPrice = formData.unitPrice ? parseFloat(formData.unitPrice) : undefined
      const transactionData: Omit<StockTransaction, 'id' | 'performedAt'> = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        type: transactionType,
        quantity: transactionType === 'adjustment' && formData.quantity.startsWith('-') 
          ? -Math.abs(quantity) 
          : quantity,
        unitPrice,
        totalValue: unitPrice ? unitPrice * quantity : undefined,
        reason: formData.reason || (transactionType === 'in' ? 'Purchase Order' : 
                                   transactionType === 'out' ? 'Sale' : 'Stock Adjustment'),
        reference: formData.reference,
        performedBy: 'admin', // In a real app, this would come from authentication
        notes: formData.notes
      }

      const transaction = dataService.createTransaction(transactionData)
      
      // Refresh product data to show updated stock
      const updatedProducts = dataService.getProducts()
      setProducts(updatedProducts)
      const updatedProduct = updatedProducts.find(p => p.id === selectedProduct.id)
      setSelectedProduct(updatedProduct || null)

      setMessage({ 
        type: 'success', 
        text: `Stock ${transactionType} recorded successfully! Transaction ID: ${transaction.id}` 
      })
      
      // Reset form
      setFormData({
        quantity: '',
        unitPrice: updatedProduct ? (transactionType === 'in' 
          ? updatedProduct.costPrice.toString() 
          : updatedProduct.sellingPrice.toString()) : '',
        reason: transactionType === 'in' ? 'Purchase Order' : 
                transactionType === 'out' ? 'Sale' : 
                'Stock Adjustment',
        reference: '',
        notes: ''
      })
      
    } catch (error) {
      console.error('Error creating transaction:', error)
      setMessage({ type: 'error', text: 'Failed to record transaction. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

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
    } else {
      return { label: 'In Stock', variant: 'default' as const }
    }
  }

  const totalValue = formData.quantity && formData.unitPrice 
    ? parseFloat(formData.quantity) * parseFloat(formData.unitPrice)
    : 0

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Operations</h1>
        <p className="text-gray-500 mt-2">Record stock movements and adjustments</p>
      </div>

      {/* Transaction Type Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Type</CardTitle>
          <CardDescription>Select the type of stock operation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={transactionType === 'in' ? 'default' : 'outline'}
              className="h-20 flex-col"
              onClick={() => handleTransactionTypeChange('in')}
            >
              <div className="text-2xl mb-2">📈</div>
              Stock In
              <div className="text-xs text-gray-500">Add inventory</div>
            </Button>
            <Button
              variant={transactionType === 'out' ? 'default' : 'outline'}
              className="h-20 flex-col"
              onClick={() => handleTransactionTypeChange('out')}
            >
              <div className="text-2xl mb-2">📉</div>
              Stock Out
              <div className="text-xs text-gray-500">Remove inventory</div>
            </Button>
            <Button
              variant={transactionType === 'adjustment' ? 'default' : 'outline'}
              className="h-20 flex-col"
              onClick={() => handleTransactionTypeChange('adjustment')}
            >
              <div className="text-2xl mb-2">⚖️</div>
              Adjustment
              <div className="text-xs text-gray-500">Correct stock levels</div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {transactionType === 'in' ? 'Stock In' : 
             transactionType === 'out' ? 'Stock Out' : 
             'Stock Adjustment'} Transaction
          </CardTitle>
          <CardDescription>
            {transactionType === 'in' ? 'Add stock to inventory (purchases, returns, etc.)' : 
             transactionType === 'out' ? 'Remove stock from inventory (sales, damages, etc.)' : 
             'Adjust stock levels (corrections, counted differences, etc.)'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Selection */}
            <div className="space-y-2">
              <Label htmlFor="product">Product *</Label>
              <Select onValueChange={handleProductChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      <div className="flex items-center justify-between w-full">
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">
                            SKU: {product.sku} | Stock: {product.currentStock} {product.unit}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Product Info */}
            {selectedProduct && (
              <Card className="bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{selectedProduct.name}</h3>
                      <p className="text-sm text-gray-600">{selectedProduct.sku}</p>
                      <p className="text-sm text-gray-600">
                        Current Stock: {selectedProduct.currentStock} {selectedProduct.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStockStatus(selectedProduct).variant}>
                        {getStockStatus(selectedProduct).label}
                      </Badge>
                      <div className="text-sm text-gray-600 mt-2">
                        <div>Cost: {formatCurrency(selectedProduct.costPrice)}</div>
                        <div>Selling: {formatCurrency(selectedProduct.sellingPrice)}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Quantity */}
              <div className="space-y-2">
                <Label htmlFor="quantity">
                  Quantity * {selectedProduct && `(${selectedProduct.unit})`}
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder={transactionType === 'adjustment' ? 'Enter +/- quantity' : 'Enter quantity'}
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                  required
                />
                {transactionType === 'adjustment' && (
                  <p className="text-xs text-gray-500">
                    Use positive numbers to add stock, negative to reduce
                  </p>
                )}
              </div>

              {/* Unit Price */}
              <div className="space-y-2">
                <Label htmlFor="unitPrice">
                  Unit Price {transactionType !== 'adjustment' && '*'}
                </Label>
                <Input
                  id="unitPrice"
                  type="number"
                  step="0.01"
                  placeholder="Enter unit price"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                  required={transactionType !== 'adjustment'}
                />
              </div>
            </div>

            {/* Total Value Display */}
            {totalValue > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-600">Total Transaction Value</div>
                <div className="text-2xl font-bold text-blue-800">
                  {formatCurrency(totalValue)}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Reason */}
              <div className="space-y-2">
                <Label htmlFor="reason">Reason *</Label>
                <Input
                  id="reason"
                  placeholder="Enter reason for transaction"
                  value={formData.reason}
                  onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                  required
                />
              </div>

              {/* Reference */}
              <div className="space-y-2">
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  placeholder="PO#, Invoice#, etc."
                  value={formData.reference}
                  onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                />
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes or comments"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-4 rounded-lg ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Recording...' : 
                 transactionType === 'in' ? 'Record Stock In' :
                 transactionType === 'out' ? 'Record Stock Out' :
                 'Record Adjustment'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  setSelectedProduct(null)
                  setFormData({
                    quantity: '',
                    unitPrice: '',
                    reason: transactionType === 'in' ? 'Purchase Order' : 
                            transactionType === 'out' ? 'Sale' : 
                            'Stock Adjustment',
                    reference: '',
                    notes: ''
                  })
                  setMessage(null)
                }}
              >
                Clear Form
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function StockOperationsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-64">
      <div className="text-lg text-gray-500">Loading...</div>
    </div>}>
      <StockOperationsContent />
    </Suspense>
  )
}