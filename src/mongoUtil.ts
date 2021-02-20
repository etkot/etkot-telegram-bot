import { MongoClient, Db, Collection } from 'mongodb'
const url = 'mongodb://localhost:27017'

let _db: Db
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const collectionCache = new Map<string, Collection<any>>()

export const connectToServer = (database: string): void => {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
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
