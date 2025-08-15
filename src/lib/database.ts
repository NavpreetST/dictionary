import sqlite3 from 'sqlite3';
import path from 'path';

// Common Word interface for both SQLite and MongoDB
export interface Word {
  id?: number | string;
  german: string;
  partOfSpeech: string;
  article: string;
  definition: string;
  translation: string;
  examples?: string[];
  alternateMeanings?: string[];
  createdAt: string;
}

// Determine which database to use
function getDatabaseType(): 'sqlite' | 'mongodb' {
  // Check if DATABASE_TYPE is explicitly set
  if (process.env.DATABASE_TYPE) {
    return process.env.DATABASE_TYPE as 'sqlite' | 'mongodb';
  }
  
  // Default behavior: use SQLite for development, MongoDB for production
  return process.env.NODE_ENV === 'production' ? 'mongodb' : 'sqlite';
}

// Abstract database interface
interface DatabaseInterface {
  init(): Promise<void>;
  addWord(word: Omit<Word, 'id' | 'createdAt'>): Promise<Word>;
  getAllWords(): Promise<Word[]>;
  deleteWord(german: string): Promise<void>;
  close(): Promise<void>;
}

// SQLite implementation
class SQLiteDatabase implements DatabaseInterface {
  private db: sqlite3.Database | null = null;
  private dbPath: string;

  constructor() {
    this.dbPath = process.env.SQLITE_PATH 
      ? path.resolve(process.env.SQLITE_PATH)
      : path.join(process.cwd(), 'deutsche_words.db');
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
    
    const databaseInstance = this.db;

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
        
        const lastID = this.lastID;

        databaseInstance.get('SELECT * FROM words WHERE id = ?', [lastID], (err: Error | null, row: Record<string, unknown>) => {
          if (err) {
            reject(err);
          } else {
            const parsedWord: Word = {
              ...row,
              examples: row.examples ? JSON.parse(row.examples as string) : [],
              alternateMeanings: row.alternateMeanings ? JSON.parse(row.alternateMeanings as string) : [],
              createdAt: new Date(row.createdAt as string).toISOString(),
            } as Word;
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
      this.db!.all('SELECT * FROM words ORDER BY german ASC', (err, rows: Record<string, unknown>[]) => {
        if (err) {
          reject(err);
        } else {
          const parsedWords: Word[] = rows.map(row => ({
            ...row,
            examples: row.examples ? JSON.parse(row.examples as string) : [],
            alternateMeanings: row.alternateMeanings ? JSON.parse(row.alternateMeanings as string) : []
          } as Word));
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

// MongoDB implementation
class MongoDatabase implements DatabaseInterface {
  private isConnected = false;
  private connectMongoDB: (() => Promise<unknown>) | null = null;
  private WordModel: any = null;

  async init(): Promise<void> {
    if (!this.isConnected) {
      // Dynamically import MongoDB dependencies only when needed
      const { default: connectMongoDB } = await import('./mongodb');
      const { default: WordModel } = await import('./models/Word');
      
      this.connectMongoDB = connectMongoDB;
      this.WordModel = WordModel;
      
      await connectMongoDB();
      this.isConnected = true;
    }
  }

  async addWord(word: Omit<Word, 'id' | 'createdAt'>): Promise<Word> {
    await this.init();
    
    try {
      // Use upsert to replace existing word if it exists
      const result = await (this.WordModel as any).findOneAndUpdate(
        { german: word.german },
        {
          ...word,
          examples: word.examples || [],
          alternateMeanings: word.alternateMeanings || []
        },
        { 
          upsert: true, 
          new: true, 
          runValidators: true 
        }
      );

      return {
        id: result._id.toString(),
        german: result.german,
        partOfSpeech: result.partOfSpeech,
        article: result.article,
        definition: result.definition,
        translation: result.translation,
        examples: result.examples,
        alternateMeanings: result.alternateMeanings,
        createdAt: result.createdAt.toISOString()
      };
    } catch (error: any) {
      throw new Error(`Failed to add word: ${error.message}`);
    }
  }

  async getAllWords(): Promise<Word[]> {
    await this.init();
    
    try {
      const words = await (this.WordModel as any).find({}).sort({ german: 1 });
      
      return words.map((word: any) => ({
        id: word._id.toString(),
        german: word.german,
        partOfSpeech: word.partOfSpeech,
        article: word.article,
        definition: word.definition,
        translation: word.translation,
        examples: word.examples,
        alternateMeanings: word.alternateMeanings,
        createdAt: word.createdAt.toISOString()
      }));
    } catch (error: any) {
      throw new Error(`Failed to get words: ${error.message}`);
    }
  }

  async deleteWord(german: string): Promise<void> {
    await this.init();
    
    try {
      await (this.WordModel as any).deleteOne({ german });
    } catch (error: any) {
      throw new Error(`Failed to delete word: ${error.message}`);
    }
  }

  async close(): Promise<void> {
    // MongoDB connections are handled globally, no need to close explicitly
    this.isConnected = false;
  }
}

// Singleton instances
let dbInstance: DatabaseInterface | null = null;

export const getDatabase = async (): Promise<DatabaseInterface> => {
  if (!dbInstance) {
    const dbType = getDatabaseType();
    
    if (dbType === 'mongodb') {
      console.log('Using MongoDB database');
      dbInstance = new MongoDatabase();
    } else {
      console.log('Using SQLite database');
      dbInstance = new SQLiteDatabase();
    }
    
    await dbInstance.init();
  }
  return dbInstance;
};
