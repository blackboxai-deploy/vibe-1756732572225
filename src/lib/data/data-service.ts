import { 
  Product, 
  StockTransaction, 
  Supplier, 
  Category, 
  User, 
  DashboardStats, 
  StockAlert 
} from '@/types'
import { 
  sampleProducts, 
  sampleTransactions, 
  sampleSuppliers, 
  sampleCategories, 
  sampleUsers 
} from './sample-data'

// Simulated database with localStorage persistence
class DataService {
  private getStorageKey(entity: string): string {
    return `stock_manager_${entity}`
  }

  // Generic CRUD operations
  private getAll<T>(entity: string, defaultData: T[]): T[] {
    if (typeof window === 'undefined') return defaultData
    
    const stored = localStorage.getItem(this.getStorageKey(entity))
    return stored ? JSON.parse(stored) : defaultData
  }

  private save<T>(entity: string, data: T[]): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(this.getStorageKey(entity), JSON.stringify(data))
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // Products
  getProducts(): Product[] {
    return this.getAll('products', sampleProducts)
  }

  getProduct(id: string): Product | undefined {
    return this.getProducts().find(p => p.id === id)
  }

  createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Product {
    const products = this.getProducts()
    const newProduct: Product = {
      ...product,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    products.push(newProduct)
    this.save('products', products)
    return newProduct
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts()
    const index = products.findIndex(p => p.id === id)
    if (index === -1) return null

    products[index] = {
      ...products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    this.save('products', products)
    return products[index]
  }

  deleteProduct(id: string): boolean {
    const products = this.getProducts()
    const filtered = products.filter(p => p.id !== id)
    if (filtered.length === products.length) return false
    
    this.save('products', filtered)
    return true
  }

  // Stock Transactions
  getTransactions(): StockTransaction[] {
    return this.getAll('transactions', sampleTransactions)
  }

  getProductTransactions(productId: string): StockTransaction[] {
    return this.getTransactions().filter(t => t.productId === productId)
  }

  createTransaction(transaction: Omit<StockTransaction, 'id' | 'performedAt'>): StockTransaction {
    const transactions = this.getTransactions()
    const newTransaction: StockTransaction = {
      ...transaction,
      id: this.generateId(),
      performedAt: new Date().toISOString()
    }
    transactions.push(newTransaction)
    this.save('transactions', transactions)

    // Update product stock
    this.updateProductStock(transaction.productId, transaction.type, transaction.quantity)
    
    return newTransaction
  }

  private updateProductStock(productId: string, type: 'in' | 'out' | 'adjustment', quantity: number): void {
    const products = this.getProducts()
    const product = products.find(p => p.id === productId)
    if (!product) return

    switch (type) {
      case 'in':
        product.currentStock += quantity
        break
      case 'out':
        product.currentStock -= quantity
        break
      case 'adjustment':
        product.currentStock += quantity // quantity can be negative for adjustments
        break
    }

    product.currentStock = Math.max(0, product.currentStock) // Prevent negative stock
    product.updatedAt = new Date().toISOString()
    this.save('products', products)
  }

  // Suppliers
  getSuppliers(): Supplier[] {
    return this.getAll('suppliers', sampleSuppliers)
  }

  getSupplier(id: string): Supplier | undefined {
    return this.getSuppliers().find(s => s.id === id)
  }

  createSupplier(supplier: Omit<Supplier, 'id' | 'createdAt'>): Supplier {
    const suppliers = this.getSuppliers()
    const newSupplier: Supplier = {
      ...supplier,
      id: this.generateId(),
      createdAt: new Date().toISOString()
    }
    suppliers.push(newSupplier)
    this.save('suppliers', suppliers)
    return newSupplier
  }

  updateSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
    const suppliers = this.getSuppliers()
    const index = suppliers.findIndex(s => s.id === id)
    if (index === -1) return null

    suppliers[index] = { ...suppliers[index], ...updates }
    this.save('suppliers', suppliers)
    return suppliers[index]
  }

  // Categories
  getCategories(): Category[] {
    return this.getAll('categories', sampleCategories)
  }

  // Users
  getUsers(): User[] {
    return this.getAll('users', sampleUsers)
  }

  // Dashboard Statistics
  getDashboardStats(): DashboardStats {
    const products = this.getProducts()
    const transactions = this.getTransactions()
    const today = new Date().toISOString().split('T')[0]
    const todayTransactions = transactions.filter(t => 
      t.performedAt.startsWith(today)
    )

    return {
      totalProducts: products.length,
      totalValue: products.reduce((sum, p) => sum + (p.currentStock * p.costPrice), 0),
      lowStockItems: products.filter(p => p.currentStock <= p.minStockLevel).length,
      outOfStockItems: products.filter(p => p.currentStock === 0).length,
      totalTransactionsToday: todayTransactions.length,
      valueMovementToday: todayTransactions.reduce((sum, t) => sum + (t.totalValue || 0), 0)
    }
  }

  // Stock Alerts
  getStockAlerts(): StockAlert[] {
    const products = this.getProducts()
    const alerts: StockAlert[] = []

    products.forEach(product => {
      if (product.currentStock === 0) {
        alerts.push({
          id: this.generateId(),
          productId: product.id,
          productName: product.name,
          currentStock: product.currentStock,
          minStockLevel: product.minStockLevel,
          reorderPoint: product.reorderPoint,
          alertType: 'out_of_stock',
          severity: 'critical',
          createdAt: new Date().toISOString()
        })
      } else if (product.currentStock <= product.reorderPoint) {
        alerts.push({
          id: this.generateId(),
          productId: product.id,
          productName: product.name,
          currentStock: product.currentStock,
          minStockLevel: product.minStockLevel,
          reorderPoint: product.reorderPoint,
          alertType: 'low_stock',
          severity: product.currentStock <= product.minStockLevel ? 'high' : 'medium',
          createdAt: new Date().toISOString()
        })
      } else if (product.currentStock >= product.maxStockLevel) {
        alerts.push({
          id: this.generateId(),
          productId: product.id,
          productName: product.name,
          currentStock: product.currentStock,
          minStockLevel: product.minStockLevel,
          reorderPoint: product.reorderPoint,
          alertType: 'overstock',
          severity: 'low',
          createdAt: new Date().toISOString()
        })
      }
    })

    return alerts.sort((a, b) => {
      const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
      return severityOrder[b.severity] - severityOrder[a.severity]
    })
  }

  // Search and Filter
  searchProducts(query: string): Product[] {
    const products = this.getProducts()
    const lowercaseQuery = query.toLowerCase()
    
    return products.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.sku.toLowerCase().includes(lowercaseQuery) ||
      product.category.toLowerCase().includes(lowercaseQuery) ||
      product.supplier.toLowerCase().includes(lowercaseQuery)
    )
  }

  getProductsByCategory(category: string): Product[] {
    return this.getProducts().filter(p => p.category === category)
  }

  getProductsBySupplier(supplier: string): Product[] {
    return this.getProducts().filter(p => p.supplier === supplier)
  }

  // Initialize data (call this on app startup)
  initializeData(): void {
    // Only initialize if no data exists
    if (typeof window === 'undefined') return

    if (!localStorage.getItem(this.getStorageKey('products'))) {
      this.save('products', sampleProducts)
    }
    if (!localStorage.getItem(this.getStorageKey('transactions'))) {
      this.save('transactions', sampleTransactions)
    }
    if (!localStorage.getItem(this.getStorageKey('suppliers'))) {
      this.save('suppliers', sampleSuppliers)
    }
    if (!localStorage.getItem(this.getStorageKey('categories'))) {
      this.save('categories', sampleCategories)
    }
    if (!localStorage.getItem(this.getStorageKey('users'))) {
      this.save('users', sampleUsers)
    }
  }
}

// Export singleton instance
export const dataService = new DataService()