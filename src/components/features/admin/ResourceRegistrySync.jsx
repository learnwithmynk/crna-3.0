/**
 * Resource Registry Sync Component
 *
 * Admin tool to sync the resource registry to the database.
 * Should be integrated into the Admin Entitlements page.
 */

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { syncResourceRegistry, previewSync } from '@/lib/syncResourceRegistry';
import { validateRegistry } from '@/config/resource-registry';
import { CheckCircle2, XCircle, AlertCircle, RefreshCw, Eye, Play } from 'lucide-react';

export function ResourceRegistrySync() {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [results, setResults] = useState(null);
  const [validation, setValidation] = useState(null);

  // Validate registry on mount
  useState(() => {
    const v = validateRegistry();
    setValidation(v);
  }, []);

  const handlePreview = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const previewResults = await previewSync();
      setPreview(previewResults);
    } catch (error) {
      console.error('Preview failed:', error);
      setPreview({
        success: false,
        errors: [{ type: 'system', message: error.message }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSync = async () => {
    if (!confirm('Sync resource registry to database? This will update all resource metadata.')) {
      return;
    }

    setIsLoading(true);
    setResults(null);
    setPreview(null);

    try {
      const syncResults = await syncResourceRegistry({ verbose: true });
      setResults(syncResults);
    } catch (error) {
      console.error('Sync failed:', error);
      setResults({
        success: false,
        errors: [{ type: 'system', message: error.message }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Registry Sync</CardTitle>
        <CardDescription>
          Sync the resource registry (code) to the protected_resources database table.
          This updates metadata while preserving access control settings.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Validation Status */}
        {validation && (
          <Alert variant={validation.valid ? 'default' : 'destructive'}>
            <div className="flex items-start gap-3">
              {validation.valid ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-medium mb-2">
                  {validation.valid ? 'Registry Valid' : 'Registry Invalid'}
                </div>
                <div className="text-sm space-y-1">
                  <div>Total Resources: {validation.totalResources}</div>
                  <div className="flex gap-3 flex-wrap">
                    <Badge variant="outline">Pages: {validation.byCategory.pages}</Badge>
                    <Badge variant="outline">Features: {validation.byCategory.features}</Badge>
                    <Badge variant="outline">Widgets: {validation.byCategory.widgets}</Badge>
                    <Badge variant="outline">Tools: {validation.byCategory.tools}</Badge>
                  </div>
                </div>
                {!validation.valid && validation.errors && (
                  <div className="mt-3 space-y-1">
                    {validation.errors.map((error, i) => (
                      <div key={i} className="text-sm text-red-600">
                        • {error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handlePreview}
            disabled={isLoading || !validation?.valid}
            variant="outline"
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview Sync
          </Button>

          <Button
            onClick={handleSync}
            disabled={isLoading || !validation?.valid}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Sync to Database
              </>
            )}
          </Button>
        </div>

        {/* Preview Results */}
        {preview && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-2">Preview (Dry Run)</div>
              <div className="text-sm space-y-1">
                <div>Would create: {preview.created} resources</div>
                <div>Would update: {preview.updated} resources</div>
                {preview.orphaned && preview.orphaned.length > 0 && (
                  <div className="mt-2">
                    <div className="font-medium">Orphaned resources (in DB but not in registry):</div>
                    <div className="ml-4 mt-1 space-y-0.5">
                      {preview.orphaned.map(slug => (
                        <div key={slug} className="text-xs">• {slug}</div>
                      ))}
                    </div>
                  </div>
                )}
                {preview.errors && preview.errors.length > 0 && (
                  <div className="mt-2 text-red-600">
                    <div className="font-medium">Errors:</div>
                    {preview.errors.map((err, i) => (
                      <div key={i} className="ml-4 text-xs">• {err.message}</div>
                    ))}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Sync Results */}
        {results && (
          <Alert variant={results.success ? 'default' : 'destructive'}>
            <div className="flex items-start gap-3">
              {results.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <XCircle className="h-5 w-5 mt-0.5" />
              )}
              <div className="flex-1">
                <div className="font-medium mb-2">
                  {results.success ? 'Sync Successful' : 'Sync Failed'}
                </div>
                <div className="text-sm space-y-1">
                  <div>Created: {results.created} resources</div>
                  <div>Updated: {results.updated} resources</div>
                  <div>Errors: {results.errors?.length || 0}</div>
                </div>

                {results.errors && results.errors.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {results.errors.map((error, i) => (
                      <div key={i} className="text-sm">
                        <span className="font-medium">{error.type}:</span> {error.message}
                        {error.slug && ` (${error.slug})`}
                      </div>
                    ))}
                  </div>
                )}

                {results.resources && results.resources.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-medium">
                      View Details ({results.resources.length} changes)
                    </summary>
                    <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                      {results.resources.map((resource, i) => (
                        <div key={i} className="text-xs">
                          <Badge variant={resource.action === 'created' ? 'default' : 'outline'} className="mr-2">
                            {resource.action}
                          </Badge>
                          <span className="font-mono">{resource.slug}</span>
                          {resource.defaultAccessibleVia && (
                            <span className="text-muted-foreground ml-2">
                              ({resource.defaultAccessibleVia.join(', ')})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </div>
            </div>
          </Alert>
        )}

        {/* Help Text */}
        <div className="text-sm text-muted-foreground space-y-2 border-t pt-4">
          <div className="font-medium">How it works:</div>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Registry defines WHAT exists (pages, features, widgets, tools)</li>
            <li>Database stores WHO can access them (via accessible_via)</li>
            <li>Sync updates metadata but PRESERVES access control settings</li>
            <li>New resources get default protection (active_membership + trial + founding)</li>
          </ul>

          <div className="font-medium mt-4">Registry Location:</div>
          <code className="text-xs bg-muted px-2 py-1 rounded">
            src/config/resource-registry.js
          </code>
        </div>
      </CardContent>
    </Card>
  );
}
