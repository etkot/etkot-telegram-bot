import { Collection, Db, MongoClient } from 'mongodb'

const addr = process.env.DB_ADDR || '127.0.0.1'
const port = process.env.DB_PORT || '27017'
const url = `mongodb://${addr}:${port}`

let _db: Db
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const collectionCache = new Map<string, Collection<any>>()

export const connectToServer = (database: string): void => {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (err) throw err

        _db = client.db(database)
        console.log('Connected to MongoDB')
    })
}

export const getDb = (): Db => {
    return _db
}

export const getCollection = <T>(name: string): Collection<T> => {
    let collection = collectionCache.get(name)
    if (!collection) {
        collection = _db.collection(name)
        collectionCache.set(name, collection)
    }

    return collection
}
