
'use client';

/**
 * @fileOverview A dummy implementation of the auto-detect conversion flow.
 * This is used for static builds (e.g., GitHub Pages) where Server Actions
 * are not supported. It returns a null result immediately.
 */

import type { DetectFormatInput, DetectFormatOutput } from './auto-detect-conversion';

export async function detectFormat(
  input: DetectFormatInput
): Promise<DetectFormatOutput> {
  console.log("AI format detection is disabled for static export.");
  return Promise.resolve({ format: null, confidence: null });
}
