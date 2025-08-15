import mongoose, { Document, Schema } from 'mongoose';

export interface IWord extends Document {
  german: string;
  partOfSpeech: string;
  article: string;
  definition: string;
  translation: string;
  examples: string[];
  alternateMeanings: string[];
  createdAt: Date;
}

const WordSchema = new Schema<IWord>({
  german: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  partOfSpeech: {
    type: String,
    required: true,
    trim: true
  },
  article: {
    type: String,
    required: true,
    trim: true
  },
  definition: {
    type: String,
    required: true,
    trim: true
  },
  translation: {
    type: String,
    required: true,
    trim: true
  },
  examples: {
    type: [String],
    default: []
  },
  alternateMeanings: {
    type: [String],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create indexes for better performance
WordSchema.index({ german: 1 });
WordSchema.index({ createdAt: -1 });

// Export model - use existing model if it exists to avoid re-compilation issues
const WordModel = mongoose.models.Word || mongoose.model<IWord>('Word', WordSchema);
export default WordModel;
