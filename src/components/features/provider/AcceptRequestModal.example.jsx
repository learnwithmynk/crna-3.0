/**
 * AcceptRequestModal Example Usage
 *
 * Demonstrates how to use the AcceptRequestModal component
 * in a provider booking request management page.
 */

import { useState } from 'react';
import { AcceptRequestModal } from './AcceptRequestModal';
import { Button } from '@/components/ui/button';

export function AcceptRequestModalExample() {
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
    platform_fee_cents: 1500, // 20%
    provider_payout_cents: 6000, // 80%
    requested_times: [
      '2024-12-20T14:00:00Z',
      '2024-12-21T10:00:00Z',
      '2024-12-22T15:30:00Z'
    ],
    created_at: '2024-12-13T10:00:00Z'
  };

  const handleAccept = async (selectedTime, message) => {
    console.log('Accepting request with:', {
      requestId: mockRequest.id,
      selectedTime,
      message
    });

    // TODO: Replace with actual API call
    // Example:
    // const response = await api.bookings.accept({
    //   requestId: mockRequest.id,
    //   scheduledAt: selectedTime,
    //   message
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Show success message
    alert('Request accepted! Applicant has been notified.');

    // Close modal
    setModalOpen(false);

    // Refresh data or navigate
    // navigate('/provider/bookings');
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Accept Request Modal Example</h2>

      <Button onClick={() => setModalOpen(true)}>
        Accept Request
      </Button>

      <AcceptRequestModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        request={mockRequest}
        onConfirm={handleAccept}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-medium mb-2">Mock Request Data:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(mockRequest, null, 2)}
        </pre>
      </div>
    </div>
  );
}

export default AcceptRequestModalExample;
