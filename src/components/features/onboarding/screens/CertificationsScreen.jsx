/**
 * CertificationsScreen
 *
 * Collects certification data with pill toggles.
 * Part of Path A (Foundation Building) flow.
 */

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import EducationalInsightCard from '../EducationalInsightCard';
import { getCertificationContext } from '@/lib/onboarding/getEducationalContext';

const CERTIFICATIONS = [
  { id: 'CCRN', label: 'CCRN', description: 'Critical Care Registered Nurse', primary: true },
  { id: 'ACLS', label: 'ACLS', description: 'Advanced Cardiac Life Support' },
  { id: 'BLS', label: 'BLS', description: 'Basic Life Support' },
  { id: 'PALS', label: 'PALS', description: 'Pediatric Advanced Life Support' },
  { id: 'NRP', label: 'NRP', description: 'Neonatal Resuscitation Program' },
  { id: 'TNCC', label: 'TNCC', description: 'Trauma Nursing Core Course' },
  { id: 'CSC', label: 'CSC', description: 'Cardiac Surgery Certification' },
  { id: 'CMC', label: 'CMC', description: 'Cardiac Medicine Certification' },
];

export default function CertificationsScreen({ data, updateField, onContinue }) {
  const [selected, setSelected] = useState(data.certifications || []);
  const [showInsight, setShowInsight] = useState(false);

  // Update parent data
  useEffect(() => {
    updateField('certifications', selected);
  }, [selected, updateField]);

  // Show insight after selection changes
  useEffect(() => {
    const timer = setTimeout(() => setShowInsight(true), 300);
    return () => clearTimeout(timer);
  }, [selected.length]);

  // Toggle certification
  const toggleCert = (certId) => {
    setSelected((prev) =>
      prev.includes(certId)
        ? prev.filter((id) => id !== certId)
        : [...prev, certId]
    );
  };

  // Get context
  const context = useMemo(
    () => getCertificationContext(selected),
    [selected]
  );

  const hasCcrn = selected.includes('CCRN');

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6">
        {/* Question */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          What certifications do you have?
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          Select all that apply. CCRN is the most important one.
        </p>

        {/* Certification pills */}
        <div className="space-y-3">
          {/* CCRN highlighted separately */}
          <div>
            <button
              onClick={() => toggleCert('CCRN')}
              className={cn(
                'w-full p-4 rounded-2xl border-2 transition-all duration-200',
                'flex items-center gap-3 text-left',
                'min-h-[64px]',
                hasCcrn
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-gray-200 hover:border-gray-300'
              )}
            >
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0',
                  hasCcrn ? 'bg-yellow-400' : 'border-2 border-gray-300'
                )}
              >
                {hasCcrn && <Check className="h-4 w-4 text-black" />}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">CCRN</div>
                <div className="text-sm text-gray-500">
                  Critical Care Registered Nurse
                </div>
              </div>
              {!hasCcrn && (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Most Important
                </span>
              )}
            </button>
          </div>

          {/* Other certifications as pills */}
          <div className="flex flex-wrap gap-2">
            {CERTIFICATIONS.filter((cert) => cert.id !== 'CCRN').map((cert) => {
              const isSelected = selected.includes(cert.id);
              return (
                <button
                  key={cert.id}
                  onClick={() => toggleCert(cert.id)}
                  className={cn(
                    'px-4 py-3 rounded-2xl border-2 transition-all duration-200',
                    'flex items-center gap-2',
                    'min-h-[48px]',
                    isSelected
                      ? 'border-yellow-400 bg-yellow-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0',
                      isSelected ? 'bg-yellow-400' : 'border-2 border-gray-300'
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3 text-black" />}
                  </div>
                  <span className={cn('font-medium', isSelected ? 'text-gray-900' : 'text-gray-600')}>
                    {cert.label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* None option */}
          <button
            onClick={() => setSelected([])}
            className={cn(
              'w-full p-3 rounded-2xl border-2 transition-all duration-200',
              'text-center text-sm',
              selected.length === 0
                ? 'border-gray-400 bg-gray-50 text-gray-700'
                : 'border-gray-200 text-gray-500 hover:border-gray-300'
            )}
          >
            I don't have any certifications yet
          </button>
        </div>

        {/* Educational insight */}
        <div className="mt-6">
          <EducationalInsightCard
            title={hasCcrn ? context.encouragement : 'About certifications'}
            message={context.educational}
            show={showInsight}
            variant={hasCcrn ? 'positive' : 'default'}
          />
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button onClick={onContinue} className="w-full h-12 text-base font-semibold">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">
          {selected.length > 0 ? '+4 points' : '+2 points'}
        </p>
      </div>
    </div>
  );
}
