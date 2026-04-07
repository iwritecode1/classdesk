import { MongoClient, Db } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI environment variable is not set')
}

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB || 'classdesk'

let cached: { conn: MongoClient | null; db: Db | null } = { conn: null, db: null }

export async function connectToDatabase() {
  if (cached.conn) {
    return { client: cached.conn, db: cached.db! }
  }

  try {
    const client = new MongoClient(MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
      retryWrites: true,
      w: 'majority',
    })

    await client.connect()
    const db = client.db(MONGODB_DB)

    // Verify connection
    await db.admin().ping()

    cached.conn = client
    cached.db = db

    console.log('[API] Connected to MongoDB')
    return { client, db }
  } catch (error) {
    console.error('[API] MongoDB connection error:', error)
    throw error
  }
}

export async function closeDatabase() {
  if (cached.conn) {
    await cached.conn.close()
    cached = { conn: null, db: null }
  }
}

export { Db }
