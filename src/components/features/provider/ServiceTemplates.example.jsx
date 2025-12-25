/**
 * ServiceTemplates Usage Examples
 *
 * This file demonstrates how to use the ServiceTemplates component
 * in different contexts within the provider onboarding and service editing flows.
 */

import { useState } from 'react';
import { ServiceTemplates } from './ServiceTemplates';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Example 1: Service-Specific Template (during service creation)
export function ServiceCreationExample() {
  const [description, setDescription] = useState('');
  const serviceType = 'mock_interview'; // Would come from service type selection

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-bold">Create Your Service</h2>

      {/* Service Type Selection would be here */}

      {/* Service Description Section */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="description">Service Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what applicants can expect from this service..."
            rows={6}
            className="mt-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            {description.length}/500 characters
          </p>
        </div>

        {/* Templates - Only show for this specific service type */}
        <ServiceTemplates
          serviceType={serviceType}
          onSelectTemplate={setDescription}
          currentDescription={description}
        />
      </div>
    </div>
  );
}

// Example 2: All Templates View (during initial onboarding)
export function OnboardingTemplatesExample() {
  const [descriptions, setDescriptions] = useState({
    mock_interview: '',
    essay_review: '',
    coaching: '',
    qa_call: '',
  });

  const [currentService, setCurrentService] = useState('mock_interview');

  const handleSelectTemplate = (templateText) => {
    setDescriptions((prev) => ({
      ...prev,
      [currentService]: templateText,
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Set Up Your Services</h2>
        <p className="text-gray-600 mt-1">
          Choose which services you'd like to offer. Use our templates to get started quickly.
        </p>
      </div>

      {/* Service Tabs/Selection */}
      <div className="flex gap-2 border-b border-gray-200 pb-2">
        {Object.keys(descriptions).map((serviceType) => (
          <button
            key={serviceType}
            onClick={() => setCurrentService(serviceType)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              currentService === serviceType
                ? 'bg-white border-t border-l border-r border-gray-200 text-black'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {serviceType.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Current Service Editor */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="current-description">Description</Label>
              <Textarea
                id="current-description"
                value={descriptions[currentService]}
                onChange={(e) =>
                  setDescriptions((prev) => ({
                    ...prev,
                    [currentService]: e.target.value,
                  }))
                }
                placeholder="Describe what applicants can expect..."
                rows={6}
                className="mt-2"
              />
            </div>

            {/* Show template for current service */}
            <ServiceTemplates
              serviceType={currentService}
              onSelectTemplate={handleSelectTemplate}
              currentDescription={descriptions[currentService]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Example 3: All Templates at Once (template library view)
export function TemplateLibraryExample() {
  const [selectedDescription, setSelectedDescription] = useState('');

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Template Library</h2>
        <p className="text-gray-600 mt-1">
          Browse all available templates for service descriptions.
        </p>
      </div>

      {/* Show all templates without serviceType filter */}
      <ServiceTemplates
        onSelectTemplate={setSelectedDescription}
        currentDescription={selectedDescription}
      />

      {/* Preview of selected description */}
      {selectedDescription && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Selected Template</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{selectedDescription}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Example 4: Integration with Form (realistic usage)
export function ServiceFormWithTemplatesExample() {
  const [formData, setFormData] = useState({
    serviceType: 'mock_interview',
    title: '',
    description: '',
    duration: '60',
    price: '',
  });

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form className="space-y-6">
        {/* Other form fields */}
        <div>
          <Label htmlFor="title">Service Title</Label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => updateField('title', e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-xl"
            placeholder="e.g., CRNA Program Mock Interview"
          />
        </div>

        {/* Description with Templates */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="What will applicants get from this service?"
              rows={8}
              className="mt-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 • Be specific about what you'll cover
            </p>
          </div>

          {/* Collapsible Templates Section */}
          <details className="group">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center gap-2">
              <span>Need help writing your description?</span>
              <span className="text-xs text-gray-500">(Click for templates)</span>
            </summary>
            <div className="mt-4">
              <ServiceTemplates
                serviceType={formData.serviceType}
                onSelectTemplate={(text) => updateField('description', text)}
                currentDescription={formData.description}
              />
            </div>
          </details>
        </div>

        {/* Other form fields */}
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <input
              id="duration"
              type="number"
              value={formData.duration}
              onChange={(e) => updateField('duration', e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-xl"
            />
          </div>
          <div className="flex-1">
            <Label htmlFor="price">Price ($)</Label>
            <input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => updateField('price', e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-xl"
              placeholder="75"
            />
          </div>
        </div>
      </form>
    </div>
  );
}
