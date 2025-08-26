import React, { useState } from 'react';
import { Building, Mail, Globe, User, MapPin, Phone } from 'lucide-react';

interface ProfileSettingsProps {
  onSettingsChange: () => void;
}

const timezones = [
  'UTC-12:00 - Baker Island',
  'UTC-11:00 - American Samoa',
  'UTC-10:00 - Hawaii',
  'UTC-09:00 - Alaska',
  'UTC-08:00 - Pacific Time',
  'UTC-07:00 - Mountain Time',
  'UTC-06:00 - Central Time',
  'UTC-05:00 - Eastern Time',
  'UTC-04:00 - Atlantic Time',
  'UTC-03:00 - Argentina',
  'UTC-02:00 - South Georgia',
  'UTC-01:00 - Azores',
  'UTC+00:00 - London, Dublin',
  'UTC+01:00 - Paris, Berlin',
  'UTC+02:00 - Cairo, Athens',
  'UTC+03:00 - Moscow, Istanbul',
  'UTC+04:00 - Dubai, Baku',
  'UTC+05:00 - Karachi, Tashkent',
  'UTC+06:00 - Dhaka, Almaty',
  'UTC+07:00 - Bangkok, Jakarta',
  'UTC+08:00 - Singapore, Beijing',
  'UTC+09:00 - Tokyo, Seoul',
  'UTC+10:00 - Sydney, Melbourne',
  'UTC+11:00 - Solomon Islands',
  'UTC+12:00 - New Zealand'
];

export default function ProfileSettings({ onSettingsChange }: ProfileSettingsProps) {
  const [formData, setFormData] = useState({
    companyName: 'Acme Corporation',
    email: 'admin@acme.com',
    timezone: 'UTC-05:00 - Eastern Time',
    firstName: 'John',
    lastName: 'Doe',
    jobTitle: 'Operations Manager',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    onSettingsChange();
  };

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Building className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter company name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Primary Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>
        </div>
      </div>
      </div>

      {/* Personal Information */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter first name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter last name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Title
            </label>
            <input
              type="text"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter job title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Address Information</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter street address"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State/Province
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="State"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP/Postal Code
              </label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="ZIP"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <select
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="United States">United States</option>
              <option value="Canada">Canada</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Australia">Australia</option>
              <option value="Japan">Japan</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Regional Settings */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Globe className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Regional Settings</h3>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select
              value={formData.timezone}
              onChange={(e) => handleInputChange('timezone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {timezones.map((timezone) => (
                <option key={timezone} value={timezone}>
                  {timezone}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Used for displaying dates and scheduling reports
            </p>
          </div>
        </div>
        </div>
      </div>

      {/* Account Security */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Security</h3>
        <div className="bg-gray-50 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Password</div>
              <div className="text-sm text-blue-600">Last changed 3 months ago</div>
            </div>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Change Password
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-gray-900">Two-Factor Authentication</div>
              <div className="text-sm text-blue-600">Add an extra layer of security</div>
            </div>
            <button className="px-4 py-2 border border-blue-300 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors">
              Enable 2FA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}