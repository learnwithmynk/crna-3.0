/**
 * EditServiceSheet
 *
 * Slide-out sheet for editing service details.
 * Used in ProviderServicesPage.
 *
 * Features:
 * - All service fields editable (title, description, price, duration)
 * - Deliverables checklist (add/remove items)
 * - Service type selection
 * - Live vs Async toggle
 * - Preview of how it will look to applicants
 */

import { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  GripVertical,
  Video,
  FileText,
  DollarSign,
  Clock,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SERVICE_TYPE_META, SERVICE_TYPES, SERVICE_DELIVERY } from '@/data/marketplace/mockServices';

// Duration options
const DURATION_OPTIONS = [
  { value: '15', label: '15 minutes' },
  { value: '30', label: '30 minutes' },
  { value: '45', label: '45 minutes' },
  { value: '60', label: '60 minutes' },
  { value: '90', label: '90 minutes' },
  { value: '120', label: '2 hours' }
];

// Turnaround options for async services
const TURNAROUND_OPTIONS = [
  { value: '24', label: '24 hours' },
  { value: '48', label: '48 hours' },
  { value: '72', label: '72 hours' },
  { value: '96', label: '4 days' },
  { value: '168', label: '1 week' }
];

export function EditServiceSheet({ open, onOpenChange, service, onSave, onClose }) {
  const [formData, setFormData] = useState({
    type: SERVICE_TYPES.MOCK_INTERVIEW,
    title: '',
    description: '',
    price: '',
    duration: '60',
    delivery: SERVICE_DELIVERY.LIVE,
    turnaroundHours: '48',
    deliverables: [''],
    isActive: true,
    instantBookEnabled: true
  });
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  // Initialize form when service changes
  useEffect(() => {
    if (service) {
      setFormData({
        type: service.type || SERVICE_TYPES.MOCK_INTERVIEW,
        title: service.title || '',
        description: service.description || '',
        price: service.price?.toString() || '',
        duration: service.duration?.toString() || '60',
        delivery: service.delivery || SERVICE_DELIVERY.LIVE,
        turnaroundHours: service.turnaroundHours?.toString() || '48',
        deliverables: service.deliverables?.length > 0 ? [...service.deliverables] : [''],
        isActive: service.isActive ?? true,
        instantBookEnabled: service.instantBookEnabled ?? true
      });
    } else {
      // New service - reset form
      setFormData({
        type: SERVICE_TYPES.MOCK_INTERVIEW,
        title: '',
        description: '',
        price: '',
        duration: '60',
        delivery: SERVICE_DELIVERY.LIVE,
        turnaroundHours: '48',
        deliverables: [''],
        isActive: true,
        instantBookEnabled: true
      });
    }
    setErrors({});
    setIsDirty(false);
  }, [service, open]);

  // Update field
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // Handle type change - auto-fill suggestions
  const handleTypeChange = (type) => {
    const meta = SERVICE_TYPE_META[type];
    updateField('type', type);
    updateField('delivery', meta?.delivery || SERVICE_DELIVERY.LIVE);

    // Suggest duration based on type
    if (meta?.suggestedDuration) {
      updateField('duration', meta.suggestedDuration.toString());
    }
  };

  // Add deliverable
  const addDeliverable = () => {
    setFormData(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, '']
    }));
    setIsDirty(true);
  };

  // Remove deliverable
  const removeDeliverable = (index) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
  };

  // Update deliverable
  const updateDeliverable = (index, value) => {
    setFormData(prev => ({
      ...prev,
      deliverables: prev.deliverables.map((d, i) => i === index ? value : d)
    }));
    setIsDirty(true);
  };

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description should be at least 50 characters';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Enter a valid price';
    }

    // Check deliverables - at least one non-empty
    const validDeliverables = formData.deliverables.filter(d => d.trim());
    if (validDeliverables.length === 0) {
      newErrors.deliverables = 'Add at least one deliverable';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle save
  const handleSave = () => {
    if (!validate()) return;

    const savedData = {
      ...service,
      id: service?.id || `service_${Date.now()}`,
      type: formData.type,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      duration: formData.delivery === SERVICE_DELIVERY.LIVE ? parseInt(formData.duration) : null,
      delivery: formData.delivery,
      turnaroundHours: formData.delivery === SERVICE_DELIVERY.ASYNC ? parseInt(formData.turnaroundHours) : null,
      deliverables: formData.deliverables.filter(d => d.trim()),
      isActive: formData.isActive,
      instantBookEnabled: formData.instantBookEnabled
    };

    onSave(savedData);
  };

  // Get suggested price range
  const typeMeta = SERVICE_TYPE_META[formData.type];
  const suggestedPrice = typeMeta?.suggestedPriceRange;

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Service Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Service Type</Label>
            <Select
              value={formData.type}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SERVICE_TYPE_META).map(([key, meta]) => (
                  <SelectItem key={key} value={key}>
                    <span className="flex items-center gap-2">
                      <span>{meta.icon}</span>
                      <span>{meta.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g., Full Mock Interview Experience"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              className={cn(errors.title && 'border-red-500')}
            />
            {errors.title && (
              <p className="text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what applicants will get from this service..."
              rows={4}
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={cn(errors.description && 'border-red-500')}
            />
            <div className="flex justify-between text-xs">
              {errors.description ? (
                <p className="text-red-600">{errors.description}</p>
              ) : (
                <p className="text-gray-500">Minimum 50 characters</p>
              )}
              <p className={cn(
                formData.description.length < 50 ? 'text-gray-400' : 'text-gray-500'
              )}>
                {formData.description.length} characters
              </p>
            </div>
          </div>

          {/* Delivery Type */}
          <div className="space-y-2">
            <Label>Delivery Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => updateField('delivery', SERVICE_DELIVERY.LIVE)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all text-left',
                  formData.delivery === SERVICE_DELIVERY.LIVE
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <Video className="w-5 h-5 mb-2 text-gray-600" />
                <p className="font-medium text-gray-900">Live Session</p>
                <p className="text-xs text-gray-500">Video call with applicant</p>
              </button>
              <button
                type="button"
                onClick={() => updateField('delivery', SERVICE_DELIVERY.ASYNC)}
                className={cn(
                  'p-4 rounded-xl border-2 transition-all text-left',
                  formData.delivery === SERVICE_DELIVERY.ASYNC
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                <FileText className="w-5 h-5 mb-2 text-gray-600" />
                <p className="font-medium text-gray-900">Async Review</p>
                <p className="text-xs text-gray-500">Written feedback, no call</p>
              </button>
            </div>
          </div>

          {/* Duration or Turnaround */}
          {formData.delivery === SERVICE_DELIVERY.LIVE ? (
            <div className="space-y-2">
              <Label htmlFor="duration">Session Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => updateField('duration', value)}
              >
                <SelectTrigger id="duration">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="turnaround">Turnaround Time</Label>
              <Select
                value={formData.turnaroundHours}
                onValueChange={(value) => updateField('turnaroundHours', value)}
              >
                <SelectTrigger id="turnaround">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TURNAROUND_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="price"
                type="number"
                min="0"
                step="5"
                placeholder="75"
                value={formData.price}
                onChange={(e) => updateField('price', e.target.value)}
                className={cn('pl-9', errors.price && 'border-red-500')}
              />
            </div>
            {errors.price ? (
              <p className="text-sm text-red-600">{errors.price}</p>
            ) : suggestedPrice && (
              <p className="text-xs text-gray-500">
                Suggested range: ${suggestedPrice.min} - ${suggestedPrice.max}
              </p>
            )}
          </div>

          {/* Deliverables */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Deliverables</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addDeliverable}
              >
                <Plus className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
            {errors.deliverables && (
              <p className="text-sm text-red-600">{errors.deliverables}</p>
            )}
            <div className="space-y-2">
              {formData.deliverables.map((deliverable, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-400 shrink-0" />
                  <Input
                    placeholder="What will the applicant receive?"
                    value={deliverable}
                    onChange={(e) => updateDeliverable(index, e.target.value)}
                  />
                  {formData.deliverables.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDeliverable(index)}
                      className="shrink-0"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="space-y-4 pt-4 border-t border-gray-200">
            <h3 className="font-medium text-gray-900">Settings</h3>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <Label htmlFor="active" className="cursor-pointer">Active</Label>
                <p className="text-xs text-gray-500">
                  Service is visible and bookable
                </p>
              </div>
              <Switch
                id="active"
                checked={formData.isActive}
                onCheckedChange={(checked) => updateField('isActive', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div>
                <Label htmlFor="instant-book" className="cursor-pointer">Instant Book</Label>
                <p className="text-xs text-gray-500">
                  Allow immediate booking without approval
                </p>
              </div>
              <Switch
                id="instant-book"
                checked={formData.instantBookEnabled}
                onCheckedChange={(checked) => updateField('instantBookEnabled', checked)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              {service ? 'Save Changes' : 'Create Service'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditServiceSheet;
