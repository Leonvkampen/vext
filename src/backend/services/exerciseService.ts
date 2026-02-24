import type * as SQLite from 'expo-sqlite';
import * as exercise from '@backend/models/exercise';

export async function updateDefaultRestSeconds(
  db: SQLite.SQLiteDatabase,
  exerciseId: string,
  restSeconds: number | null
): Promise<void> {
  return exercise.updateRestSeconds(db, exerciseId, restSeconds);
}
