/**
 * LMS Hooks Test Page
 *
 * Tests all LMS hooks to verify they work correctly with Supabase.
 * Access at /lms-test in development mode.
 */

import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

// Import all LMS hooks
import { useModules } from '@/hooks/useModules';
import { useLessons } from '@/hooks/useLessons';
import { useDownloads } from '@/hooks/useDownloads';
import { useCategories } from '@/hooks/useCategories';
import { useEntitlements } from '@/hooks/useEntitlements';
import { useImageUpload } from '@/hooks/useImageUpload';
import { BlockEditor } from '@/components/features/lms/BlockEditor';
import { EditorRenderer } from '@/components/features/lms/EditorRenderer';

function TestResult({ name, status, data, error }) {
  const statusIcon = {
    loading: <Loader2 className="w-4 h-4 animate-spin text-gray-500" />,
    success: <CheckCircle className="w-4 h-4 text-green-500" />,
    error: <XCircle className="w-4 h-4 text-red-500" />,
  };

  return (
    <div
      className="flex items-start gap-3 p-3 border rounded-xl"
      data-testid={`test-${name}`}
      data-status={status}
    >
      <div className="mt-0.5">{statusIcon[status]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium">{name}</span>
          <Badge variant={status === 'success' ? 'default' : status === 'error' ? 'destructive' : 'secondary'}>
            {status}
          </Badge>
        </div>
        {status === 'success' && data !== undefined && (
          <pre className="mt-2 text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        {status === 'error' && error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}

export default function LmsTestPage() {
  const [testResults, setTestResults] = useState({});

  // Test useModules
  const { modules, isLoading: modulesLoading, error: modulesError } = useModules();

  // Test useCategories
  const { categories, isLoading: categoriesLoading, error: categoriesError } = useCategories();

  // Test useEntitlements
  const { entitlements, isLoading: entitlementsLoading, error: entitlementsError } = useEntitlements();

  // Test useDownloads
  const { downloads, isLoading: downloadsLoading, error: downloadsError } = useDownloads();

  // Test useImageUpload (just check it initializes)
  const imageUpload = useImageUpload();

  // Update test results as hooks complete
  useEffect(() => {
    setTestResults(prev => ({
      ...prev,
      useModules: {
        status: modulesLoading ? 'loading' : modulesError ? 'error' : 'success',
        data: modulesLoading ? null : { count: modules.length, sample: modules[0] },
        error: modulesError,
      }
    }));
  }, [modules, modulesLoading, modulesError]);

  useEffect(() => {
    setTestResults(prev => ({
      ...prev,
      useCategories: {
        status: categoriesLoading ? 'loading' : categoriesError ? 'error' : 'success',
        data: categoriesLoading ? null : { count: categories.length, items: categories.map(c => c.slug) },
        error: categoriesError,
      }
    }));
  }, [categories, categoriesLoading, categoriesError]);

  useEffect(() => {
    setTestResults(prev => ({
      ...prev,
      useEntitlements: {
        status: entitlementsLoading ? 'loading' : entitlementsError ? 'error' : 'success',
        data: entitlementsLoading ? null : { count: entitlements.length, items: entitlements.map(e => e.slug) },
        error: entitlementsError,
      }
    }));
  }, [entitlements, entitlementsLoading, entitlementsError]);

  useEffect(() => {
    setTestResults(prev => ({
      ...prev,
      useDownloads: {
        status: downloadsLoading ? 'loading' : downloadsError ? 'error' : 'success',
        data: downloadsLoading ? null : { count: downloads.length },
        error: downloadsError,
      }
    }));
  }, [downloads, downloadsLoading, downloadsError]);

  // Test useImageUpload initialization
  useEffect(() => {
    setTestResults(prev => ({
      ...prev,
      useImageUpload: {
        status: imageUpload.upload ? 'success' : 'error',
        data: {
          hasUpload: !!imageUpload.upload,
          bucketName: imageUpload.bucketName,
          maxFileSize: imageUpload.maxFileSize,
        },
        error: null,
      }
    }));
  }, [imageUpload]);

  const allTests = ['useModules', 'useCategories', 'useEntitlements', 'useDownloads', 'useImageUpload'];
  const completedTests = allTests.filter(t => testResults[t]?.status !== 'loading');
  const passedTests = allTests.filter(t => testResults[t]?.status === 'success');
  const failedTests = allTests.filter(t => testResults[t]?.status === 'error');

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">LMS Hooks Test</h1>
          <p className="text-gray-600">Verifying Supabase integration</p>
        </div>

        {/* Summary */}
        <Card data-testid="test-summary">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Test Summary</span>
              <div className="flex gap-2">
                <Badge variant="secondary">{completedTests.length}/{allTests.length} complete</Badge>
                <Badge variant="default" data-testid="passed-count">{passedTests.length} passed</Badge>
                {failedTests.length > 0 && (
                  <Badge variant="destructive" data-testid="failed-count">{failedTests.length} failed</Badge>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {allTests.map(testName => (
              <TestResult
                key={testName}
                name={testName}
                status={testResults[testName]?.status || 'loading'}
                data={testResults[testName]?.data}
                error={testResults[testName]?.error}
              />
            ))}
          </CardContent>
        </Card>

        {/* BlockEditor Test */}
        <Card>
          <CardHeader>
            <CardTitle>BlockEditor Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div data-testid="block-editor-container" className="border rounded-xl overflow-hidden">
              <BlockEditor
                initialData={{
                  blocks: [
                    {
                      id: 'test-header',
                      type: 'header',
                      data: { text: 'Test Lesson Title', level: 2 }
                    },
                    {
                      id: 'test-paragraph',
                      type: 'paragraph',
                      data: { text: 'This is a test paragraph to verify Editor.js loads correctly.' }
                    }
                  ]
                }}
                onSave={(data) => console.log('Editor saved:', data)}
                autosave={false}
                placeholder="Start typing your lesson content..."
              />
            </div>
            <div className="mt-4">
              <h4 className="font-medium mb-2">EditorRenderer Preview</h4>
              <div data-testid="editor-renderer-container" className="border rounded-xl p-4 bg-white">
                <EditorRenderer
                  data={{
                    blocks: [
                      { id: '1', type: 'header', data: { text: 'Sample Rendered Content', level: 2 } },
                      { id: '2', type: 'paragraph', data: { text: 'This content is rendered using EditorRenderer.' } },
                      { id: '3', type: 'list', data: { style: 'unordered', items: ['Item one', 'Item two', 'Item three'] } }
                    ]
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Raw Data Debug */}
        <Card>
          <CardHeader>
            <CardTitle>Raw Hook Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">Categories ({categories.length})</h4>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40" data-testid="categories-data">
                  {JSON.stringify(categories, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-1">Entitlements ({entitlements.length})</h4>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40" data-testid="entitlements-data">
                  {JSON.stringify(entitlements, null, 2)}
                </pre>
              </div>
              <div>
                <h4 className="font-medium mb-1">Modules ({modules.length})</h4>
                <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-40" data-testid="modules-data">
                  {JSON.stringify(modules, null, 2)}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
