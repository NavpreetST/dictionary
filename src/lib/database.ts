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
  examples?: string[];
  alternateMeanings?: string[];
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
            examples TEXT DEFAULT '[]',
            alternateMeanings TEXT DEFAULT '[]',
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `, (err) => {
          if (err) {
            reject(err);
          } else {
            // Add columns to existing table if they don't exist
            this.db!.run('ALTER TABLE words ADD COLUMN examples TEXT DEFAULT \'[]\';', (err) => {
              // Ignore error if column already exists
              this.db!.run('ALTER TABLE words ADD COLUMN alternateMeanings TEXT DEFAULT \'[]\';', (err) => {
                // Ignore error if column already exists
                resolve();
              });
            });
          }
        });
      });
    });
  }

  async addWord(word: Omit<Word, 'id' | 'createdAt'>): Promise<Word> {
    if (!this.db) throw new Error('Database not initialized');
    
    const databaseInstance = this.db; // Capture the Database class's db here

    return new Promise((resolve, reject) => {
      const examplesJson = JSON.stringify(word.examples || []);
      const alternateMeaningsJson = JSON.stringify(word.alternateMeanings || []);
      
      const stmt = this.db!.prepare(`
        INSERT OR REPLACE INTO words (german, partOfSpeech, article, definition, translation, examples, alternateMeanings)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run([word.german, word.partOfSpeech, word.article, word.definition, word.translation, examplesJson, alternateMeaningsJson], function(this: sqlite3.RunResult, err) {
        if (err) {
          reject(err);
          return;
        }
        
        const lastID = this.lastID; // This should be fine

        databaseInstance.get('SELECT * FROM words WHERE id = ?', [lastID], (err: Error | null, row: any) => {
          if (err) {
            reject(err);
          } else {
            const parsedWord: Word = {
              ...row,
              examples: row.examples ? JSON.parse(row.examples) : [],
              alternateMeanings: row.alternateMeanings ? JSON.parse(row.alternateMeanings) : [],
              createdAt: new Date(row.createdAt).toISOString(),
            };
            resolve(parsedWord);
          }
        });
      });
      
      stmt.finalize();
    });
  }

  async getAllWords(): Promise<Word[]> {
    if (!this.db) throw new Error('Database not initialized');
    
    return new Promise((resolve, reject) => {
      this.db!.all('SELECT * FROM words ORDER BY german ASC', (err, rows: any[]) => {
        if (err) {
          reject(err);
        } else {
          // Parse JSON fields back to arrays
          const parsedWords: Word[] = rows.map(row => ({
            ...row,
            examples: row.examples ? JSON.parse(row.examples) : [],
            alternateMeanings: row.alternateMeanings ? JSON.parse(row.alternateMeanings) : []
          }));
          resolve(parsedWords);
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
