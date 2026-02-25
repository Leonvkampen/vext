/** Formatting utils - date formatting, duration display, and relative time helpers. */
import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import type { UnitSystem } from '@shared/types/settings';

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatWeight(kg: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const lb = kg * 2.20462;
    return `${Number(lb.toFixed(1))} lb`;
  }
  return `${Number(kg.toFixed(1))} kg`;
}

export function formatDistance(meters: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const miles = meters / 1609.344;
    return `${Number(miles.toFixed(2))} mi`;
  }
  const km = meters / 1000;
  return `${Number(km.toFixed(2))} km`;
}

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

export function formatTime(isoString: string): string {
  return format(new Date(isoString), 'h:mm a');
}

export function formatRelativeTime(isoString: string): string {
  return formatDistanceToNow(new Date(isoString), { addSuffix: true });
}

export function formatVolume(kg: number, units: UnitSystem): string {
  if (units === 'imperial') {
    const lb = kg * 2.20462;
    if (lb >= 1000) return `${Number((lb / 1000).toFixed(1))}k lb`;
    return `${Math.round(lb)} lb`;
  }
  if (kg >= 1000) return `${Number((kg / 1000).toFixed(1))}k kg`;
  return `${Math.round(kg)} kg`;
}

export function formatTimerDisplay(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
