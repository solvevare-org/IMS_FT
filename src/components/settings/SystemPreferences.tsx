import React, { useState } from 'react';
import { Settings, Zap, Shield, Clock, Database, AlertCircle } from 'lucide-react';

interface SystemPreferencesProps {
  onSettingsChange: () => void;
}

export default function SystemPreferences({ onSettingsChange }: SystemPreferencesProps) {
  const [settings, setSettings] = useState({
    apiLimits: {
      requestsPerMinute: 1000,
      requestsPerHour: 50000,
      requestsPerDay: 1000000,
      enableRateLimit: true,
      enableThrottling: true
    },
    dataRetention: {
      logRetentionDays: 90,
      reportRetentionDays: 365,
      auditLogRetentionDays: 730,
      autoCleanup: true
    },
    security: {
      sessionTimeout: 480, // 8 hours in minutes
      requireMFA: false,
      allowApiKeyRotation: true,
      ipWhitelisting: false
    },
    performance: {
      enableCaching: true,
      cacheExpirationMinutes: 60,
      enableCompression: true,
      maxConcurrentSyncs: 5
    },
    maintenance: {
      autoUpdates: true,
      maintenanceWindow: '02:00',
      backupFrequency: 'daily',
      enableHealthChecks: true
    }
  });

  const handleInputChange = (category: string, field: string, value: any) => {
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
      {/* API Limits Configuration */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">API Limits Configuration</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Rate Limiting</div>
              <div className="text-sm text-gray-600">Protect your API from excessive requests</div>
            </div>
            <ToggleSwitch 
              enabled={settings.apiLimits.enableRateLimit}
              onChange={(value) => handleInputChange('apiLimits', 'enableRateLimit', value)}
            />
          </div>

          {settings.apiLimits.enableRateLimit && (
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requests per Minute
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000"
                    value={settings.apiLimits.requestsPerMinute}
                    onChange={(e) => handleInputChange('apiLimits', 'requestsPerMinute', parseInt(e.target.value) || 1000)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requests per Hour
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100000"
                    value={settings.apiLimits.requestsPerHour}
                    onChange={(e) => handleInputChange('apiLimits', 'requestsPerHour', parseInt(e.target.value) || 50000)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requests per Day
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10000000"
                    value={settings.apiLimits.requestsPerDay}
                    onChange={(e) => handleInputChange('apiLimits', 'requestsPerDay', parseInt(e.target.value) || 1000000)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Enable Request Throttling</div>
                  <div className="text-sm text-gray-600">Gradually slow down requests when approaching limits</div>
                </div>
                <ToggleSwitch 
                  enabled={settings.apiLimits.enableThrottling}
                  onChange={(value) => handleInputChange('apiLimits', 'enableThrottling', value)}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Data Retention */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Retention</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Log Retention (Days)
              </label>
              <input
                type="number"
                min="1"
                max="3650"
                value={settings.dataRetention.logRetentionDays}
                onChange={(e) => handleInputChange('dataRetention', 'logRetentionDays', parseInt(e.target.value) || 90)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Retention (Days)
              </label>
              <input
                type="number"
                min="1"
                max="3650"
                value={settings.dataRetention.reportRetentionDays}
                onChange={(e) => handleInputChange('dataRetention', 'reportRetentionDays', parseInt(e.target.value) || 365)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audit Log Retention (Days)
              </label>
              <input
                type="number"
                min="1"
                max="3650"
                value={settings.dataRetention.auditLogRetentionDays}
                onChange={(e) => handleInputChange('dataRetention', 'auditLogRetentionDays', parseInt(e.target.value) || 730)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto Cleanup</div>
              <div className="text-sm text-gray-600">Automatically delete old data based on retention settings</div>
            </div>
            <ToggleSwitch 
              enabled={settings.dataRetention.autoCleanup}
              onChange={(value) => handleInputChange('dataRetention', 'autoCleanup', value)}
            />
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-purple-600" />
          <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (Minutes)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="15"
                max="1440"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleInputChange('security', 'sessionTimeout', parseInt(e.target.value) || 480)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="text-sm text-gray-600">
                ({Math.floor(settings.security.sessionTimeout / 60)}h {settings.security.sessionTimeout % 60}m)
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Require Multi-Factor Authentication</div>
                <div className="text-sm text-gray-600">Require MFA for all user accounts</div>
              </div>
              <ToggleSwitch 
                enabled={settings.security.requireMFA}
                onChange={(value) => handleInputChange('security', 'requireMFA', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Allow API Key Rotation</div>
                <div className="text-sm text-gray-600">Users can rotate their API keys</div>
              </div>
              <ToggleSwitch 
                enabled={settings.security.allowApiKeyRotation}
                onChange={(value) => handleInputChange('security', 'allowApiKeyRotation', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">IP Whitelisting</div>
                <div className="text-sm text-gray-600">Restrict API access to specific IP addresses</div>
              </div>
              <ToggleSwitch 
                enabled={settings.security.ipWhitelisting}
                onChange={(value) => handleInputChange('security', 'ipWhitelisting', value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Settings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-orange-600" />
          <h3 className="text-lg font-semibold text-gray-900">Performance Settings</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Caching</div>
              <div className="text-sm text-gray-600">Cache API responses to improve performance</div>
            </div>
            <ToggleSwitch 
              enabled={settings.performance.enableCaching}
              onChange={(value) => handleInputChange('performance', 'enableCaching', value)}
            />
          </div>

          {settings.performance.enableCaching && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cache Expiration (Minutes)
              </label>
              <input
                type="number"
                min="1"
                max="1440"
                value={settings.performance.cacheExpirationMinutes}
                onChange={(e) => handleInputChange('performance', 'cacheExpirationMinutes', parseInt(e.target.value) || 60)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Compression</div>
              <div className="text-sm text-gray-600">Compress API responses to reduce bandwidth</div>
            </div>
            <ToggleSwitch 
              enabled={settings.performance.enableCompression}
              onChange={(value) => handleInputChange('performance', 'enableCompression', value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Max Concurrent Syncs
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={settings.performance.maxConcurrentSyncs}
              onChange={(e) => handleInputChange('performance', 'maxConcurrentSyncs', parseInt(e.target.value) || 5)}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Number of supplier syncs that can run simultaneously
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Settings */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Maintenance Settings</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Auto Updates</div>
              <div className="text-sm text-gray-600">Automatically install system updates during maintenance windows</div>
            </div>
            <ToggleSwitch 
              enabled={settings.maintenance.autoUpdates}
              onChange={(value) => handleInputChange('maintenance', 'autoUpdates', value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Window Start Time
            </label>
            <input
              type="time"
              value={settings.maintenance.maintenanceWindow}
              onChange={(e) => handleInputChange('maintenance', 'maintenanceWindow', e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">
              Preferred time for system maintenance (UTC)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backup Frequency
            </label>
            <select
              value={settings.maintenance.backupFrequency}
              onChange={(e) => handleInputChange('maintenance', 'backupFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Enable Health Checks</div>
              <div className="text-sm text-gray-600">Monitor system health and send alerts</div>
            </div>
            <ToggleSwitch 
              enabled={settings.maintenance.enableHealthChecks}
              onChange={(value) => handleInputChange('maintenance', 'enableHealthChecks', value)}
            />
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertCircle className="w-5 h-5 text-blue-600" />
          <h4 className="text-lg font-semibold text-blue-900">System Information</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-blue-700 font-medium">Platform Version:</span>
            <div className="text-blue-900">v2.1.4</div>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Last Updated:</span>
            <div className="text-blue-900">January 15, 2024</div>
          </div>
          <div>
            <span className="text-blue-700 font-medium">Database Version:</span>
            <div className="text-blue-900">PostgreSQL 15.2</div>
          </div>
          <div>
            <span className="text-blue-700 font-medium">API Version:</span>
            <div className="text-blue-900">v1.0</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm">
            Check for Updates
          </button>
        </div>
      </div>
    </div>
  );
}