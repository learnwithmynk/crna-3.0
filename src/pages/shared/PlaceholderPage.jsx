/**
 * Placeholder page component
 * Used for routes that haven't been built yet
 */

import { PageWrapper, PageHeader } from '@/components/layout/page-wrapper';
import { Card, CardContent } from '@/components/ui/card';
import { Construction } from 'lucide-react';

export function PlaceholderPage({ title = 'Coming Soon' }) {
  return (
    <PageWrapper>
      <PageHeader title={title} />
      <Card>
        <CardContent className="py-12">
          <div className="text-center">
            <Construction className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Under Construction
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              This page is being built. Check back soon!
            </p>
          </div>
        </CardContent>
      </Card>
    </PageWrapper>
  );
}
