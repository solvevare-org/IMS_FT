import React, { useState } from 'react';
import { X, Key, Shield, AlertCircle } from 'lucide-react';

interface APIKey {
  name: string;
  key: string;
  permissions: string[];
}

interface CreateAPIKeyModalProps {
  onClose: () => void;
  onSubmit: (apiKey: Omit<APIKey, 'key'> & { key: string }) => void;
}

const availablePermissions = [
  { id: 'products:read', label: 'Read Products', description: 'View product information' },
  { id: 'products:write', label: 'Write Products', description: 'Create and update products' },
  { id: 'inventory:read', label: 'Read Inventory', description: 'View stock levels' },
  { id: 'inventory:write', label: 'Write Inventory', description: 'Update stock levels' },
  { id: 'orders:read', label: 'Read Orders', description: 'View order information' },
  { id: 'orders:write', label: 'Write Orders', description: 'Create and update orders' },
  { id: 'pricing:read', label: 'Read Pricing', description: 'View pricing rules' },
  { id: 'pricing:write', label: 'Write Pricing', description: 'Manage pricing rules' },
  { id: 'suppliers:read', label: 'Read Suppliers', description: 'View supplier information' },
  { id: 'suppliers:write', label: 'Write Suppliers', description: 'Manage supplier connections' }
];

export default function CreateAPIKeyModal({ onClose, onSubmit }: CreateAPIKeyModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    permissions: [] as string[]
  });

  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  const generateAPIKey = () => {
    const prefix = 'sk_live_';
    const randomPart = Array.from({ length: 32 }, () => 
      Math.random().toString(36).charAt(2)
    ).join('');
    return prefix + randomPart;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newKey = generateAPIKey();
    setGeneratedKey(newKey);
    
    onSubmit({
      ...formData,
      key: newKey
    });
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (generatedKey) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Key className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">API Key Generated</h2>
                <p className="text-sm text-gray-600">Save this key securely - you won't see it again</p>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Security Notice</p>
                  <p>This API key provides access to your data. Store it securely and never share it publicly.</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">API Key Name</label>
                <div className="text-sm text-gray-900 font-medium">{formData.name}</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Generated Key</label>
                <div className="flex items-center gap-2">
                  <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono break-all">
                    {generatedKey}
                  </code>
                  <button
                    onClick={() => copyToClipboard(generatedKey)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                <div className="text-sm text-gray-600">
                  {formData.permissions.map(permission => 
                    availablePermissions.find(p => p.id === permission)?.label
                  ).join(', ')}
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Generate API Key</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Key className="w-4 h-4 inline mr-2" />
                API Key Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Production API Key"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Choose a descriptive name to identify this key
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                <Shield className="w-4 h-4 inline mr-2" />
                Permissions
              </label>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <input
                      type="checkbox"
                      id={permission.id}
                      checked={formData.permissions.includes(permission.id)}
                      onChange={() => togglePermission(permission.id)}
                      className="mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <label htmlFor={permission.id} className="text-sm font-medium text-gray-900 cursor-pointer">
                        {permission.label}
                      </label>
                      <p className="text-xs text-gray-500">{permission.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {formData.permissions.length === 0 && (
                <p className="text-sm text-red-600 mt-2">Please select at least one permission</p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Security Best Practices</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Store API keys securely and never commit them to version control</li>
                <li>• Use environment variables for API keys in your applications</li>
                <li>• Regularly rotate your API keys</li>
                <li>• Only grant the minimum permissions required</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.name || formData.permissions.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Generate Key
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}