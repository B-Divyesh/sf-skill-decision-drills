import { starterDrill } from './model';
import type { AppData, Attempt, Drill } from './types';

const DB_NAME = 'skill-decision-drills';
const DB_VERSION = 1;
const DRILLS = 'drills';
const ATTEMPTS = 'attempts';

const requestValue = <T>(request: IDBRequest<T>): Promise<T> => new Promise((resolve, reject) => {
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new Error('Local database request failed.'));
});

const openDatabase = (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, DB_VERSION);
  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(DRILLS)) db.createObjectStore(DRILLS, { keyPath: 'id' });
    if (!db.objectStoreNames.contains(ATTEMPTS)) db.createObjectStore(ATTEMPTS, { keyPath: 'id' });
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error ?? new Error('Could not open local storage.'));
});

const transactionDone = (transaction: IDBTransaction): Promise<void> => new Promise((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error ?? new Error('Could not save locally.'));
  transaction.onabort = () => reject(transaction.error ?? new Error('Local save was cancelled.'));
});

export class LocalStore {
  private dbPromise = openDatabase();

  async initialize(): Promise<void> {
    const data = await this.getAll();
    if (!data.drills.length && localStorage.getItem('sdd_initialized') !== 'yes') {
      await this.putDrill(starterDrill());
      localStorage.setItem('sdd_initialized', 'yes');
    }
  }

  async getAll(): Promise<AppData> {
    const db = await this.dbPromise;
    const transaction = db.transaction([DRILLS, ATTEMPTS], 'readonly');
    const drills = await requestValue(transaction.objectStore(DRILLS).getAll()) as Drill[];
    const attempts = await requestValue(transaction.objectStore(ATTEMPTS).getAll()) as Attempt[];
    return { drills, attempts };
  }

  async putDrill(drill: Drill): Promise<void> {
    const db = await this.dbPromise;
    const transaction = db.transaction(DRILLS, 'readwrite');
    transaction.objectStore(DRILLS).put(drill);
    await transactionDone(transaction);
  }

  async deleteDrill(id: string): Promise<void> {
    const db = await this.dbPromise;
    const transaction = db.transaction([DRILLS, ATTEMPTS], 'readwrite');
    transaction.objectStore(DRILLS).delete(id);
    const attempts = await requestValue(transaction.objectStore(ATTEMPTS).getAll()) as Attempt[];
    attempts.filter((attempt) => attempt.drillId === id).forEach((attempt) => transaction.objectStore(ATTEMPTS).delete(attempt.id));
    await transactionDone(transaction);
  }

  async putAttempt(attempt: Attempt): Promise<void> {
    const db = await this.dbPromise;
    const transaction = db.transaction(ATTEMPTS, 'readwrite');
    transaction.objectStore(ATTEMPTS).put(attempt);
    await transactionDone(transaction);
  }

  async replaceAll(data: AppData): Promise<void> {
    const db = await this.dbPromise;
    const transaction = db.transaction([DRILLS, ATTEMPTS], 'readwrite');
    transaction.objectStore(DRILLS).clear();
    transaction.objectStore(ATTEMPTS).clear();
    data.drills.forEach((drill) => transaction.objectStore(DRILLS).put(drill));
    data.attempts.forEach((attempt) => transaction.objectStore(ATTEMPTS).put(attempt));
    await transactionDone(transaction);
    localStorage.setItem('sdd_initialized', 'yes');
  }
}
