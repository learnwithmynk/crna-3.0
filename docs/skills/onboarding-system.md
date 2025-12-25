# Onboarding System

How new users are welcomed and guided through The CRNA Club.

---

## Overview

Onboarding helps new users:
1. Understand the platform's value
2. Set up their profile
3. Take first meaningful actions
4. Form habits that lead to success

---

## Onboarding Stages

### Stage 1: Welcome (Immediately after signup)

**Welcome Modal:**
```jsx
function WelcomeModal({ onClose }) {
  return (
    <Dialog open>
      <div className="p-6 text-center">
        <div className="text-4xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold mb-2">
          Welcome to The CRNA Club!
        </h2>
        <p className="text-gray-600 mb-6">
          You've just taken the first step toward your CRNA dream.
          Let's get you set up for success.
        </p>
        
        {/* Optional: Loom video embed */}
        <div className="aspect-video bg-gray-100 rounded-lg mb-6">
          <iframe 
            src="https://www.loom.com/embed/xxxxx"
            className="w-full h-full rounded-lg"
          />
        </div>
        
        <Button onClick={onClose} className="w-full">
          Let's Get Started
        </Button>
      </div>
    </Dialog>
  );
}
```

### Stage 2: Profile Setup

**Profile Wizard (3 steps):**

```jsx
function ProfileWizard() {
  const [step, setStep] = useState(1);
  
  return (
    <div className="max-w-md mx-auto p-6">
      {/* Progress indicator */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map(s => (
          <div 
            key={s}
            className={`h-2 flex-1 rounded ${s <= step ? 'bg-yellow-400' : 'bg-gray-200'}`}
          />
        ))}
      </div>
      
      {step === 1 && <BasicInfoStep onNext={() => setStep(2)} />}
      {step === 2 && <ExperienceStep onNext={() => setStep(3)} onBack={() => setStep(1)} />}
      {step === 3 && <GoalsStep onComplete={handleComplete} onBack={() => setStep(2)} />}
    </div>
  );
}

function BasicInfoStep({ onNext }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Let's start with the basics</h2>
      
      <FormField label="What should we call you?">
        <Input placeholder="Your preferred name" />
      </FormField>
      
      <FormField label="Where are you in your journey?">
        <Select>
          <option value="more_than_12">More than 12 months from applying</option>
          <option value="6_to_12">6-12 months from applying</option>
          <option value="less_than_6">Less than 6 months</option>
          <option value="applying_now">Currently applying</option>
        </Select>
      </FormField>
      
      <Button onClick={onNext} className="w-full">Continue</Button>
    </div>
  );
}

function ExperienceStep({ onNext, onBack }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Tell us about your experience</h2>
      
      <FormField label="What type of ICU do you work in?">
        <Select>
          <option value="micu">Medical ICU</option>
          <option value="sicu">Surgical ICU</option>
          <option value="cvicu">Cardiovascular ICU</option>
          {/* ... more options */}
        </Select>
      </FormField>
      
      <FormField label="Years of ICU experience">
        <Input type="number" placeholder="e.g., 2.5" />
      </FormField>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onNext} className="flex-1">Continue</Button>
      </div>
    </div>
  );
}

function GoalsStep({ onComplete, onBack }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">What are your goals?</h2>
      
      <FormField label="When do you want to start CRNA school?">
        <Select>
          <option value="2025">Fall 2025</option>
          <option value="2026">Fall 2026</option>
          <option value="2027">Fall 2027</option>
          <option value="unsure">Not sure yet</option>
        </Select>
      </FormField>
      
      <FormField label="Do you have any target schools?">
        <Select>
          <option value="yes">Yes, I have schools in mind</option>
          <option value="researching">I'm still researching</option>
          <option value="no">Not yet</option>
        </Select>
      </FormField>
      
      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">Back</Button>
        <Button onClick={onComplete} className="flex-1">Complete Setup</Button>
      </div>
    </div>
  );
}
```

### Stage 3: Guided Actions (Dashboard)

After profile setup, the dashboard shows an onboarding widget:

```jsx
function OnboardingWidget({ completedSteps }) {
  const steps = [
    {
      id: 'profile',
      title: 'Complete your profile',
      description: 'Add your GPA, certifications, and experience',
      link: '/my-stats',
      completed: completedSteps.includes('profile'),
      points: 20,
    },
    {
      id: 'first_program',
      title: 'Save your first program',
      description: 'Browse schools and save ones that interest you',
      link: '/schools',
      completed: completedSteps.includes('first_program'),
      points: 5,
    },
    {
      id: 'first_clinical',
      title: 'Log your first clinical entry',
      description: 'Start tracking your ICU experience',
      link: '/trackers/clinical',
      completed: completedSteps.includes('first_clinical'),
      points: 2,
    },
    {
      id: 'first_lesson',
      title: 'Complete your first lesson',
      description: 'Start learning in the Learning Library',
      link: '/learning',
      completed: completedSteps.includes('first_lesson'),
      points: 3,
    },
    {
      id: 'introduce',
      title: 'Introduce yourself',
      description: 'Say hi in the Introductions forum',
      link: '/community/forums/introductions',
      completed: completedSteps.includes('introduce'),
      points: 2,
    },
  ];
  
  const completedCount = steps.filter(s => s.completed).length;
  const allComplete = completedCount === steps.length;
  
  if (allComplete) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center gap-4">
          <div className="text-4xl">🎉</div>
          <div>
            <h3 className="font-bold text-green-800">Onboarding Complete!</h3>
            <p className="text-green-700">You've earned 32 points. You're ready to crush your CRNA goals!</p>
          </div>
        </div>
      </Card>
    );
  }
  
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold">Get Started</h3>
        <span className="text-sm text-gray-500">{completedCount}/{steps.length} complete</span>
      </div>
      
      <div className="space-y-3">
        {steps.map(step => (
          <Link
            key={step.id}
            to={step.link}
            className={`
              flex items-center gap-3 p-3 rounded-lg border
              ${step.completed 
                ? 'bg-gray-50 opacity-60' 
                : 'hover:border-yellow-400 hover:bg-yellow-50'
              }
            `}
          >
            <div className={`
              w-6 h-6 rounded-full flex items-center justify-center
              ${step.completed ? 'bg-green-500 text-white' : 'bg-gray-200'}
            `}>
              {step.completed ? <Check className="w-4 h-4" /> : null}
            </div>
            <div className="flex-1">
              <p className={`font-medium ${step.completed ? 'line-through' : ''}`}>
                {step.title}
              </p>
              <p className="text-sm text-gray-500">{step.description}</p>
            </div>
            <span className="text-sm text-yellow-600">+{step.points} pts</span>
          </Link>
        ))}
      </div>
    </Card>
  );
}
```

---

## First-Time Prompts

For key pages, show helpful prompts on first visit:

### First Time Saving a Program

```jsx
function FirstProgramPrompt({ onDismiss }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <div className="flex gap-3">
        <div className="text-2xl">💡</div>
        <div className="flex-1">
          <h4 className="font-medium text-blue-900">Tip: Save schools you're interested in</h4>
          <p className="text-sm text-blue-700 mt-1">
            Click the bookmark icon on any school to save it. You can review saved schools 
            in "My Programs" and convert them to target schools when you're ready to apply.
          </p>
        </div>
        <button onClick={onDismiss} className="text-blue-500 hover:text-blue-700">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

### First Time in Trackers

```jsx
function TrackerIntroPrompt({ onDismiss }) {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <div className="flex gap-3">
        <div className="text-2xl">📝</div>
        <div className="flex-1">
          <h4 className="font-medium">Build your "Living Resume"</h4>
          <p className="text-sm text-gray-600 mt-1">
            Logging your clinical experiences here builds a comprehensive record of your 
            skills and experience. This data appears on your profile and helps you 
            articulate your experience in interviews.
          </p>
        </div>
        <button onClick={onDismiss}>
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
```

---

## Empty States as Onboarding

Empty states guide users to take action:

```jsx
function EmptyProgramsState() {
  return (
    <div className="text-center py-12">
      <Target className="w-12 h-12 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">No programs saved yet</h3>
      <p className="text-gray-500 mb-4 max-w-sm mx-auto">
        Start by exploring our database of 140+ CRNA programs. 
        Save the ones that match your goals.
      </p>
      <Button asChild>
        <Link to="/schools">Browse Schools</Link>
      </Button>
    </div>
  );
}
```

---

## Onboarding Progress Tracking

Track which steps users have completed:

```javascript
// User meta or local storage
{
  onboarding: {
    welcomeModalSeen: true,
    profileWizardCompleted: true,
    steps: {
      profile: true,
      first_program: true,
      first_clinical: false,
      first_lesson: false,
      introduce: false
    },
    completedAt: null, // Set when all done
    dismissedAt: null  // If user dismisses widget
  }
}
```

---

## Points for Onboarding

| Action | Points | One-time? |
|--------|--------|-----------|
| Complete profile wizard | 20 | Yes |
| Save first program | 5 | Yes |
| Convert first target | 3 | Yes |
| Log first clinical entry | 2 | Yes |
| Complete first lesson | 3 | Yes |
| First forum post | 2 | Yes |
| First forum reply | 2 | Yes |

**Total possible onboarding points: ~37**

This gets users to Level 2 (Dedicated Dreamer) quickly!

---

## Trial User Onboarding

Trial users see additional elements:

```jsx
function TrialOnboardingBanner({ daysLeft }) {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 p-4 rounded-lg mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="font-bold text-black">
            🎉 You have {daysLeft} days left in your free trial!
          </p>
          <p className="text-sm text-yellow-900">
            Explore everything The CRNA Club has to offer.
          </p>
        </div>
        <Button 
          variant="outline" 
          className="bg-white text-black border-white hover:bg-yellow-50"
          asChild
        >
          <a href="https://thecrnaclub.com/pricing">See Plans</a>
        </Button>
      </div>
    </div>
  );
}
```

---

## Re-Engagement

For users who haven't logged in recently:

### Welcome Back Email
Sent after 7 days of inactivity with:
- Deadline reminders for saved programs
- New content in Learning Library
- Community highlights

### Return User Dashboard

```jsx
function WelcomeBackWidget({ lastLogin, updates }) {
  return (
    <Card className="p-6 bg-blue-50 border-blue-200">
      <h3 className="font-bold mb-2">Welcome back! 👋</h3>
      <p className="text-sm text-gray-600 mb-4">
        Here's what's happened since {formatDate(lastLogin)}:
      </p>
      <ul className="space-y-2 text-sm">
        {updates.newLessons > 0 && (
          <li>📚 {updates.newLessons} new lessons added</li>
        )}
        {updates.upcomingDeadlines > 0 && (
          <li>⚠️ {updates.upcomingDeadlines} program deadlines approaching</li>
        )}
        {updates.forumActivity > 0 && (
          <li>💬 {updates.forumActivity} new replies in forums you follow</li>
        )}
      </ul>
    </Card>
  );
}
```

---

## Onboarding Analytics

Track for optimization:
- Wizard completion rate
- Drop-off points
- Time to first key action
- 7-day retention
- Which onboarding steps correlate with long-term engagement

```javascript
// Event logging
logEvent('onboarding_step_completed', {
  step: 'first_program',
  time_since_signup: 3600, // seconds
  total_steps_completed: 2
});
```
