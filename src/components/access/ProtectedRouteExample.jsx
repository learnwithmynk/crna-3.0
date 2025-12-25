/**
 * ProtectedRoute Usage Examples
 *
 * Demonstrates how to use the ProtectedRoute component for entitlement-based page protection.
 */

import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Example: Protected School Explorer page
function SchoolExplorerExample() {
  return (
    <Routes>
      <Route
        path="/schools"
        element={
          <ProtectedRoute resourceSlug="school-explorer">
            <SchoolExplorerPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Example: Protected Marketplace page
function MarketplaceExample() {
  return (
    <Routes>
      <Route
        path="/marketplace"
        element={
          <ProtectedRoute resourceSlug="marketplace">
            <MarketplacePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Example: Optional auth (public page with premium features)
function OptionalAuthExample() {
  return (
    <Routes>
      <Route
        path="/resources"
        element={
          <ProtectedRoute
            resourceSlug="premium-resources"
            requireAuth={false}
          >
            <ResourcesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Example: Nested routes with protection
function NestedRoutesExample() {
  return (
    <Routes>
      <Route
        path="/learning/*"
        element={
          <ProtectedRoute resourceSlug="learning-modules">
            <Routes>
              <Route path="/" element={<LearningDashboard />} />
              <Route path="/module/:id" element={<ModulePage />} />
              <Route path="/downloads" element={<DownloadsPage />} />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

// Mock page components for examples
function SchoolExplorerPage() {
  return <div>School Explorer Page Content</div>;
}

function MarketplacePage() {
  return <div>Marketplace Page Content</div>;
}

function ResourcesPage() {
  return <div>Resources Page Content</div>;
}

function LearningDashboard() {
  return <div>Learning Dashboard</div>;
}

function ModulePage() {
  return <div>Module Page</div>;
}

function DownloadsPage() {
  return <div>Downloads Page</div>;
}

export default function ProtectedRouteExamples() {
  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-4">ProtectedRoute Examples</h1>
      <p className="text-gray-600 mb-8">
        See the source code for usage patterns.
      </p>

      <div className="space-y-6">
        <section className="p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Basic Usage</h2>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`<ProtectedRoute resourceSlug="school-explorer">
  <SchoolExplorerPage />
</ProtectedRoute>`}
          </pre>
        </section>

        <section className="p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Optional Authentication</h2>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`<ProtectedRoute
  resourceSlug="premium-resources"
  requireAuth={false}
>
  <ResourcesPage />
</ProtectedRoute>`}
          </pre>
        </section>

        <section className="p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Nested Routes</h2>
          <pre className="bg-gray-50 p-4 rounded text-sm overflow-x-auto">
{`<Route
  path="/learning/*"
  element={
    <ProtectedRoute resourceSlug="learning-modules">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/module/:id" element={<Module />} />
      </Routes>
    </ProtectedRoute>
  }
/>`}
          </pre>
        </section>

        <section className="p-6 border border-gray-200 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Deny Behaviors</h2>
          <p className="text-sm text-gray-600 mb-4">
            The component automatically handles deny behaviors from the protected_resources table:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>redirect</strong> - Redirects to /upgrade</li>
            <li><strong>upgrade_prompt</strong> - Shows UpgradeCard component</li>
            <li><strong>blur</strong> - Shows blurred content with overlay</li>
            <li><strong>hide</strong> - Redirects to /upgrade (default)</li>
          </ul>
        </section>

        <section className="p-6 border border-gray-200 rounded-lg bg-blue-50">
          <h2 className="text-xl font-bold mb-2">Key Differences</h2>
          <p className="text-sm mb-4">
            This component is different from <code>/src/components/auth/ProtectedRoute.jsx</code>:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li><strong>Auth ProtectedRoute</strong> - Only checks if user is logged in</li>
            <li><strong>Access ProtectedRoute</strong> - Checks authentication + entitlements</li>
            <li><strong>Use this when</strong> - Page requires specific membership/subscription</li>
            <li><strong>Use auth version when</strong> - Page only requires login (any user)</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
