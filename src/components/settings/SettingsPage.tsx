import React, { useState } from 'react';
import { 
  User, 
  Bell, 
  Settings as SettingsIcon, 
  Save, 
  X,
  Building,
  Mail,
  Globe,
  Shield,
  Zap
} from 'lucide-react';
import ProfileSettings from './ProfileSettings';
import NotificationSettings from './NotificationSettings';
import SystemPreferences from './SystemPreferences';

type SettingsTab = 'profile' | 'notifications' | 'preferences';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const tabs = [
    {
      id: 'profile' as const,
      label: 'Profile',
      icon: User,
      description: 'Company information and account details'
    },
    {
      id: 'notifications' as const,
      label: 'Notifications',
      icon: Bell,
      description: 'Alert preferences and notification settings'
    },
    {
      id: 'preferences' as const,
      label: 'System',
      icon: SettingsIcon,
      description: 'API limits and system configuration'
    }
  ];

  const handleSaveAll = () => {
    // Simulate saving all settings
    console.log('Saving all settings...');
    setHasUnsavedChanges(false);
    
    // Show success message (you could use a toast library here)
    alert('Settings saved successfully!');
  };

  const handleDiscardChanges = () => {
    if (confirm('Are you sure you want to discard all unsaved changes?')) {
      setHasUnsavedChanges(false);
      // Reset all forms to their original state
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileSettings onSettingsChange={() => setHasUnsavedChanges(true)} />;
      case 'notifications':
        return <NotificationSettings onSettingsChange={() => setHasUnsavedChanges(true)} />;
      case 'preferences':
        return <SystemPreferences onSettingsChange={() => setHasUnsavedChanges(true)} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account, notifications, and system preferences</p>
        </div>
        
        {/* Save/Cancel Actions */}
        {hasUnsavedChanges && (
          <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-sm">
            <button
              onClick={handleDiscardChanges}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Discard
            </button>
            <button
              onClick={handleSaveAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Unsaved Changes Banner */}
      {hasUnsavedChanges && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-yellow-800 font-medium">
              You have unsaved changes. Don't forget to save your settings.
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mt-0.5 ${isActive ? 'text-blue-600' : ''}`} />
                    <div>
                      <div className="font-medium">{tab.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{tab.description}</div>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Tab Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-3">
                {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);
                  const Icon = activeTabData?.icon || User;
                  return (
                    <>
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                          {activeTabData?.label} Settings
                        </h2>
                        <p className="text-sm text-gray-600">
                          {activeTabData?.description}
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Save/Cancel Bar */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 shadow-lg z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              <span>You have unsaved changes</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleDiscardChanges}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors font-medium"
              >
                <X className="w-4 h-4" />
                Discard
              </button>
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                <Save className="w-4 h-4" />
                Save All Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}