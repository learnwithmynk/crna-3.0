/**
 * ProtectionStatusCards
 *
 * Displays status overview cards for access-controlled resources.
 * Shows: Protected, Public, Premium Only, No Rules (warning)
 */

import { Card, CardContent } from '@/components/ui/card';
import { Shield, Globe, Crown, AlertTriangle } from 'lucide-react';

export function ProtectionStatusCards({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Protected Resources */}
      <Card className="border-green-200 bg-green-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-green-900">{stats.protected}</div>
            <Shield className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-sm text-green-700 font-medium">Protected</p>
          <p className="text-xs text-green-600 mt-1">Access rules configured</p>
        </CardContent>
      </Card>

      {/* Public Resources */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-blue-900">{stats.public}</div>
            <Globe className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-sm text-blue-700 font-medium">Public</p>
          <p className="text-xs text-blue-600 mt-1">Available to everyone</p>
        </CardContent>
      </Card>

      {/* Premium Only */}
      <Card className="border-purple-200 bg-purple-50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className="text-2xl font-bold text-purple-900">{stats.premiumOnly}</div>
            <Crown className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-sm text-purple-700 font-medium">Premium Only</p>
          <p className="text-xs text-purple-600 mt-1">Active membership required</p>
        </CardContent>
      </Card>

      {/* No Rules (Warning) */}
      <Card className={stats.noRules > 0 ? 'border-red-200 bg-red-50' : 'border-gray-200 bg-gray-50'}>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <div className={`text-2xl font-bold ${stats.noRules > 0 ? 'text-red-900' : 'text-gray-900'}`}>
              {stats.noRules}
            </div>
            <AlertTriangle className={`w-5 h-5 ${stats.noRules > 0 ? 'text-red-600' : 'text-gray-400'}`} />
          </div>
          <p className={`text-sm font-medium ${stats.noRules > 0 ? 'text-red-700' : 'text-gray-700'}`}>
            No Rules
          </p>
          <p className={`text-xs mt-1 ${stats.noRules > 0 ? 'text-red-600' : 'text-gray-500'}`}>
            {stats.noRules > 0 ? 'Needs configuration' : 'All configured'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProtectionStatusCards;
