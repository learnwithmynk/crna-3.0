/**
 * ProposeAlternativeModal Example Usage
 *
 * Demonstrates how to use the ProposeAlternativeModal component
 * in a provider booking request management page.
 */

import { useState } from 'react';
import { ProposeAlternativeModal } from './ProposeAlternativeModal';
import { Button } from '@/components/ui/button';

export function ProposeAlternativeModalExample() {
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
      '2024-12-21T10:00:00Z',
      '2024-12-22T15:30:00Z'
    ],
    created_at: '2024-12-13T10:00:00Z'
  };

  const handleProposeAlternatives = async (proposedTimes, message) => {
    console.log('Proposing alternative times:', {
      requestId: mockRequest.id,
      proposedTimes,
      message
    });

    // TODO: Replace with actual API call
    // Example:
    // const response = await api.bookings.proposeAlternatives({
    //   requestId: mockRequest.id,
    //   proposedTimes, // Array of ISO datetime strings
    //   message
    // });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Show success message
    alert(`Alternative times proposed! Applicant will be notified with ${proposedTimes.length} options.`);

    // Close modal
    setModalOpen(false);

    // Update request status or refresh data
    // onAlternativesProposed(mockRequest.id);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Propose Alternative Modal Example</h2>

      <Button onClick={() => setModalOpen(true)}>
        Propose Alternative Times
      </Button>

      <ProposeAlternativeModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        request={mockRequest}
        onConfirm={handleProposeAlternatives}
      />

      <div className="mt-6 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-medium mb-2">Mock Request Data:</h3>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(mockRequest, null, 2)}
        </pre>
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-xl">
        <h3 className="font-medium mb-2">How It Works:</h3>
        <ul className="text-sm space-y-1">
          <li>1. Provider can select up to 3 alternative times</li>
          <li>2. Times must be at least 1 hour in the future</li>
          <li>3. Provider can add a message explaining why original times don't work</li>
          <li>4. Applicant receives notification and can accept/decline proposed times</li>
          <li>5. If applicant accepts, booking is confirmed; if declined, request closes</li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-yellow-50 rounded-xl">
        <h3 className="font-medium mb-2">Notes:</h3>
        <ul className="text-sm space-y-1">
          <li>• Uses native datetime-local input for date/time selection</li>
          <li>• Times are converted to ISO strings for API</li>
          <li>• Provider can add/remove times before submitting</li>
          <li>• Validation ensures times are in the future</li>
        </ul>
      </div>
    </div>
  );
}

export default ProposeAlternativeModalExample;
