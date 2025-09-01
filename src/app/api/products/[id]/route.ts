import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/data/data-service'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(
  _request: NextRequest,
  context: RouteParams
) {
  try {
    const { id } = await context.params
    const product = dataService.getProduct(id)
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    // Get product transaction history
    const transactions = dataService.getProductTransactions(id)
    
    return NextResponse.json({
      success: true,
      data: {
        product,
        transactions
      }
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}