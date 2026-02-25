/** Progress service - computes stats, streaks, personal records, and volume trends. */
import type * as SQLite from 'expo-sqlite';

export interface PersonalRecords {
  maxWeight: number | null;
  maxReps: number | null;
  estimated1RM: number | null;
}

export interface VolumeDataPoint {
  week: string;
  volume: number;
}

export interface FrequencyDataPoint {
  week: string;
  count: number;
}

export interface TodayStats {
  workoutsToday: number;
  volumeToday: number;
}

export async function getPersonalRecords(
  db: SQLite.SQLiteDatabase,
  exerciseId: string
): Promise<PersonalRecords> {
  const row = await db.getFirstAsync<{
    max_weight: number | null;
    max_reps: number | null;
  }>(
    `SELECT
       MAX(ws.weight_kg) AS max_weight,
       MAX(ws.reps)      AS max_reps
     FROM workout_sets ws
     JOIN workout_exercises we ON we.id = ws.workout_exercise_id
     JOIN workouts w ON w.id = we.workout_id
     WHERE we.exercise_id = ?
       AND w.status = 'completed'`,
    exerciseId
  );

  const maxWeight = row?.max_weight ?? null;
  const maxReps = row?.max_reps ?? null;

  // Calculate estimated 1RM using Epley formula (weight * (1 + reps/30))
  // Find the set that yields the highest 1RM among completed workouts
  const oneRMRow = await db.getFirstAsync<{ estimated_1rm: number | null }>(
    `SELECT
       MAX(ws.weight_kg * (1.0 + ws.reps / 30.0)) AS estimated_1rm
     FROM workout_sets ws
     JOIN workout_exercises we ON we.id = ws.workout_exercise_id
     JOIN workouts w ON w.id = we.workout_id
     WHERE we.exercise_id = ?
       AND w.status = 'completed'
       AND ws.weight_kg IS NOT NULL
       AND ws.reps IS NOT NULL`,
    exerciseId
  );

  const estimated1RM = oneRMRow?.estimated_1rm ?? null;

  return { maxWeight, maxReps, estimated1RM };
}

export async function getVolumeOverTime(
  db: SQLite.SQLiteDatabase,
  exerciseId: string,
  weeks: number
): Promise<VolumeDataPoint[]> {
  const rows = await db.getAllAsync<{ week: string; volume: number }>(
    `SELECT
       strftime('%Y-W%W', w.completed_at) AS week,
       SUM(ws.weight_kg * ws.reps)        AS volume
     FROM workout_sets ws
     JOIN workout_exercises we ON we.id = ws.workout_exercise_id
     JOIN workouts w ON w.id = we.workout_id
     WHERE we.exercise_id = ?
       AND w.status = 'completed'
       AND w.completed_at >= date('now', ? || ' days')
       AND ws.weight_kg IS NOT NULL
       AND ws.reps IS NOT NULL
     GROUP BY week
     ORDER BY week`,
    exerciseId,
    `-${weeks * 7}`
  );
  return rows;
}

export async function getWorkoutFrequency(
  db: SQLite.SQLiteDatabase,
  weeks: number
): Promise<FrequencyDataPoint[]> {
  const rows = await db.getAllAsync<{ week: string; count: number }>(
    `SELECT
       strftime('%Y-W%W', started_at) AS week,
       COUNT(*)                        AS count
     FROM workouts
     WHERE status = 'completed'
       AND started_at >= date('now', ? || ' days')
     GROUP BY week
     ORDER BY week`,
    `-${weeks * 7}`
  );
  return rows;
}

export async function getCurrentStreak(db: SQLite.SQLiteDatabase): Promise<number> {
  // Fetch all distinct days with at least one completed workout, most recent first
  const rows = await db.getAllAsync<{ day: string }>(
    `SELECT DISTINCT date(started_at) AS day
     FROM workouts
     WHERE status = 'completed'
     ORDER BY day DESC`
  );

  if (rows.length === 0) return 0;

  let streak = 0;
  // Use UTC date string to match SQLite's date('now') which is always UTC
  const today = new Date().toISOString().slice(0, 10);

  for (const row of rows) {
    const expected = new Date(today + 'T00:00:00Z');
    expected.setUTCDate(expected.getUTCDate() - streak);
    const expectedStr = expected.toISOString().slice(0, 10);

    if (row.day === expectedStr) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export interface WeeklyStats {
  workoutsThisWeek: number;
  volumeThisWeek: number;
}

export async function getWeeklyStats(db: SQLite.SQLiteDatabase): Promise<WeeklyStats> {
  const weekStart = "date('now', 'weekday 0', '-6 days')";

  const workoutsRow = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count
     FROM workouts
     WHERE status = 'completed'
       AND date(started_at) >= ${weekStart}`
  );

  const volumeRow = await db.getFirstAsync<{ total: number | null }>(
    `SELECT SUM(ws.weight_kg * ws.reps) AS total
     FROM workout_sets ws
     JOIN workout_exercises we ON we.id = ws.workout_exercise_id
     JOIN workouts w ON w.id = we.workout_id
     WHERE w.status = 'completed'
       AND date(w.started_at) >= ${weekStart}
       AND ws.weight_kg IS NOT NULL
       AND ws.reps IS NOT NULL`
  );

  return {
    workoutsThisWeek: workoutsRow?.count ?? 0,
    volumeThisWeek: volumeRow?.total ?? 0,
  };
}

export async function getTodayStats(db: SQLite.SQLiteDatabase): Promise<TodayStats> {
  const workoutsRow = await db.getFirstAsync<{ count: number }>(
    `SELECT COUNT(*) AS count
     FROM workouts
     WHERE status = 'completed'
       AND date(started_at) = date('now')`
  );

  const volumeRow = await db.getFirstAsync<{ total: number | null }>(
    `SELECT SUM(ws.weight_kg * ws.reps) AS total
     FROM workout_sets ws
     JOIN workout_exercises we ON we.id = ws.workout_exercise_id
     JOIN workouts w ON w.id = we.workout_id
     WHERE w.status = 'completed'
       AND date(w.started_at) = date('now')
       AND ws.weight_kg IS NOT NULL
       AND ws.reps IS NOT NULL`
  );

  return {
    workoutsToday: workoutsRow?.count ?? 0,
    volumeToday: volumeRow?.total ?? 0,
  };
}
