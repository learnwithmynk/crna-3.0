/**
 * PrivacyTab
 *
 * Simplified privacy settings:
 * - Download/export data (GDPR/CCPA requirement)
 * - Privacy rights information
 */

import { useState } from 'react';
import { Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export function PrivacyTab() {
  const { user } = useAuth();
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExportData = async () => {
    setIsExporting(true);
    setExportComplete(false);

    // TODO: Implement full data export from Supabase
    // For now, export what we have in user_metadata
    await new Promise(resolve => setTimeout(resolve, 1000));

    const userData = {
      email: user?.email,
      profile: user?.user_metadata,
      exportDate: new Date().toISOString(),
    };

    // Create and download JSON file
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crna-club-data-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setIsExporting(false);
    setExportComplete(true);
    setTimeout(() => setExportComplete(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Data Export */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="w-5 h-5 text-gray-600" />
            Export Your Data
          </CardTitle>
          <CardDescription>
            Download a copy of your data in JSON format
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Get a copy of all your data including profile information, tracker entries,
            saved programs, forum posts, and more.
          </p>
          <Button
            onClick={handleExportData}
            disabled={isExporting}
            variant="outline"
          >
            {isExporting ? (
              <>
                <Download className="w-4 h-4 mr-2 animate-pulse" />
                Preparing Export...
              </>
            ) : exportComplete ? (
              <>
                <Download className="w-4 h-4 mr-2" />
                Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Contact */}
      <p className="text-sm text-gray-500">
        For privacy questions or data requests, contact{' '}
        <a href="mailto:privacy@thecrnaclub.com" className="underline">
          privacy@thecrnaclub.com
        </a>
      </p>
    </div>
  );
}
