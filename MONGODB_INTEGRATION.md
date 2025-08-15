# MongoDB Integration

This project now supports both SQLite (for local development) and MongoDB (for production deployment) databases.

## How It Works

The database abstraction layer automatically selects the appropriate database based on the environment:

- **Development (NODE_ENV=development)**: Uses SQLite database stored locally
- **Production (NODE_ENV=production)**: Uses MongoDB for cloud deployment

## Configuration

### Development (Local SQLite)
1. Ensure `.env.local` has:
   ```
   NODE_ENV=development
   SQLITE_PATH=deutsche_words.db
   ```

2. The application will automatically use SQLite and create the database file locally.

### Production (MongoDB)
1. Set up MongoDB Atlas or local MongoDB instance
2. Configure environment variables:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/deutsche-words
   ```

### Override Database Type
You can force a specific database type regardless of NODE_ENV:
```
DATABASE_TYPE=sqlite  # or 'mongodb'
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `DATABASE_TYPE` | Force specific database type | Uses NODE_ENV logic |
| `MONGODB_URI` | MongoDB connection string | Required for MongoDB |
| `SQLITE_PATH` | SQLite database file path | deutsche_words.db |

## Database Migration

The Word schema is consistent between both databases:
- SQLite: Stores arrays as JSON strings
- MongoDB: Stores arrays as native arrays

Data can be migrated between databases if needed.

## Deployment

When deploying to platforms like Vercel, Netlify, or Heroku:
1. Set `NODE_ENV=production`
2. Set `MONGODB_URI` to your MongoDB connection string
3. The application will automatically use MongoDB

## Troubleshooting

If you see "Unexpected token '<'" errors, it usually means:
1. API routes are returning HTML error pages instead of JSON
2. Database connection is failing
3. Check server logs for actual error messages
4. Verify environment variables are set correctly
