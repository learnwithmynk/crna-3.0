/**
 * QuickSnapshotScreen
 *
 * Path B condensed screen that collects ICU experience, shadow hours,
 * certifications, and GRE status in one compact view.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArrowRight, ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const ICU_TYPES = [
  { id: 'micu', label: 'Medical ICU' },
  { id: 'sicu', label: 'Surgical ICU' },
  { id: 'cvicu', label: 'Cardiovascular ICU' },
  { id: 'neuro', label: 'Neuro ICU' },
  { id: 'trauma', label: 'Trauma ICU' },
  { id: 'picu', label: 'Pediatric ICU' },
  { id: 'nicu', label: 'Neonatal ICU' },
  { id: 'mixed', label: 'Mixed/General ICU' },
];

const COMMON_CERTS = [
  { id: 'CCRN', label: 'CCRN' },
  { id: 'ACLS', label: 'ACLS' },
  { id: 'BLS', label: 'BLS' },
  { id: 'PALS', label: 'PALS' },
];

export default function QuickSnapshotScreen({ data, updateFields, onContinue }) {
  const [icuYears, setIcuYears] = useState(data.icuYears || 0);
  const [icuMonths, setIcuMonths] = useState(data.icuMonths || 0);
  const [icuType, setIcuType] = useState(data.icuType || '');
  const [shadowHours, setShadowHours] = useState(data.shadowHours || 0);
  const [certifications, setCertifications] = useState(data.certifications || []);
  const [greStatus, setGreStatus] = useState(data.greStatus || '');

  // Update parent data
  useEffect(() => {
    updateFields({
      icuYears,
      icuMonths,
      icuType,
      shadowHours,
      certifications,
      greStatus,
    });
  }, [icuYears, icuMonths, icuType, shadowHours, certifications, greStatus, updateFields]);

  // Toggle certification
  const toggleCert = (certId) => {
    setCertifications((prev) =>
      prev.includes(certId) ? prev.filter((id) => id !== certId) : [...prev, certId]
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        {/* Header */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Quick snapshot of your experience
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          This helps us match your profile to program requirements.
        </p>

        <div className="space-y-6">
          {/* ICU Experience */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              ICU Experience
            </Label>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="relative">
                <select
                  value={icuYears}
                  onChange={(e) => setIcuYears(Number(e.target.value))}
                  className="w-full h-11 px-3 pr-8 rounded-xl border border-gray-200 bg-white text-sm appearance-none cursor-pointer"
                >
                  {[...Array(11)].map((_, i) => (
                    <option key={i} value={i}>
                      {i} year{i !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={icuMonths}
                  onChange={(e) => setIcuMonths(Number(e.target.value))}
                  className="w-full h-11 px-3 pr-8 rounded-xl border border-gray-200 bg-white text-sm appearance-none cursor-pointer"
                >
                  {[...Array(12)].map((_, i) => (
                    <option key={i} value={i}>
                      {i} month{i !== 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="relative">
              <select
                value={icuType}
                onChange={(e) => setIcuType(e.target.value)}
                className="w-full h-11 px-3 pr-8 rounded-xl border border-gray-200 bg-white text-sm appearance-none cursor-pointer"
              >
                <option value="">Select ICU type...</option>
                {ICU_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Shadow Hours */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Shadow Hours
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="number"
                value={shadowHours}
                onChange={(e) => setShadowHours(Math.max(0, Number(e.target.value) || 0))}
                className="h-11 w-24 text-center"
                min={0}
                max={200}
              />
              <span className="text-sm text-gray-600">hours total</span>
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              Certifications
            </Label>
            <div className="flex flex-wrap gap-2">
              {COMMON_CERTS.map((cert) => {
                const isSelected = certifications.includes(cert.id);
                return (
                  <button
                    key={cert.id}
                    onClick={() => toggleCert(cert.id)}
                    className={cn(
                      'px-4 py-2 rounded-full text-sm font-medium transition-colors',
                      'flex items-center gap-2',
                      isSelected
                        ? 'bg-yellow-400 text-black'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                    )}
                  >
                    {isSelected && <Check className="h-3.5 w-3.5" />}
                    {cert.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* GRE Status */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <Label className="text-sm font-semibold text-gray-700 mb-3 block">
              GRE Status
            </Label>
            <div className="space-y-2">
              {[
                { id: 'taken', label: "I've taken it" },
                { id: 'planning', label: 'Planning to take it' },
                { id: 'looking_for_no_gre', label: 'Looking for no-GRE programs' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setGreStatus(option.id)}
                  className={cn(
                    'w-full px-4 py-3 rounded-xl text-sm text-left transition-colors',
                    'flex items-center gap-3',
                    greStatus === option.id
                      ? 'bg-yellow-100 border-2 border-yellow-400'
                      : 'bg-white border border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0',
                      greStatus === option.id ? 'bg-yellow-400' : 'border-2 border-gray-300'
                    )}
                  >
                    {greStatus === option.id && <Check className="h-2.5 w-2.5 text-black" />}
                  </div>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 p-4 bg-white border-t border-gray-100">
        <Button onClick={onContinue} className="w-full h-12 text-base font-semibold">
          Continue
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <p className="text-xs text-center text-gray-400 mt-2">+4 points</p>
      </div>
    </div>
  );
}
