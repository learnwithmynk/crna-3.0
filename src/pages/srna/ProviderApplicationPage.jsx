/**
 * ProviderApplicationPage
 *
 * 5-step wizard for SRNAs to apply to become mentors.
 * Steps: Eligibility → Basic Info → Program → Services → Terms
 * Route: /marketplace/provider/apply
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  GraduationCap,
  User,
  Briefcase,
  FileText,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ApplicationStepIndicator } from '@/components/features/provider/ApplicationStepIndicator';
import { PhotoUpload } from '@/components/features/provider/PhotoUpload';
import { StudentIdUpload } from '@/components/features/provider/StudentIdUpload';
import { cn } from '@/lib/utils';

// US States for license dropdown
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'District of Columbia'
];

// Sample CRNA programs (would come from API)
const CRNA_PROGRAMS = [
  'Columbia University',
  'Duke University',
  'Georgetown University',
  'Johns Hopkins University',
  'Mayo Clinic',
  'Northwestern University',
  'Rush University',
  'University of Michigan',
  'University of Pennsylvania',
  'Virginia Commonwealth University',
  // ... more programs
].sort();

// ICU Types
const ICU_TYPES = [
  'Medical ICU (MICU)',
  'Surgical ICU (SICU)',
  'Cardiac ICU (CICU/CVICU)',
  'Neuro ICU',
  'Trauma ICU',
  'Pediatric ICU (PICU)',
  'Neonatal ICU (NICU)',
  'Mixed ICU',
  'Other'
];

// Services offered
const SERVICES = [
  { id: 'mock_interview', label: 'Mock Interviews', description: 'Practice interview sessions with feedback' },
  { id: 'essay_review', label: 'Essay/Personal Statement Review', description: 'Detailed feedback on written materials' },
  { id: 'coaching', label: '1:1 Coaching', description: 'Strategy and guidance sessions' },
  { id: 'general_qa', label: 'General Q&A Calls', description: 'Answer questions about the CRNA journey' }
];

// Terms checkboxes
const TERMS = [
  { id: 'contractor', label: 'I understand I am an independent contractor' },
  { id: 'commission', label: 'I understand CRNA Club takes a 20% platform fee' },
  { id: 'video', label: 'I will provide my own video call link (Zoom/Meet)' },
  { id: 'taxes', label: 'I am responsible for my own taxes (1099)' },
  { id: 'response', label: 'I will respond to booking requests within 48 hours' }
];

export function ProviderApplicationPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Eligibility
    isEnrolled: null,

    // Step 2: Basic Info
    firstName: '',
    lastName: '',
    email: '',
    photo: null,
    studentId: null,
    licenseNumber: '',
    licenseState: '',

    // Step 3: Program
    program: '',
    yearInProgram: '',
    graduationDate: '',
    icuType: '',
    icuYears: '',

    // Step 4: Services
    services: [],
    motivation: '',

    // Step 5: Terms
    acceptedTerms: []
  });

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    switch (step) {
      case 1:
        if (formData.isEnrolled === null) {
          newErrors.isEnrolled = 'Please select an option';
        }
        break;

      case 2:
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.photo) newErrors.photo = 'Photo is required';
        if (!formData.studentId) newErrors.studentId = 'Student ID is required';
        if (!formData.licenseNumber.trim()) newErrors.licenseNumber = 'License number is required';
        if (!formData.licenseState) newErrors.licenseState = 'License state is required';
        break;

      case 3:
        if (!formData.program) newErrors.program = 'Program is required';
        if (!formData.yearInProgram) newErrors.yearInProgram = 'Year is required';
        if (!formData.graduationDate) newErrors.graduationDate = 'Graduation date is required';
        if (!formData.icuType) newErrors.icuType = 'ICU type is required';
        if (!formData.icuYears) newErrors.icuYears = 'Years of experience is required';
        break;

      case 4:
        if (formData.services.length === 0) newErrors.services = 'Select at least one service';
        if (!formData.motivation.trim()) newErrors.motivation = 'Please share your motivation';
        if (formData.motivation.trim().length < 200) newErrors.motivation = 'Please write at least 200 characters';
        break;

      case 5:
        if (formData.acceptedTerms.length !== TERMS.length) {
          newErrors.terms = 'You must accept all terms to continue';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      // Special case: if not enrolled, show message
      if (currentStep === 1 && formData.isEnrolled === false) {
        return; // Stay on step 1 and show not eligible message
      }

      setCompletedSteps(prev => [...new Set([...prev, currentStep])]);
      setCurrentStep(prev => Math.min(prev + 1, 5));
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) return;

    setIsSubmitting(true);
    try {
      // TODO: API call to submit application
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Redirect to status page
      navigate('/marketplace/provider/application-status');
    } catch (error) {
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleService = (serviceId) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceId)
        ? prev.services.filter(id => id !== serviceId)
        : [...prev.services, serviceId]
    }));
  };

  const toggleTerm = (termId) => {
    setFormData(prev => ({
      ...prev,
      acceptedTerms: prev.acceptedTerms.includes(termId)
        ? prev.acceptedTerms.filter(id => id !== termId)
        : [...prev.acceptedTerms, termId]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/marketplace/become-a-mentor')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Mentor Application
          </h1>
          <p className="text-gray-600">
            Complete the form below to apply as a CRNA Club mentor.
          </p>
        </div>

        {/* Progress indicator */}
        <ApplicationStepIndicator
          currentStep={currentStep}
          completedSteps={completedSteps}
          className="mb-8"
        />

        {/* Step content */}
        <Card>
          <CardContent className="p-6">
            {/* Step 1: Eligibility */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Eligibility Check</h2>
                  <p className="text-gray-600">
                    CRNA Club mentors must be currently enrolled in a CRNA program.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="font-medium text-gray-900">
                    Are you currently enrolled in a CRNA program?
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => updateFormData('isEnrolled', true)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-center',
                        formData.isEnrolled === true
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <CheckCircle2 className={cn(
                        'w-8 h-8 mx-auto mb-2',
                        formData.isEnrolled === true ? 'text-primary' : 'text-gray-300'
                      )} />
                      <span className="font-medium">Yes, I am</span>
                    </button>

                    <button
                      onClick={() => updateFormData('isEnrolled', false)}
                      className={cn(
                        'p-4 rounded-xl border-2 transition-all text-center',
                        formData.isEnrolled === false
                          ? 'border-red-300 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <AlertCircle className={cn(
                        'w-8 h-8 mx-auto mb-2',
                        formData.isEnrolled === false ? 'text-red-500' : 'text-gray-300'
                      )} />
                      <span className="font-medium">No, I'm not</span>
                    </button>
                  </div>

                  {formData.isEnrolled === false && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mt-4">
                      <p className="text-red-800 font-medium mb-2">
                        Sorry, you're not eligible at this time.
                      </p>
                      <p className="text-red-600 text-sm">
                        CRNA Club mentors must be current SRNAs (Student Registered Nurse Anesthetists).
                        Your recent experience applying to and being accepted into a CRNA program is
                        exactly what applicants need.
                      </p>
                    </div>
                  )}

                  {errors.isEnrolled && (
                    <p className="text-red-600 text-sm">{errors.isEnrolled}</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Basic Info */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
                  <p className="text-gray-600">
                    Tell us about yourself and verify your credentials.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      placeholder="Jane"
                      className={errors.firstName ? 'border-red-300' : ''}
                    />
                    {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      placeholder="Doe"
                      className={errors.lastName ? 'border-red-300' : ''}
                    />
                    {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    placeholder="jane@email.com"
                    className={errors.email ? 'border-red-300' : ''}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <Label>Profile Photo *</Label>
                  <PhotoUpload
                    value={formData.photo}
                    onChange={(file) => updateFormData('photo', file)}
                    error={errors.photo}
                  />
                </div>

                <div>
                  <Label>Student ID *</Label>
                  <StudentIdUpload
                    value={formData.studentId}
                    onChange={(file) => updateFormData('studentId', file)}
                    error={errors.studentId}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="licenseNumber">RN License Number *</Label>
                    <Input
                      id="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                      placeholder="RN123456"
                      className={errors.licenseNumber ? 'border-red-300' : ''}
                    />
                    {errors.licenseNumber && <p className="text-red-600 text-sm mt-1">{errors.licenseNumber}</p>}
                  </div>
                  <div>
                    <Label htmlFor="licenseState">License State *</Label>
                    <Select
                      value={formData.licenseState}
                      onValueChange={(value) => updateFormData('licenseState', value)}
                    >
                      <SelectTrigger className={errors.licenseState ? 'border-red-300' : ''}>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.licenseState && <p className="text-red-600 text-sm mt-1">{errors.licenseState}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Program Info */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Program Information</h2>
                  <p className="text-gray-600">
                    Tell us about your CRNA program and background.
                  </p>
                </div>

                <div>
                  <Label htmlFor="program">CRNA Program *</Label>
                  <Select
                    value={formData.program}
                    onValueChange={(value) => updateFormData('program', value)}
                  >
                    <SelectTrigger className={errors.program ? 'border-red-300' : ''}>
                      <SelectValue placeholder="Select your program" />
                    </SelectTrigger>
                    <SelectContent>
                      {CRNA_PROGRAMS.map((program) => (
                        <SelectItem key={program} value={program}>{program}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.program && <p className="text-red-600 text-sm mt-1">{errors.program}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="yearInProgram">Year in Program *</Label>
                    <Select
                      value={formData.yearInProgram}
                      onValueChange={(value) => updateFormData('yearInProgram', value)}
                    >
                      <SelectTrigger className={errors.yearInProgram ? 'border-red-300' : ''}>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1st Year</SelectItem>
                        <SelectItem value="2">2nd Year</SelectItem>
                        <SelectItem value="3">3rd Year</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.yearInProgram && <p className="text-red-600 text-sm mt-1">{errors.yearInProgram}</p>}
                  </div>
                  <div>
                    <Label htmlFor="graduationDate">Expected Graduation *</Label>
                    <Input
                      id="graduationDate"
                      type="month"
                      value={formData.graduationDate}
                      onChange={(e) => updateFormData('graduationDate', e.target.value)}
                      className={errors.graduationDate ? 'border-red-300' : ''}
                    />
                    {errors.graduationDate && <p className="text-red-600 text-sm mt-1">{errors.graduationDate}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="icuType">ICU Type *</Label>
                    <Select
                      value={formData.icuType}
                      onValueChange={(value) => updateFormData('icuType', value)}
                    >
                      <SelectTrigger className={errors.icuType ? 'border-red-300' : ''}>
                        <SelectValue placeholder="Select ICU type" />
                      </SelectTrigger>
                      <SelectContent>
                        {ICU_TYPES.map((type) => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.icuType && <p className="text-red-600 text-sm mt-1">{errors.icuType}</p>}
                  </div>
                  <div>
                    <Label htmlFor="icuYears">Years of ICU Experience *</Label>
                    <Select
                      value={formData.icuYears}
                      onValueChange={(value) => updateFormData('icuYears', value)}
                    >
                      <SelectTrigger className={errors.icuYears ? 'border-red-300' : ''}>
                        <SelectValue placeholder="Select years" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 year</SelectItem>
                        <SelectItem value="2">2 years</SelectItem>
                        <SelectItem value="3">3 years</SelectItem>
                        <SelectItem value="4">4 years</SelectItem>
                        <SelectItem value="5+">5+ years</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.icuYears && <p className="text-red-600 text-sm mt-1">{errors.icuYears}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Services & Motivation */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Briefcase className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Services & Motivation</h2>
                  <p className="text-gray-600">
                    What services would you like to offer?
                  </p>
                </div>

                <div>
                  <Label className="mb-3 block">Services You'd Like to Offer *</Label>
                  <div className="space-y-3">
                    {SERVICES.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => toggleService(service.id)}
                        className={cn(
                          'p-4 rounded-xl border-2 cursor-pointer transition-all',
                          formData.services.includes(service.id)
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={formData.services.includes(service.id)}
                            onCheckedChange={() => toggleService(service.id)}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{service.label}</p>
                            <p className="text-sm text-gray-500">{service.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.services && <p className="text-red-600 text-sm mt-2">{errors.services}</p>}
                </div>

                <div>
                  <Label htmlFor="motivation">Why do you want to be a mentor? *</Label>
                  <div className="bg-purple-50 rounded-xl p-3 mb-2 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600 mt-0.5" />
                    <p className="text-sm text-purple-700">
                      Be genuine! Share what excites you about helping applicants on their CRNA journey.
                    </p>
                  </div>
                  <Textarea
                    id="motivation"
                    value={formData.motivation}
                    onChange={(e) => updateFormData('motivation', e.target.value)}
                    placeholder="I want to become a mentor because..."
                    rows={5}
                    className={errors.motivation ? 'border-red-300' : ''}
                  />
                  <div className="flex justify-between mt-1">
                    <p className={cn(
                      'text-sm',
                      formData.motivation.length < 200 ? 'text-gray-500' : 'text-green-600'
                    )}>
                      {formData.motivation.length} / 200 minimum characters
                    </p>
                    {errors.motivation && <p className="text-red-600 text-sm">{errors.motivation}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Terms */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Terms & Agreement</h2>
                  <p className="text-gray-600">
                    Please review and accept the terms below.
                  </p>
                </div>

                <div className="space-y-4">
                  {TERMS.map((term) => (
                    <div
                      key={term.id}
                      onClick={() => toggleTerm(term.id)}
                      className={cn(
                        'p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3',
                        formData.acceptedTerms.includes(term.id)
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                    >
                      <Checkbox
                        checked={formData.acceptedTerms.includes(term.id)}
                        onCheckedChange={() => toggleTerm(term.id)}
                      />
                      <span className="text-gray-900">{term.label}</span>
                    </div>
                  ))}
                </div>

                {errors.terms && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-600 text-sm">{errors.terms}</p>
                  </div>
                )}

                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  disabled={currentStep === 1 && formData.isEnrolled === false}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Send className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default ProviderApplicationPage;
