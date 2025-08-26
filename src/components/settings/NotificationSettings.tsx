import React, { useState } from 'react';
import { Bell, AlertTriangle, Zap, Mail, Smartphone, Globe } from 'lucide-react';

interface NotificationSettingsProps {
  onSettingsChange: () => void;
}

export default function NotificationSettings({ onSettingsChange }: NotificationSettingsProps) {
  const [settings, setSettings] = useState({
    lowStockAlerts: {
      enabled: true,
      email: true,
      push: false,
      threshold: 20
    },
    syncErrors: {
      enabled: true,
      email: true,
      push: true,
      immediateAlert: true
    },
    orderUpdates: {
      enabled: false,
      email: false,
      push: false
    },
    supplierAlerts: {
      enabled: true,
      email: true,
      push: false
    },
    systemMaintenance: {
      enabled: true,
      email: true,
      push: false,
      advanceNotice: 24
    }
  });

  const handleToggle = (category: string, field: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const handleThresholdChange = (category: string, field: string, value: number) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [field]: value
      }
    }));
    onSettingsChange();
  };

  const ToggleSwitch = ({ enabled, onChange, disabled = false }: { 
    enabled: boolean; 
    onChange: (value: boolean) => void;
    disabled?: boolean;
  }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!enabled)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        enabled 
          ? 'bg-blue-600' 
          : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Low Stock Alerts */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Low Stock Alerts</div>
              <div className="text-sm text-gray-600">Get notified when inventory falls below threshold</div>
            </div>
            <ToggleSwitch 
              enabled={settings.lowStockAlerts.enabled}
              onChange={(value) => handleToggle('lowStockAlerts', 'enabled', value)}
            />
          </div>

          {settings.lowStockAlerts.enabled && (
            <>
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Threshold
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={settings.lowStockAlerts.threshold}
                      onChange={(e) => handleThresholdChange('lowStockAlerts', 'threshold', parseInt(e.target.value) || 20)}
                      className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span className="text-sm text-gray-600">units or below</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                    </div>
                    <ToggleSwitch 
                      enabled={settings.lowStockAlerts.email}
                      onChange={(value) => handleToggle('lowStockAlerts', 'email', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                    </div>
                    <ToggleSwitch 
                      enabled={settings.lowStockAlerts.push}
                      onChange={(value) => handleToggle('lowStockAlerts', 'push', value)}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sync Errors */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">Sync Errors</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Sync Error Alerts</div>
              <div className="text-sm text-gray-600">Get notified when API sync operations fail</div>
            </div>
            <ToggleSwitch 
              enabled={settings.syncErrors.enabled}
              onChange={(value) => handleToggle('syncErrors', 'enabled', value)}
            />
          </div>

          {settings.syncErrors.enabled && (
            <div className="border-t border-gray-200 pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Immediate Alerts</div>
                  <div className="text-sm text-gray-600">Send alerts as soon as errors occur</div>
                </div>
                <ToggleSwitch 
                  enabled={settings.syncErrors.immediateAlert}
                  onChange={(value) => handleToggle('syncErrors', 'immediateAlert', value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Email Notifications</span>
                  </div>
                  <ToggleSwitch 
                    enabled={settings.syncErrors.email}
                    onChange={(value) => handleToggle('syncErrors', 'email', value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Push Notifications</span>
                  </div>
                  <ToggleSwitch 
                    enabled={settings.syncErrors.push}
                    onChange={(value) => handleToggle('syncErrors', 'push', value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Additional Notification Types */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Bell className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Additional Notifications</h3>
        </div>
        
        <div className="space-y-4">
          {/* Order Updates */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Order Updates</div>
                <div className="text-sm text-gray-600">Notifications for order status changes</div>
              </div>
              <ToggleSwitch 
                enabled={settings.orderUpdates.enabled}
                onChange={(value) => handleToggle('orderUpdates', 'enabled', value)}
              />
            </div>
          </div>

          {/* Supplier Alerts */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Supplier Alerts</div>
                <div className="text-sm text-gray-600">Notifications about supplier API status changes</div>
              </div>
              <ToggleSwitch 
                enabled={settings.supplierAlerts.enabled}
                onChange={(value) => handleToggle('supplierAlerts', 'enabled', value)}
              />
            </div>
          </div>

          {/* System Maintenance */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">System Maintenance</div>
                <div className="text-sm text-gray-600">Advance notice of scheduled maintenance</div>
              </div>
              <ToggleSwitch 
                enabled={settings.systemMaintenance.enabled}
                onChange={(value) => handleToggle('systemMaintenance', 'enabled', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notification Delivery Settings */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h4 className="text-lg font-semibold text-blue-900">Delivery Settings</h4>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Quiet Hours
            </label>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-blue-700">From:</label>
                <input
                  type="time"
                  defaultValue="22:00"
                  className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-blue-700">To:</label>
                <input
                  type="time"
                  defaultValue="08:00"
                  className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                />
              </div>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Non-urgent notifications will be delayed during these hours
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-blue-900 mb-2">
              Notification Frequency
            </label>
            <select className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white">
              <option value="immediate">Immediate</option>
              <option value="hourly">Hourly Digest</option>
              <option value="daily">Daily Digest</option>
              <option value="weekly">Weekly Summary</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}