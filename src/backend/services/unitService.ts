/** Unit service - weight/distance conversion between metric and imperial. */
import type { UnitSystem } from '@shared/types/settings';

export function kgToLb(kg: number): number {
  return kg * 2.20462;
}

export function lbToKg(lb: number): number {
  return lb / 2.20462;
}

export function metersToMiles(m: number): number {
  return m / 1609.344;
}

export function milesToMeters(mi: number): number {
  return mi * 1609.344;
}

export function metersToKm(m: number): number {
  return m / 1000;
}

export function kmToMeters(km: number): number {
  return km * 1000;
}

export function formatWeightForDisplay(kg: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return `${kgToLb(kg).toFixed(1)} lb`;
  }
  return `${kg.toFixed(1)} kg`;
}

export function formatDistanceForDisplay(meters: number, units: UnitSystem): string {
  if (units === 'imperial') {
    return `${metersToMiles(meters).toFixed(2)} mi`;
  }
  if (meters >= 1000) {
    return `${metersToKm(meters).toFixed(2)} km`;
  }
  return `${meters.toFixed(0)} m`;
}

export function parseWeightInput(value: number, units: UnitSystem): number {
  if (units === 'imperial') {
    return lbToKg(value);
  }
  return value;
}

export function parseDistanceInput(value: number, units: UnitSystem): number {
  if (units === 'imperial') {
    return milesToMeters(value);
  }
  // Assume input is in km for metric
  return kmToMeters(value);
}
