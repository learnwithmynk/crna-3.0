/**
 * Dynamic Greeting Generator
 *
 * Generates time-based greetings with occasional fun variations.
 * Most of the time shows standard greetings (Good morning, Good afternoon, etc.)
 * Occasionally shows fun, personalized variations for delight.
 */

// Standard time-based greetings
const MORNING_GREETINGS = [
  "Good morning",
  "Rise and shine",
  "Morning",
];

const AFTERNOON_GREETINGS = [
  "Good afternoon",
  "Hey there",
  "Afternoon",
];

const EVENING_GREETINGS = [
  "Good evening",
  "Evening",
  "Hey there",
];

// Fun variations (shown ~20% of the time for delight)
const FUN_GREETINGS = [
  "Welcome back",
  "Great to see you",
  "Look who's here",
  "Hey superstar",
  "Hello, future CRNA",
  "Ready to crush it",
  "Let's do this",
  "You've got this",
  "Another day, another win",
  "Time to make it happen",
  "Here we go",
  "Back at it",
  "Keep going",
  "You're doing amazing",
];

// Weekend special greetings
const WEEKEND_GREETINGS = [
  "Happy weekend",
  "Enjoy your weekend",
  "Weekend warrior",
];

// Monday motivation
const MONDAY_GREETINGS = [
  "Happy Monday",
  "New week, new wins",
  "Monday motivation",
  "Fresh start",
];

// Friday fun
const FRIDAY_GREETINGS = [
  "Happy Friday",
  "TGIF",
  "Friday vibes",
  "Almost weekend",
];

/**
 * Get the time of day category
 * @returns {'morning' | 'afternoon' | 'evening'}
 */
function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * Get the day of week (0 = Sunday, 6 = Saturday)
 * @returns {number}
 */
function getDayOfWeek() {
  return new Date().getDay();
}

/**
 * Pick a random item from an array
 * @param {Array} arr
 * @returns {*}
 */
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a dynamic greeting based on time of day
 * with occasional fun variations for delight.
 *
 * @param {string} name - The user's name (optional)
 * @returns {string} The greeting string
 */
export function getGreeting(name = '') {
  const timeOfDay = getTimeOfDay();
  const dayOfWeek = getDayOfWeek();
  const showFunGreeting = Math.random() < 0.2; // 20% chance for fun greeting

  let greeting;

  // Check for special day greetings first (30% chance on special days)
  if (Math.random() < 0.3) {
    if (dayOfWeek === 1) {
      // Monday
      greeting = randomPick(MONDAY_GREETINGS);
    } else if (dayOfWeek === 5) {
      // Friday
      greeting = randomPick(FRIDAY_GREETINGS);
    } else if (dayOfWeek === 0 || dayOfWeek === 6) {
      // Weekend
      greeting = randomPick(WEEKEND_GREETINGS);
    }
  }

  // If no special greeting, use time-based or fun greeting
  if (!greeting) {
    if (showFunGreeting) {
      greeting = randomPick(FUN_GREETINGS);
    } else {
      // Standard time-based greeting
      switch (timeOfDay) {
        case 'morning':
          greeting = randomPick(MORNING_GREETINGS);
          break;
        case 'afternoon':
          greeting = randomPick(AFTERNOON_GREETINGS);
          break;
        case 'evening':
        default:
          greeting = randomPick(EVENING_GREETINGS);
          break;
      }
    }
  }

  // Add name if provided
  if (name) {
    return `${greeting}, ${name}!`;
  }

  return `${greeting}!`;
}

/**
 * Get a consistent greeting for the current session.
 * Caches the greeting in sessionStorage so it doesn't change on re-renders.
 *
 * @param {string} name - The user's name
 * @returns {string} The greeting string
 */
export function getSessionGreeting(name = '') {
  const cacheKey = 'crna_session_greeting';

  try {
    const cached = sessionStorage.getItem(cacheKey);
    if (cached) {
      // Replace placeholder name if present
      if (name && cached.includes('{name}')) {
        return cached.replace('{name}', name);
      }
      // Add name to cached greeting if it doesn't have one
      if (name && !cached.includes(name)) {
        return cached.replace('!', `, ${name}!`);
      }
      return cached;
    }
  } catch {
    // sessionStorage not available
  }

  // Generate new greeting
  const greeting = getGreeting(name);

  try {
    // Cache with placeholder for name
    const toCache = name ? greeting.replace(name, '{name}') : greeting;
    sessionStorage.setItem(cacheKey, toCache);
  } catch {
    // sessionStorage not available
  }

  return greeting;
}
