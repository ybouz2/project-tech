exports.utilsDB = async function (client) {
    try {
        await client.connect()

        const database = client.db('userdb')

        const collection = database.collection('users')

        // Stopt de data uit mijn database in een Array
        return collection.find().toArray() 

    } catch (err) {
        console.log(err)
    }

}
