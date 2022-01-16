import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { users?: mongoDB.Collection, guilds?: mongoDB.Collection, members?: mongoDB.Collection } = {}

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const usersCollection: mongoDB.Collection = db.collection("users");
    const guildsCollection: mongoDB.Collection = db.collection("guilds");
    const membersCollection: mongoDB.Collection = db.collection("members");
 
    collections.users = usersCollection;
    collections.guilds = guildsCollection;
    collections.members = membersCollection;
       
    console.log(`Successfully connected to database: ${db.databaseName} and collection: ${usersCollection.collectionName}`);
 }