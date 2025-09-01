import { NextRequest, NextResponse } from 'next/server'
import { dataService } from '@/lib/data/data-service'
import { Product } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const supplier = searchParams.get('supplier')
    
    let products = dataService.getProducts()
    
    // Apply filters
    if (search) {
      products = dataService.searchProducts(search)
    }
    
    if (category && category !== 'all') {
      products = products.filter(p => p.category === category)
    }
    
    if (supplier && supplier !== 'all') {
      products = products.filter(p => p.supplier === supplier)
    }
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'sku', 'category', 'supplier', 'costPrice', 'sellingPrice']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Check if SKU already exists
    const existingProducts = dataService.getProducts()
    if (existingProducts.some(p => p.sku === body.sku)) {
      return NextResponse.json(
        { success: false, error: 'SKU already exists' },
        { status: 400 }
      )
    }
    
    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'> = {
      name: body.name,
      description: body.description || '',
      sku: body.sku,
      category: body.category,
      supplier: body.supplier,
      costPrice: parseFloat(body.costPrice),
      sellingPrice: parseFloat(body.sellingPrice),
      currentStock: parseInt(body.currentStock) || 0,
      minStockLevel: parseInt(body.minStockLevel) || 0,
      maxStockLevel: parseInt(body.maxStockLevel) || 100,
      reorderPoint: parseInt(body.reorderPoint) || 10,
      unit: body.unit || 'pieces',
      location: body.location || '',
      status: body.status || 'active'
    }
    
    const newProduct = dataService.createProduct(productData)
    
    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const updatedProduct = dataService.updateProduct(id, updates)
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }
    
    const deleted = dataService.deleteProduct(id)
    
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}