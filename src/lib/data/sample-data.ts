import { Product, Supplier, Category, StockTransaction, User } from '@/types'

export const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Dell Laptop OptiPlex 7080',
    description: 'High-performance business laptop with Intel i7 processor',
    sku: 'DELL-OPT-7080',
    category: 'Electronics',
    supplier: 'Dell Technologies',
    costPrice: 899.99,
    sellingPrice: 1299.99,
    currentStock: 25,
    minStockLevel: 5,
    maxStockLevel: 50,
    reorderPoint: 10,
    unit: 'pieces',
    location: 'Warehouse A1',
    status: 'active',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    name: 'Office Chair Executive',
    description: 'Ergonomic executive office chair with lumbar support',
    sku: 'CHAIR-EXEC-001',
    category: 'Furniture',
    supplier: 'Office Solutions Inc',
    costPrice: 149.99,
    sellingPrice: 249.99,
    currentStock: 8,
    minStockLevel: 10,
    maxStockLevel: 30,
    reorderPoint: 12,
    unit: 'pieces',
    location: 'Warehouse B2',
    status: 'active',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-18T11:15:00Z'
  },
  {
    id: '3',
    name: 'HP Printer LaserJet Pro',
    description: 'Monochrome laser printer for office use',
    sku: 'HP-LJ-PRO-M404',
    category: 'Electronics',
    supplier: 'HP Inc',
    costPrice: 179.99,
    sellingPrice: 279.99,
    currentStock: 0,
    minStockLevel: 3,
    maxStockLevel: 15,
    reorderPoint: 5,
    unit: 'pieces',
    location: 'Warehouse A2',
    status: 'active',
    createdAt: '2024-01-12T08:30:00Z',
    updatedAt: '2024-01-22T16:45:00Z'
  },
  {
    id: '4',
    name: 'Copy Paper A4 Premium',
    description: 'High-quality white copy paper 80gsm',
    sku: 'PAPER-A4-80G',
    category: 'Office Supplies',
    supplier: 'Paper Plus Ltd',
    costPrice: 4.99,
    sellingPrice: 7.99,
    currentStock: 150,
    minStockLevel: 50,
    maxStockLevel: 200,
    reorderPoint: 75,
    unit: 'reams',
    location: 'Warehouse C1',
    status: 'active',
    createdAt: '2024-01-08T12:00:00Z',
    updatedAt: '2024-01-21T10:20:00Z'
  },
  {
    id: '5',
    name: 'Wireless Mouse Logitech',
    description: 'Ergonomic wireless mouse with USB receiver',
    sku: 'LOGI-MOUSE-M705',
    category: 'Electronics',
    supplier: 'Logitech International',
    costPrice: 29.99,
    sellingPrice: 49.99,
    currentStock: 45,
    minStockLevel: 20,
    maxStockLevel: 80,
    reorderPoint: 25,
    unit: 'pieces',
    location: 'Warehouse A3',
    status: 'active',
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-19T09:10:00Z'
  }
]

export const sampleSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'Dell Technologies',
    contactPerson: 'John Smith',
    email: 'orders@dell.com',
    phone: '+1-800-555-0123',
    address: '1 Dell Way',
    city: 'Round Rock',
    country: 'USA',
    paymentTerms: 'Net 30',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Office Solutions Inc',
    contactPerson: 'Sarah Johnson',
    email: 'sales@officesolutions.com',
    phone: '+1-555-123-4567',
    address: '456 Business Ave',
    city: 'Chicago',
    country: 'USA',
    paymentTerms: 'Net 45',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'HP Inc',
    contactPerson: 'Mike Wilson',
    email: 'b2b@hp.com',
    phone: '+1-800-HP-HELP',
    address: '1501 Page Mill Rd',
    city: 'Palo Alto',
    country: 'USA',
    paymentTerms: 'Net 30',
    status: 'active',
    createdAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Paper Plus Ltd',
    contactPerson: 'Emma Davis',
    email: 'orders@paperplus.com',
    phone: '+1-555-987-6543',
    address: '789 Industrial Blvd',
    city: 'Atlanta',
    country: 'USA',
    paymentTerms: 'Net 15',
    status: 'active',
    createdAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Logitech International',
    contactPerson: 'David Chen',
    email: 'enterprise@logitech.com',
    phone: '+1-555-456-7890',
    address: '7700 Gateway Blvd',
    city: 'Newark',
    country: 'USA',
    paymentTerms: 'Net 30',
    status: 'active',
    createdAt: '2024-01-05T00:00:00Z'
  }
]

export const sampleCategories: Category[] = [
  {
    id: '1',
    name: 'Electronics',
    description: 'Computers, printers, and electronic devices',
    status: 'active'
  },
  {
    id: '2',
    name: 'Furniture',
    description: 'Office furniture and fixtures',
    status: 'active'
  },
  {
    id: '3',
    name: 'Office Supplies',
    description: 'Paper, pens, and general office supplies',
    status: 'active'
  },
  {
    id: '4',
    name: 'Safety Equipment',
    description: 'Safety gear and protective equipment',
    status: 'active'
  }
]

export const sampleTransactions: StockTransaction[] = [
  {
    id: '1',
    productId: '1',
    productName: 'Dell Laptop OptiPlex 7080',
    type: 'in',
    quantity: 10,
    unitPrice: 899.99,
    totalValue: 8999.90,
    reason: 'Purchase Order',
    reference: 'PO-2024-001',
    performedBy: 'admin',
    performedAt: '2024-01-20T14:30:00Z',
    notes: 'Initial stock purchase from Dell'
  },
  {
    id: '2',
    productId: '2',
    productName: 'Office Chair Executive',
    type: 'out',
    quantity: 2,
    unitPrice: 249.99,
    totalValue: 499.98,
    reason: 'Sale',
    reference: 'INV-2024-001',
    performedBy: 'staff1',
    performedAt: '2024-01-21T10:15:00Z',
    notes: 'Sold to corporate client'
  },
  {
    id: '3',
    productId: '4',
    productName: 'Copy Paper A4 Premium',
    type: 'in',
    quantity: 100,
    unitPrice: 4.99,
    totalValue: 499.00,
    reason: 'Purchase Order',
    reference: 'PO-2024-002',
    performedBy: 'admin',
    performedAt: '2024-01-21T16:20:00Z',
    notes: 'Monthly paper supply restock'
  },
  {
    id: '4',
    productId: '3',
    productName: 'HP Printer LaserJet Pro',
    type: 'out',
    quantity: 3,
    unitPrice: 279.99,
    totalValue: 839.97,
    reason: 'Sale',
    reference: 'INV-2024-002',
    performedBy: 'staff2',
    performedAt: '2024-01-22T09:45:00Z',
    notes: 'Last units sold - need to reorder'
  },
  {
    id: '5',
    productId: '5',
    productName: 'Wireless Mouse Logitech',
    type: 'adjustment',
    quantity: -2,
    reason: 'Damaged Items',
    reference: 'ADJ-2024-001',
    performedBy: 'admin',
    performedAt: '2024-01-22T11:30:00Z',
    notes: 'Found damaged during quality check'
  }
]

export const sampleUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@stockmanager.com',
    fullName: 'Admin User',
    role: 'admin',
    permissions: ['all'],
    status: 'active',
    lastLogin: '2024-01-22T08:00:00Z',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    username: 'manager1',
    email: 'manager@stockmanager.com',
    fullName: 'John Manager',
    role: 'manager',
    permissions: ['products:read', 'products:write', 'stock:read', 'stock:write', 'reports:read'],
    status: 'active',
    lastLogin: '2024-01-21T15:30:00Z',
    createdAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '3',
    username: 'staff1',
    email: 'staff1@stockmanager.com',
    fullName: 'Alice Staff',
    role: 'staff',
    permissions: ['products:read', 'stock:read', 'stock:write'],
    status: 'active',
    lastLogin: '2024-01-22T07:45:00Z',
    createdAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '4',
    username: 'staff2',
    email: 'staff2@stockmanager.com',
    fullName: 'Bob Staff',
    role: 'staff',
    permissions: ['products:read', 'stock:read', 'stock:write'],
    status: 'active',
    lastLogin: '2024-01-21T16:20:00Z',
    createdAt: '2024-01-12T00:00:00Z'
  }
]