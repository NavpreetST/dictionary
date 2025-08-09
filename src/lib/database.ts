import sqlite3 from 'sqlite3';
import { promisify } from 'util';
import path from 'path';

export interface Word {
  id?: number;
  german: string;
  partOfSpeech: string;
  article: string;
  definition: string;
  translation: string;
  createdAt: string;
}

class Database {
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(process.cwd(), 'deutsche_words.db');
  }

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        // Create the words table if it doesn't exist
        this.db!.run(`
          CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            german TEXT UNIQUE NOT NULL,
            partOfSpeech TEXT NOT NULL,
            article TEXT NOT NULL,
            definition TEXT NOT NULL,
            translation TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    });
  }

  async addWord(word: Omit<Word, 'id' | 'createdAt'>): Promise<Word> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      const stmt = this.db!.prepare(`
        INSERT OR REPLACE INTO words (german, partOfSpeech, article, definition, translation)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run([word.german, word.partOfSpeech, word.article, word.definition, word.translation], function(err) {
        if (err) {
          reject(err);
          return;
        }
        
        // Get the inserted word
        const db = stmt.db;
        db.get('SELECT * FROM words WHERE id = ?', [this.lastID], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row as Word);
          }
        });
      });
      
      stmt.finalize();
    });
  }

  async getAllWords(): Promise<Word[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      this.db!.all('SELECT * FROM words ORDER BY german ASC', (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows as Word[]);
        }
      });
    });
  }

  async deleteWord(german: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      this.db!.run('DELETE FROM words WHERE german = ?', [german], (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async close(): Promise<void> {
    if (!this.db) return;
    
    return new Promise((resolve) => {
      this.db!.close(() => {
        this.db = null;
        resolve();
      });
    });
  }
}

// Singleton instance
let dbInstance: Database | null = null;

export const getDatabase = async (): Promise<Database> => {
  if (!dbInstance) {
    dbInstance = new Database();
    await dbInstance.init();
  }
  return dbInstance;
};
