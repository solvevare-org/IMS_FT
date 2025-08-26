import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  GripVertical,
  Tag,
  Percent,
  Users,
  Package,
  AlertCircle
} from 'lucide-react';
import CreateRuleModal from './CreateRuleModal';
import EditRuleModal from './EditRuleModal';

interface PricingRule {
  id: string;
  name: string;
  supplier: string;
  category: string;
  productSku?: string;
  markupPercentage: number;
  priority: number;
  isActive: boolean;
  createdDate: string;
  lastModified: string;
}

const mockRules: PricingRule[] = [
  {
    id: '1',
    name: 'Electronics Premium Markup',
    supplier: 'TechCorp API',
    category: 'Electronics',
    markupPercentage: 25,
    priority: 1,
    isActive: true,
    createdDate: '2024-01-15',
    lastModified: '2024-01-20'
  },
  {
    id: '2',
    name: 'Fashion Hub Standard',
    supplier: 'Fashion Hub API',
    category: 'Apparel',
    markupPercentage: 40,
    priority: 2,
    isActive: true,
    createdDate: '2024-01-10',
    lastModified: '2024-01-18'
  },
  {
    id: '3',
    name: 'Home Goods Competitive',
    supplier: 'Home Goods Plus',
    category: 'Home & Garden',
    markupPercentage: 15,
    priority: 3,
    isActive: true,
    createdDate: '2024-01-08',
    lastModified: '2024-01-16'
  },
  {
    id: '4',
    name: 'Wireless Headphones Override',
    supplier: 'TechCorp API',
    category: 'Electronics',
    productSku: 'WH-001',
    markupPercentage: 35,
    priority: 4,
    isActive: false,
    createdDate: '2024-01-12',
    lastModified: '2024-01-14'
  }
];

const StatusBadge = ({ isActive }: { isActive: boolean }) => (
  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
    isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }`}>
    {isActive ? 'Active' : 'Inactive'}
  </span>
);

const SupplierBadge = ({ supplier }: { supplier: string }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
    <Users className="w-3 h-3" />
    {supplier}
  </span>
);

const CategoryBadge = ({ category }: { category: string }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-800 rounded-md text-xs font-medium">
    <Tag className="w-3 h-3" />
    {category}
  </span>
);

const MarkupBadge = ({ percentage }: { percentage: number }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
    <Percent className="w-3 h-3" />
    {percentage}%
  </span>
);

export default function PricingRulesPage() {
  const [rules, setRules] = useState(mockRules);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingRule, setEditingRule] = useState<PricingRule | null>(null);
  const [draggedRule, setDraggedRule] = useState<string | null>(null);

  const filteredRules = rules
    .filter(rule => 
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => a.priority - b.priority);

  const handleCreateRule = (newRule: Omit<PricingRule, 'id' | 'createdDate' | 'lastModified'>) => {
    const rule: PricingRule = {
      ...newRule,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString().split('T')[0]
    };
    setRules(prev => [...prev, rule]);
    setShowCreateModal(false);
  };

  const handleEditRule = (updatedRule: PricingRule) => {
    setRules(prev => prev.map(rule => 
      rule.id === updatedRule.id 
        ? { ...updatedRule, lastModified: new Date().toISOString().split('T')[0] }
        : rule
    ));
    setEditingRule(null);
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this pricing rule?')) {
      setRules(prev => prev.filter(rule => rule.id !== ruleId));
    }
  };

  const handlePriorityChange = (ruleId: string, newPriority: number) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, priority: newPriority, lastModified: new Date().toISOString().split('T')[0] }
        : rule
    ));
  };

  const handleDragStart = (e: React.DragEvent, ruleId: string) => {
    setDraggedRule(ruleId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetRuleId: string) => {
    e.preventDefault();
    if (!draggedRule || draggedRule === targetRuleId) return;

    const draggedIndex = rules.findIndex(rule => rule.id === draggedRule);
    const targetIndex = rules.findIndex(rule => rule.id === targetRuleId);
    
    const newRules = [...rules];
    const [draggedItem] = newRules.splice(draggedIndex, 1);
    newRules.splice(targetIndex, 0, draggedItem);
    
    // Update priorities
    const updatedRules = newRules.map((rule, index) => ({
      ...rule,
      priority: index + 1,
      lastModified: new Date().toISOString().split('T')[0]
    }));
    
    setRules(updatedRules);
    setDraggedRule(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing & Rules</h1>
          <p className="text-gray-600">Manage markup rules and pricing strategies across suppliers</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Rule
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Tag className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Rules</p>
              <p className="text-2xl font-bold text-gray-900">{rules.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <Percent className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Rules</p>
              <p className="text-2xl font-bold text-gray-900">{rules.filter(r => r.isActive).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Suppliers Covered</p>
              <p className="text-2xl font-bold text-gray-900">{new Set(rules.map(r => r.supplier)).size}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Package className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Markup</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(rules.reduce((sum, rule) => sum + rule.markupPercentage, 0) / rules.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pricing Rules</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <GripVertical className="w-4 h-4" />
              <span>Drag to reorder priority</span>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rule Name
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Condition
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Markup
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRules.map((rule, index) => (
                <tr 
                  key={rule.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, rule.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, rule.id)}
                  className={`hover:bg-gray-50 transition-colors cursor-move ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                  } ${draggedRule === rule.id ? 'opacity-50' : ''}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-gray-400" />
                      <input
                        type="number"
                        value={rule.priority}
                        onChange={(e) => handlePriorityChange(rule.id, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent"
                        min="1"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-gray-900">{rule.name}</div>
                      {rule.productSku && (
                        <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                          <Package className="w-3 h-3" />
                          SKU: {rule.productSku}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      <SupplierBadge supplier={rule.supplier} />
                      <CategoryBadge category={rule.category} />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <MarkupBadge percentage={rule.markupPercentage} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge isActive={rule.isActive} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingRule(rule)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Rule"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRule(rule.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredRules.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No pricing rules found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? 'Try adjusting your search terms' : 'Create your first pricing rule to get started'}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Create Rule
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateRuleModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateRule}
        />
      )}

      {editingRule && (
        <EditRuleModal
          rule={editingRule}
          onClose={() => setEditingRule(null)}
          onSubmit={handleEditRule}
        />
      )}
    </div>
  );
}