import type * as SQLite from 'expo-sqlite';
import { WorkoutType, WorkoutFieldDefinition } from '@shared/types/workout';

interface WorkoutTypeRow {
  id: string;
  name: string;
  fields: string;
  is_default: number;
  created_at: string;
}

function safeParseFields(json: string): WorkoutFieldDefinition[] {
  try {
    return JSON.parse(json) as WorkoutFieldDefinition[];
  } catch {
    return [];
  }
}

function mapRow(row: WorkoutTypeRow): WorkoutType {
  return {
    id: row.id,
    name: row.name,
    fields: safeParseFields(row.fields),
    isDefault: row.is_default === 1,
    createdAt: row.created_at,
  };
}

export async function getAll(
  db: SQLite.SQLiteDatabase
): Promise<WorkoutType[]> {
  const rows = await db.getAllAsync<WorkoutTypeRow>(
    `SELECT * FROM workout_types ORDER BY name`
  );
  return rows.map(mapRow);
}

export async function getById(
  db: SQLite.SQLiteDatabase,
  id: string
): Promise<WorkoutType | null> {
  const row = await db.getFirstAsync<WorkoutTypeRow>(
    `SELECT * FROM workout_types WHERE id = ?`,
    id
  );
  return row ? mapRow(row) : null;
}

export async function getDefaults(
  db: SQLite.SQLiteDatabase
): Promise<WorkoutType[]> {
  const rows = await db.getAllAsync<WorkoutTypeRow>(
    `SELECT * FROM workout_types WHERE is_default = 1 ORDER BY name`
  );
  return rows.map(mapRow);
}
