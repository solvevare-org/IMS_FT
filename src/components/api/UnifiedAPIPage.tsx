import React, { useState } from 'react';
import { 
  Key, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Code,
  ChevronDown,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import CreateAPIKeyModal from './CreateAPIKeyModal';
import EndpointDocumentation from './EndpointDocumentation';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdDate: string;
  lastUsed: string;
  status: 'active' | 'revoked';
  permissions: string[];
}

interface UsageStats {
  requestsToday: number;
  requestsThisWeek: number;
  errorRate: number;
  avgResponseTime: number;
  rateLimitUsed: number;
  rateLimitTotal: number;
}

const mockAPIKeys: APIKey[] = [
  {
    id: '1',
    name: 'Production API Key',
    key: 'sk_live_1234567890abcdef1234567890abcdef',
    createdDate: '2024-01-15',
    lastUsed: '2 minutes ago',
    status: 'active',
    permissions: ['products:read', 'inventory:read', 'orders:read', 'orders:write']
  },
  {
    id: '2',
    name: 'Development Key',
    key: 'sk_test_abcdef1234567890abcdef1234567890',
    createdDate: '2024-01-10',
    lastUsed: '1 hour ago',
    status: 'active',
    permissions: ['products:read', 'inventory:read']
  },
  {
    id: '3',
    name: 'Legacy Integration',
    key: 'sk_live_fedcba0987654321fedcba0987654321',
    createdDate: '2023-12-20',
    lastUsed: '5 days ago',
    status: 'revoked',
    permissions: ['products:read']
  }
];

const mockUsageStats: UsageStats = {
  requestsToday: 1247,
  requestsThisWeek: 8934,
  errorRate: 2.3,
  avgResponseTime: 145,
  rateLimitUsed: 1247,
  rateLimitTotal: 10000
};

const dailyRequests = [
  { date: '2024-01-15', requests: 1247 },
  { date: '2024-01-14', requests: 1156 },
  { date: '2024-01-13', requests: 1389 },
  { date: '2024-01-12', requests: 1098 },
  { date: '2024-01-11', requests: 1234 },
  { date: '2024-01-10', requests: 1445 },
  { date: '2024-01-09', requests: 1167 }
];

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
    status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800'
  }`}>
    {status === 'active' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
);

export default function UnifiedAPIPage() {
  const [apiKeys, setApiKeys] = useState(mockAPIKeys);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  const handleCreateAPIKey = (newKey: Omit<APIKey, 'id' | 'createdDate' | 'lastUsed' | 'status'>) => {
    const apiKey: APIKey = {
      ...newKey,
      id: Date.now().toString(),
      createdDate: new Date().toISOString().split('T')[0],
      lastUsed: 'Never',
      status: 'active'
    };
    setApiKeys(prev => [apiKey, ...prev]);
    setShowCreateModal(false);
  };

  const handleRevokeKey = (keyId: string) => {
    if (confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, status: 'revoked' as const } : key
      ));
    }
  };

  const maxRequests = Math.max(...dailyRequests.map(d => d.requests));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Unified API</h1>
          <p className="text-gray-600">Manage API keys, monitor usage, and explore endpoints</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Generate New Key
        </button>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Requests Today</p>
              <p className="text-2xl font-bold text-gray-900">{mockUsageStats.requestsToday.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{(100 - mockUsageStats.errorRate).toFixed(1)}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900">{mockUsageStats.avgResponseTime}ms</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Rate Limit</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round((mockUsageStats.rateLimitUsed / mockUsageStats.rateLimitTotal) * 100)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* API Keys Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Usage Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">API Usage (Last 7 Days)</h3>
              <div className="text-sm text-gray-500">
                Total: {dailyRequests.reduce((sum, day) => sum + day.requests, 0).toLocaleString()} requests
              </div>
            </div>
            
            <div className="flex items-end justify-between h-32 gap-2">
              {dailyRequests.reverse().map((day, index) => (
                <div key={index} className="flex flex-col items-center gap-2 flex-1">
                  <div 
                    className="bg-blue-500 rounded-t w-full min-h-[4px] transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${(day.requests / maxRequests) * 100}%` }}
                    title={`${day.requests} requests`}
                  ></div>
                  <span className="text-xs text-gray-500 transform -rotate-45 origin-center">
                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* API Keys Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Used
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
                  {apiKeys.map((apiKey, index) => (
                    <tr 
                      key={apiKey.id}
                      className={`hover:bg-gray-50 transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-25'
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{apiKey.name}</div>
                          <div className="text-sm text-gray-500">
                            Created {new Date(apiKey.createdDate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">
                            {visibleKeys.has(apiKey.id) 
                              ? apiKey.key 
                              : `${apiKey.key.substring(0, 12)}...${apiKey.key.substring(apiKey.key.length - 4)}`
                            }
                          </code>
                          <button
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title={visibleKeys.has(apiKey.id) ? 'Hide key' : 'Show key'}
                          >
                            {visibleKeys.has(apiKey.id) ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(apiKey.key)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Copy to clipboard"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-700">{apiKey.lastUsed}</span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={apiKey.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {apiKey.status === 'active' && (
                            <button
                              onClick={() => handleRevokeKey(apiKey.id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Revoke Key"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* API Documentation Panel */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">API Endpoints</h3>
            <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700">
              <ExternalLink className="w-4 h-4" />
              Full Docs
            </button>
          </div>
          
          <EndpointDocumentation 
            expandedEndpoints={expandedEndpoints}
            setExpandedEndpoints={setExpandedEndpoints}
          />
        </div>
      </div>

      {/* Rate Limit Info */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Limits & Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Daily Requests</span>
              <span className="text-sm text-gray-500">
                {mockUsageStats.rateLimitUsed.toLocaleString()} / {mockUsageStats.rateLimitTotal.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(mockUsageStats.rateLimitUsed / mockUsageStats.rateLimitTotal) * 100}%` }}
              ></div>
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Error Rate</span>
              <span className="text-sm text-gray-500">{mockUsageStats.errorRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mockUsageStats.errorRate}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <CreateAPIKeyModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateAPIKey}
        />
      )}
    </div>
  );
}