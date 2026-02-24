export type UnitSystem = 'metric' | 'imperial';

export interface AppSettings {
  units: UnitSystem;
  defaultRestSeconds: number;
}
