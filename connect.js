const { MongoClient } = require('mongodb');

const uri = 'mongosh "mongodb+srv://cluster0.5pfvwfx.mongodb.net/" --apiVersion 1 --username admin';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    // Aqui você pode realizar operações no banco de dados

  } finally {
    await client.close();
  }
}

run().catch(console.error);
