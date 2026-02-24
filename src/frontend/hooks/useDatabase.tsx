import React, { createContext, useContext, useEffect, useState } from 'react';
import type * as SQLite from 'expo-sqlite';
import { getDatabase } from '@backend/database/connection';

type DatabaseContextType = {
  db: SQLite.SQLiteDatabase | null;
  isReady: boolean;
  error: string | null;
};

const DatabaseContext = createContext<DatabaseContextType>({
  db: null,
  isReady: false,
  error: null,
});

export function DatabaseProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [db, setDb] = useState<SQLite.SQLiteDatabase | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    getDatabase()
      .then((database) => {
        if (mounted) {
          setDb(database);
          setIsReady(true);
        }
      })
      .catch((err) => {
        console.error('[Vitalis] Database initialization failed:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : String(err));
          setIsReady(true); // unblock the UI so the error state renders
        }
      });
    return () => { mounted = false; };
  }, []);

  return (
    <DatabaseContext.Provider value={{ db, isReady, error }}>
      {children}
    </DatabaseContext.Provider>
  );
}

export function useDatabase(): SQLite.SQLiteDatabase {
  const { db } = useContext(DatabaseContext);
  if (!db) throw new Error('useDatabase must be used within DatabaseProvider after DB is ready');
  return db;
}

export function useDatabaseStatus() {
  return useContext(DatabaseContext);
}
