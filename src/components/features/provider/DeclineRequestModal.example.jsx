/**
 * DeclineRequestModal Example Usage
 *
 * Demonstrates how to use the DeclineRequestModal component
 * in a provider booking request management page.
 */

import { useState } from 'react';
import { DeclineRequestModal } from './DeclineRequestModal';
import { Button } from '@/components/ui/button';

export function DeclineRequestModalExample() {
  const [modalOpen, setModalOpen] = useState(false);

  // Mock booking request data
  const mockRequest = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    status: 'pending',
    applicantSnapshot: {
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com'
    },
    serviceSnapshot: {
      title: 'Mock Interview - Traditional Panel',
      duration: 60,
      price_cents: 7500
    },
    amount_cents: 7500,
    platform_fee_cents: 1500,
    provider_payout_cents: 6000,
    requested_times: [
      '2024-12-20T14:00:00Z',
      '2024-12-21T10:00:00Z'
    ],
    created_at: '2024-12-13T10:00:00Z'
  };

  const handleDecline = async (reason, message) => {
    console.log('Declining request with:', {
      requestId: mockRequest.id,
      reason,
      message
    });

    // TODO: Replace with actual API call
    // Example:
    // const response = await api.bookings.decline({
    //   requestId: mockRequest.id,
    //   reason,
    //   message
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Show success message
    alert('Request declined. Applicant has been notified.');

    // Close modal
    setModalOpen(false);

    // Refresh data or remove from list
    // onRequestDeclined(mockRequest.id);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Decline Request Modal Example</h2>

      <Button variant="destructive" onClick={() => setModalOpen(true)}>
        Decline Request
      </Button>

      <DeclineRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        request={mockRequest}
        onConfirm={handleDecline}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-medium mb-2">Mock Request Data:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(mockRequest, null, 2)}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-xl">
        <h3 className="font-medium mb-2">Decline Reasons:</h3>
        <ul className="text-sm space-y-1">
          <li>• schedule_conflict - Schedule conflict</li>
          <li>• not_taking_clients - Not taking new clients</li>
          <li>• outside_expertise - Outside my expertise</li>
          <li>• other - Other</li>
        </ul>
      </div>
    </div>
  );
}

export default DeclineRequestModalExample;
