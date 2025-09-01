import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/data/data-service'
import { StockTransaction } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    let transactions = dataService.getTransactions()
    
    // Apply filters
    if (productId) {
      transactions = transactions.filter(t => t.productId === productId)
    }
    
    if (type && type !== 'all') {
      transactions = transactions.filter(t => t.type === type)
    }
    
    if (startDate) {
      transactions = transactions.filter(t => 
        new Date(t.performedAt) >= new Date(startDate)
      )
    }
    
    if (endDate) {
      transactions = transactions.filter(t => 
        new Date(t.performedAt) <= new Date(endDate)
      )
    }
    
    // Sort by date descending (most recent first)
    transactions.sort((a, b) => 
      new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
    )
    
    return NextResponse.json({
      success: true,
      data: transactions,
      count: transactions.length
    })
  } catch (error) {
    console.error('Error fetching transactions:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch transactions' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['productId', 'type', 'quantity', 'reason']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Validate transaction type
    if (!['in', 'out', 'adjustment'].includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid transaction type' },
        { status: 400 }
      )
    }
    
    // Validate quantity
    const quantity = parseInt(body.quantity)
    if (isNaN(quantity) || quantity === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid quantity' },
        { status: 400 }
      )
    }
    
    // Check if product exists
    const product = dataService.getProduct(body.productId)
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Check stock availability for 'out' transactions
    if (body.type === 'out' && quantity > product.currentStock) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Insufficient stock. Available: ${product.currentStock} ${product.unit}` 
        },
        { status: 400 }
      )
    }
    
    const transactionData: Omit<StockTransaction, 'id' | 'performedAt'> = {
      productId: body.productId,
      productName: product.name,
      type: body.type,
      quantity: quantity,
      unitPrice: body.unitPrice ? parseFloat(body.unitPrice) : undefined,
      totalValue: body.unitPrice ? parseFloat(body.unitPrice) * Math.abs(quantity) : undefined,
      reason: body.reason,
      reference: body.reference || '',
      performedBy: body.performedBy || 'admin', // In real app, get from auth
      notes: body.notes || ''
    }
    
    const newTransaction = dataService.createTransaction(transactionData)
    
    return NextResponse.json({
      success: true,
      data: newTransaction,
      message: 'Transaction recorded successfully'
    })
  } catch (error) {
    console.error('Error creating transaction:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record transaction' },
      { status: 500 }
    )
  }
}