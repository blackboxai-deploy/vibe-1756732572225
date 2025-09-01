// Core data types for Stock Management System

export interface Product {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  supplier: string;
  costPrice: number;
  sellingPrice: number;
  currentStock: number;
  minStockLevel: number;
  maxStockLevel: number;
  reorderPoint: number;
  unit: string; // e.g., "pieces", "kg", "liters"
  location?: string;
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
  updatedAt: string;
}

export interface StockTransaction {
  id: string;
  productId: string;
  productName: string;
  type: 'in' | 'out' | 'adjustment';
  quantity: number;
  unitPrice?: number;
  totalValue?: number;
  reason: string;
  reference?: string; // PO number, invoice number, etc.
  performedBy: string;
  performedAt: string;
  notes?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  paymentTerms?: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
  status: 'active' | 'inactive';
  lastLogin?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  status: 'active' | 'inactive';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplierId: string;
  supplierName: string;
  items: PurchaseOrderItem[];
  status: 'draft' | 'sent' | 'confirmed' | 'received' | 'cancelled';
  orderDate: string;
  expectedDate?: string;
  receivedDate?: string;
  totalAmount: number;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface PurchaseOrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity?: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalTransactionsToday: number;
  valueMovementToday: number;
}

export interface StockAlert {
  id: string;
  productId: string;
  productName: string;
  currentStock: number;
  minStockLevel: number;
  reorderPoint: number;
  alertType: 'low_stock' | 'out_of_stock' | 'overstock';
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
}

export interface ReportFilter {
  startDate?: string;
  endDate?: string;
  productId?: string;
  category?: string;
  supplier?: string;
  transactionType?: 'in' | 'out' | 'adjustment';
}

export interface StockMovementReport {
  productId: string;
  productName: string;
  openingStock: number;
  stockIn: number;
  stockOut: number;
  adjustments: number;
  closingStock: number;
  value: number;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
}