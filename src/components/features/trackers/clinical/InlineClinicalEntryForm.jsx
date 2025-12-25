/**
 * InlineClinicalEntryForm Component
 *
 * Inline (non-modal) form for logging clinical shift entries.
 * Expands in place when user clicks "Log Shift" button.
 * Includes: date, patient populations, medications, devices, procedures,
 * disease processes + notes.
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Plus, X, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

// Data
import {
  PATIENT_POPULATIONS,
  MEDICATIONS,
  DEVICES,
  PROCEDURES,
} from '@/data/clinicalCategories';

/**
 * Simple tag button (clean pill design)
 */
function TagButton({ item, selected, onToggle }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(item.value)}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm border transition-all duration-200',
        'hover:shadow-sm',
        selected
          ? 'bg-teal-50 border-teal-300 text-teal-900 font-medium'
          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
      )}
    >
      {item.label}
    </button>
  );
}

/**
 * Section with tags and "Add new..." input
 */
function TagSection({ title, items, selectedItems, onToggle, customItems = [], onAddCustom, addNewPlaceholder }) {
  const [newItemValue, setNewItemValue] = useState('');

  const handleAddNew = () => {
    if (newItemValue.trim()) {
      onAddCustom(newItemValue.trim());
      setNewItemValue('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddNew();
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <TagButton
            key={item.value}
            item={item}
            selected={selectedItems.includes(item.value) ||
                     selectedItems.some(s => typeof s === 'object' &&
                       (s.medicationId === item.value || s.deviceId === item.value || s.procedureId === item.value))}
            onToggle={onToggle}
          />
        ))}
        {/* Custom items added by user */}
        {customItems.map((customItem) => (
          <TagButton
            key={`custom-${customItem}`}
            item={{ value: customItem, label: customItem }}
            selected={true}
            onToggle={() => onToggle(customItem, true)}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder={addNewPlaceholder}
          value={newItemValue}
          onChange={(e) => setNewItemValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="text-sm bg-gray-50/50 border-gray-200 flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddNew}
          disabled={!newItemValue.trim()}
          className="shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

/**
 * Main InlineClinicalEntryForm component
 */
export function InlineClinicalEntryForm({ onSubmit, onCancel, initialValues }) {
  const isEditing = !!initialValues;

  // Form state
  const [formData, setFormData] = useState({
    shiftDate: '',
    patientPopulations: [],
    medications: [],
    devices: [],
    procedures: [],
    notes: '',
  });

  // Custom items added by user (not in predefined lists)
  const [customPopulations, setCustomPopulations] = useState([]);
  const [customMedications, setCustomMedications] = useState([]);
  const [customDevices, setCustomDevices] = useState([]);
  const [customProcedures, setCustomProcedures] = useState([]);

  // Initialize form when mounted or initialValues change
  useEffect(() => {
    if (initialValues) {
      setFormData({
        shiftDate: initialValues.shiftDate || '',
        patientPopulations: initialValues.patientPopulations || [],
        medications: initialValues.medications || [],
        devices: initialValues.devices || [],
        procedures: initialValues.procedures || [],
        notes: initialValues.notes || '',
      });
      setCustomPopulations(initialValues.customPopulations || []);
      setCustomMedications(initialValues.customMedications || []);
      setCustomDevices(initialValues.customDevices || []);
      setCustomProcedures(initialValues.customProcedures || []);
    } else {
      // Reset to defaults for new entry
      setFormData({
        shiftDate: new Date().toISOString().split('T')[0],
        patientPopulations: [],
        medications: [],
        devices: [],
        procedures: [],
        notes: '',
      });
      setCustomPopulations([]);
      setCustomMedications([]);
      setCustomDevices([]);
      setCustomProcedures([]);
    }
  }, [initialValues]);

  // Toggle helpers
  const togglePopulation = (value, isCustom = false) => {
    if (isCustom) {
      setCustomPopulations((prev) => prev.filter((p) => p !== value));
    } else {
      setFormData((prev) => ({
        ...prev,
        patientPopulations: prev.patientPopulations.includes(value)
          ? prev.patientPopulations.filter((p) => p !== value)
          : [...prev.patientPopulations, value],
      }));
    }
  };

  const toggleMedication = (medicationId, isCustom = false) => {
    if (isCustom) {
      setCustomMedications((prev) => prev.filter((m) => m !== medicationId));
    } else {
      setFormData((prev) => {
        const exists = prev.medications.find((m) => m.medicationId === medicationId);
        if (exists) {
          return {
            ...prev,
            medications: prev.medications.filter((m) => m.medicationId !== medicationId),
          };
        }
        return {
          ...prev,
          medications: [...prev.medications, { medicationId }],
        };
      });
    }
  };

  const toggleDevice = (deviceId, isCustom = false) => {
    if (isCustom) {
      setCustomDevices((prev) => prev.filter((d) => d !== deviceId));
    } else {
      setFormData((prev) => {
        const exists = prev.devices.find((d) => d.deviceId === deviceId);
        if (exists) {
          return {
            ...prev,
            devices: prev.devices.filter((d) => d.deviceId !== deviceId),
          };
        }
        return {
          ...prev,
          devices: [...prev.devices, { deviceId }],
        };
      });
    }
  };

  const toggleProcedure = (procedureId, isCustom = false) => {
    if (isCustom) {
      setCustomProcedures((prev) => prev.filter((p) => p !== procedureId));
    } else {
      setFormData((prev) => {
        const exists = prev.procedures.find((p) => p.procedureId === procedureId);
        if (exists) {
          return {
            ...prev,
            procedures: prev.procedures.filter((p) => p.procedureId !== procedureId),
          };
        }
        return {
          ...prev,
          procedures: [...prev.procedures, { procedureId }],
        };
      });
    }
  };

  // Add custom item handlers
  const addCustomPopulation = (value) => {
    if (!customPopulations.includes(value)) {
      setCustomPopulations((prev) => [...prev, value]);
    }
  };

  const addCustomMedication = (value) => {
    if (!customMedications.includes(value)) {
      setCustomMedications((prev) => [...prev, value]);
    }
  };

  const addCustomDevice = (value) => {
    if (!customDevices.includes(value)) {
      setCustomDevices((prev) => [...prev, value]);
    }
  };

  const addCustomProcedure = (value) => {
    if (!customProcedures.includes(value)) {
      setCustomProcedures((prev) => [...prev, value]);
    }
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      customPopulations,
      customMedications,
      customDevices,
      customProcedures,
    });
  };

  return (
    <Card className="p-6 bg-white/90 backdrop-blur-sm rounded-3xl border border-teal-100 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-200 to-teal-100 flex items-center justify-center">
            <Heart className="w-5 h-5 text-teal-700" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">
            {isEditing ? 'Edit Clinical Entry' : 'Log Clinical Shift'}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Date */}
        <div>
          <Label htmlFor="shiftDate">
            Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="shiftDate"
            type="date"
            value={formData.shiftDate}
            onChange={(e) =>
              setFormData({ ...formData, shiftDate: e.target.value })
            }
            required
            className="mt-1 max-w-xs"
          />
        </div>

        {/* Tag Sections - 2 column grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Population */}
          <TagSection
            title="Patient Population"
            items={PATIENT_POPULATIONS}
            selectedItems={formData.patientPopulations}
            onToggle={togglePopulation}
            customItems={customPopulations}
            onAddCustom={addCustomPopulation}
            addNewPlaceholder="Add new patient population..."
          />

          {/* Infusions/Medications */}
          <TagSection
            title="Infusions/Medications"
            items={MEDICATIONS.slice(0, 14)}
            selectedItems={formData.medications}
            onToggle={toggleMedication}
            customItems={customMedications}
            onAddCustom={addCustomMedication}
            addNewPlaceholder="Add new infusions/medications..."
          />

          {/* LifeSaving Devices + Monitors */}
          <TagSection
            title="LifeSaving Devices + Monitors"
            items={DEVICES.slice(0, 13)}
            selectedItems={formData.devices}
            onToggle={toggleDevice}
            customItems={customDevices}
            onAddCustom={addCustomDevice}
            addNewPlaceholder="Add new device..."
          />

          {/* Bedside Procedures */}
          <TagSection
            title="Bedside Procedures"
            items={PROCEDURES.slice(0, 16)}
            selectedItems={formData.procedures}
            onToggle={toggleProcedure}
            customItems={customProcedures}
            onAddCustom={addCustomProcedure}
            addNewPlaceholder="Add new procedure..."
          />
        </div>

        {/* Disease Processes + Notes */}
        <div>
          <Label htmlFor="notes">
            Disease Processes + Notes <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="notes"
            rows={4}
            placeholder="What disease processes did you manage? Any learning moments or complex cases?"
            value={formData.notes}
            onChange={(e) =>
              setFormData({ ...formData, notes: e.target.value })
            }
            required
            className="w-full px-4 py-3 border border-gray-200 bg-gray-50 rounded-2xl focus:outline-none focus:bg-white focus:border-teal-400/40 focus:shadow-[0_0_0_3px_rgba(109,213,192,0.15),0_0_12px_rgba(109,213,192,0.1)] outline-none text-sm mt-1 placeholder:text-gray-400"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <div className="flex flex-col items-center gap-1">
            <Button
              type="submit"
              className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
            >
              {isEditing ? 'Save Changes' : 'Log Entry'}
            </Button>
            {!isEditing && <span className="text-xs text-teal-600 font-medium">+5 pts</span>}
          </div>
        </div>
      </form>
    </Card>
  );
}

export default InlineClinicalEntryForm;
