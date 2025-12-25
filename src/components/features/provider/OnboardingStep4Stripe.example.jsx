/**
 * OnboardingStep4Stripe - Example Usage
 *
 * Demonstrates the three possible states:
 * 1. Not connected - Initial state
 * 2. Pending - Stripe setup started but not completed
 * 3. Connected - Fully set up and ready
 */

import { useState } from 'react';
import { OnboardingStep4Stripe } from './OnboardingStep4Stripe';

export default function OnboardingStep4StripeExample() {
  const [state, setState] = useState('not_connected'); // 'not_connected', 'pending', 'connected'
  const [data, setData] = useState({
    stripeConnected: false,
    stripePending: false,
    bankLastFour: null,
  });

  const handleConnectStripe = () => {
    // Simulate Stripe Connect flow
    console.log('Opening Stripe Connect flow...');

    // For demo purposes, cycle through states
    if (state === 'not_connected') {
      setState('pending');
      setData({
        stripeConnected: false,
        stripePending: true,
        bankLastFour: null,
      });
    } else if (state === 'pending') {
      setState('connected');
      setData({
        stripeConnected: true,
        stripePending: false,
        bankLastFour: '4242',
      });
    }

    // In production, this would:
    // 1. Call backend API to create Stripe Connect account link
    // 2. Open Stripe Connect OAuth flow in new window/redirect
    // 3. Handle callback with account_id
    // 4. Update data with connection status
  };

  const handleNext = () => {
    console.log('Proceeding to next step with data:', data);
  };

  const handleBack = () => {
    console.log('Going back to previous step');
  };

  const handleChange = (updates) => {
    setData({ ...data, ...updates });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Demo Controls */}
        <div className="bg-white rounded-xl p-4 border-2 border-gray-300">
          <h3 className="font-semibold text-sm text-gray-900 mb-3">Demo Controls</h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => {
                setState('not_connected');
                setData({ stripeConnected: false, stripePending: false, bankLastFour: null });
              }}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                state === 'not_connected'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Not Connected
            </button>
            <button
              onClick={() => {
                setState('pending');
                setData({ stripeConnected: false, stripePending: true, bankLastFour: null });
              }}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                state === 'pending'
                  ? 'bg-yellow-500 text-black'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => {
                setState('connected');
                setData({ stripeConnected: true, stripePending: false, bankLastFour: '4242' });
              }}
              className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                state === 'connected'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Connected
            </button>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            <p>Current state: <span className="font-mono font-semibold">{state}</span></p>
            <p className="mt-1">Data: <span className="font-mono">{JSON.stringify(data)}</span></p>
          </div>
        </div>

        {/* Component */}
        <OnboardingStep4Stripe
          data={data}
          onChange={handleChange}
          onNext={handleNext}
          onBack={handleBack}
          onConnectStripe={handleConnectStripe}
        />
      </div>
    </div>
  );
}
