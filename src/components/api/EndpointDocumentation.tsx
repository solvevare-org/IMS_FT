import React from 'react';
import { ChevronDown, ChevronRight, Copy, Code } from 'lucide-react';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  title: string;
  description: string;
  parameters?: Parameter[];
  sampleResponse: any;
}

interface Parameter {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface EndpointDocumentationProps {
  expandedEndpoints: Set<string>;
  setExpandedEndpoints: React.Dispatch<React.SetStateAction<Set<string>>>;
}

const endpoints: Endpoint[] = [
  {
    id: 'products-list',
    method: 'GET',
    path: '/api/v1/products',
    title: 'List Products',
    description: 'Retrieve a list of all products from connected suppliers',
    parameters: [
      { name: 'limit', type: 'integer', required: false, description: 'Number of products to return (max 100)' },
      { name: 'offset', type: 'integer', required: false, description: 'Number of products to skip' },
      { name: 'supplier', type: 'string', required: false, description: 'Filter by supplier name' },
      { name: 'category', type: 'string', required: false, description: 'Filter by product category' }
    ],
    sampleResponse: {
      data: [
        {
          id: "1",
          sku: "WH-001",
          name: "Wireless Bluetooth Headphones",
          supplier: "TechCorp API",
          category: "Electronics",
          price: 89.99,
          stock: 45
        }
      ],
      pagination: {
        total: 1247,
        limit: 50,
        offset: 0
      }
    }
  },
  {
    id: 'products-get',
    method: 'GET',
    path: '/api/v1/products/{id}',
    title: 'Get Product',
    description: 'Retrieve detailed information about a specific product',
    parameters: [
      { name: 'id', type: 'string', required: true, description: 'Product ID or SKU' }
    ],
    sampleResponse: {
      id: "1",
      sku: "WH-001",
      name: "Wireless Bluetooth Headphones",
      supplier: "TechCorp API",
      category: "Electronics",
      price: 89.99,
      stock: 45,
      description: "High-quality wireless headphones with noise cancellation",
      images: ["https://example.com/image1.jpg"],
      lastUpdated: "2024-01-15T10:30:00Z"
    }
  },
  {
    id: 'inventory-list',
    method: 'GET',
    path: '/api/v1/inventory',
    title: 'List Inventory',
    description: 'Get current stock levels across all warehouses',
    parameters: [
      { name: 'warehouse', type: 'string', required: false, description: 'Filter by warehouse location' },
      { name: 'low_stock', type: 'boolean', required: false, description: 'Show only low stock items' }
    ],
    sampleResponse: {
      data: [
        {
          sku: "WH-001",
          productName: "Wireless Bluetooth Headphones",
          stockQuantity: 45,
          allocated: 12,
          available: 33,
          warehouse: "Main Warehouse",
          reorderLevel: 20
        }
      ]
    }
  },
  {
    id: 'inventory-update',
    method: 'PUT',
    path: '/api/v1/inventory/{sku}',
    title: 'Update Stock',
    description: 'Update stock levels for a specific product',
    parameters: [
      { name: 'sku', type: 'string', required: true, description: 'Product SKU' }
    ],
    sampleResponse: {
      sku: "WH-001",
      previousStock: 45,
      newStock: 50,
      adjustment: 5,
      updatedAt: "2024-01-15T10:30:00Z"
    }
  },
  {
    id: 'orders-list',
    method: 'GET',
    path: '/api/v1/orders',
    title: 'List Orders',
    description: 'Retrieve purchase and sales orders',
    parameters: [
      { name: 'type', type: 'string', required: false, description: 'Filter by order type (purchase/sales)' },
      { name: 'status', type: 'string', required: false, description: 'Filter by order status' }
    ],
    sampleResponse: {
      data: [
        {
          id: "PO-001",
          type: "purchase",
          supplier: "TechCorp API",
          status: "pending",
          totalValue: 2450.00,
          items: [
            {
              sku: "WH-001",
              quantity: 25,
              unitPrice: 89.99
            }
          ]
        }
      ]
    }
  },
  {
    id: 'orders-create',
    method: 'POST',
    path: '/api/v1/orders',
    title: 'Create Order',
    description: 'Create a new purchase or sales order',
    sampleResponse: {
      id: "PO-002",
      type: "purchase",
      supplier: "TechCorp API",
      status: "pending",
      totalValue: 1299.90,
      createdAt: "2024-01-15T10:30:00Z"
    }
  }
];

const MethodBadge = ({ method }: { method: string }) => {
  const colors = {
    GET: 'bg-green-100 text-green-800',
    POST: 'bg-blue-100 text-blue-800',
    PUT: 'bg-yellow-100 text-yellow-800',
    DELETE: 'bg-red-100 text-red-800'
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${colors[method as keyof typeof colors]}`}>
      {method}
    </span>
  );
};

export default function EndpointDocumentation({ expandedEndpoints, setExpandedEndpoints }: EndpointDocumentationProps) {
  const toggleEndpoint = (endpointId: string) => {
    setExpandedEndpoints(prev => {
      const newSet = new Set(prev);
      if (newSet.has(endpointId)) {
        newSet.delete(endpointId);
      } else {
        newSet.add(endpointId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-2">
      {endpoints.map(endpoint => {
        const isExpanded = expandedEndpoints.has(endpoint.id);
        
        return (
          <div key={endpoint.id} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleEndpoint(endpoint.id)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <MethodBadge method={endpoint.method} />
                <div>
                  <div className="font-medium text-gray-900 text-sm">{endpoint.title}</div>
                  <div className="text-xs text-gray-500 font-mono">{endpoint.path}</div>
                </div>
              </div>
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            
            {isExpanded && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-700 mb-4">{endpoint.description}</p>
                
                {endpoint.parameters && endpoint.parameters.length > 0 && (
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-900 mb-2">Parameters</h5>
                    <div className="space-y-2">
                      {endpoint.parameters.map(param => (
                        <div key={param.name} className="flex items-start gap-3 text-sm">
                          <code className="bg-white px-2 py-1 rounded text-xs font-mono border">
                            {param.name}
                          </code>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-600">{param.type}</span>
                              {param.required && (
                                <span className="text-red-600 text-xs">required</span>
                              )}
                            </div>
                            <p className="text-gray-600 text-xs mt-1">{param.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="text-sm font-medium text-gray-900">Sample Response</h5>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(endpoint.sampleResponse, null, 2))}
                      className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                      Copy
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded p-3 overflow-x-auto">
                    <pre className="text-xs text-green-400 font-mono">
                      {JSON.stringify(endpoint.sampleResponse, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}