/** Validation utils - input validation for weight, reps, duration, and distance values. */
import { APP_CONFIG } from '@config/app';

const { validation } = APP_CONFIG;

export function validateWeight(value: number): string | null {
  if (value < validation.weight.min) return 'Weight cannot be negative';
  if (value > validation.weight.max) return `Weight cannot exceed ${validation.weight.max}`;
  return null;
}

export function validateReps(value: number): string | null {
  if (!Number.isInteger(value)) return 'Reps must be a whole number';
  if (value < validation.reps.min) return `Reps must be at least ${validation.reps.min}`;
  if (value > validation.reps.max) return `Reps cannot exceed ${validation.reps.max}`;
  return null;
}

export function validateDuration(seconds: number): string | null {
  if (!Number.isInteger(seconds)) return 'Duration must be a whole number of seconds';
  if (seconds < validation.duration.min) return 'Duration must be at least 1 second';
  if (seconds > validation.duration.max) return 'Duration cannot exceed 99:59:59';
  return null;
}

export function validateDistance(meters: number): string | null {
  if (meters < validation.distance.min) return `Distance must be at least ${validation.distance.min}`;
  if (meters > validation.distance.max) return `Distance cannot exceed ${validation.distance.max}`;
  return null;
}

export function validateExerciseName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length < validation.exerciseName.min) return 'Exercise name is required';
  if (trimmed.length > validation.exerciseName.max) return `Exercise name cannot exceed ${validation.exerciseName.max} characters`;
  return null;
}

export function validateWorkoutName(name: string): string | null {
  if (name.length > validation.workoutName.max) return `Workout name cannot exceed ${validation.workoutName.max} characters`;
  return null;
}

export function validateNotes(notes: string): string | null {
  if (notes.length > validation.notes.max) return `Notes cannot exceed ${validation.notes.max} characters`;
  return null;
}
