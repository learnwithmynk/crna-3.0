/**
 * AccessWarnings
 *
 * Displays warning cards for resources that need attention.
 * Each warning has: icon, message, resource name, "Fix" and "Dismiss" buttons.
 */

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Settings, X } from 'lucide-react';

export function AccessWarnings({ warnings, onFix, onDismiss }) {
  if (!warnings || warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-500" />
        Attention Needed ({warnings.length})
      </h3>

      <div className="space-y-2">
        {warnings.map((warning) => (
          <Card key={warning.id} className="border-orange-200 bg-orange-50">
            <CardContent className="py-3 px-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-orange-900">
                    {warning.message}
                  </p>
                  <p className="text-xs text-orange-700 mt-1">
                    Type: {warning.resource.type} • Status: {warning.resource.status}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onFix(warning.resource)}
                    className="h-8 text-xs border-orange-300 hover:bg-orange-100"
                  >
                    <Settings className="w-3 h-3 mr-1" />
                    Fix
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDismiss(warning.id)}
                    className="h-8 w-8 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default AccessWarnings;
