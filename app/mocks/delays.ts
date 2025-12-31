// Network delay simulation for realistic mock API behavior

export const DELAYS = {
  fast: 200,      // Quick operations (local cache)
  normal: 500,    // Standard API calls
  slow: 1000,     // Heavy operations
  network: 800,   // Simulated network latency
} as const;

export function delay(ms: number = DELAYS.normal): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Random delay within a range for more realistic behavior
export function randomDelay(min: number = 300, max: number = 800): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay(ms);
}

// Simulate occasional slow responses
export function realisticDelay(): Promise<void> {
  const chance = Math.random();
  if (chance < 0.1) {
    return delay(DELAYS.slow); // 10% chance of slow response
  } else if (chance < 0.3) {
    return delay(DELAYS.fast); // 20% chance of fast response
  }
  return delay(DELAYS.normal); // 70% normal
}

