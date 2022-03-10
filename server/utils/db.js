require('dotenv').config()

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.weqjj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
 client.connect(err => {
 const collection = client.db("test").collection("devices");
  
 //perform actions on the collection object
 client.close();
 });




const saveUser = async function (user) {
console.log('test')
    try {
  
      await client.connect();
        console.log('connected')
      const result = await client
  
        .db("Accounts")
  
        .collection("AllAccounts")
  
        .insertOne(user);
  
      console.log("Account opgeslagen met id: " + result.insertedId);
  
    } catch (e) {
  
      console.error(e);
  
    } finally {
  
      await client.close();
  
    }
  
  };

  module.exports = {saveUser}