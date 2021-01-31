import { MongoClient, Db, Collection } from 'mongodb'
const url = 'mongodb://localhost:27017'

let _db: Db
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

export const getCollection = (name: string): Collection<any> => {
    let collection = collectionCache.get(name)
    if (!collection) {
        collection = _db.collection(name)
        collectionCache.set(name, collection)
    }

    return collection
}
