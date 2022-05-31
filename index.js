const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId
const port =process.env.PORT ||5000

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.i8wrn.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


    

    async function run (){

        try{
            await client.connect();
            const database = client.db("Aysha_Asha");
            const blogCollection = database.collection("Blogs");
            const japaneseCultureCollection = database.collection("japaneseBlogs");
            const usersCollection = database.collection("websiteUser");
            const commentsCollection = database.collection("comments");
            const japanesecommentsCollection = database.collection("japaneseComments");

            // normal Blogs  post collection ........................................................................
            app.post('/blogs',async(req,res)=>{
                const newUser = req.body;
                const result =await blogCollection.insertOne(newUser)
                res.json(result)
            })
            // normal blog get collection 
            app.get('/blogs',async (req,res)=>{
                const cursor = blogCollection.find({})
                const page = req.query.page;
                const size = parseInt(req.query.size);
                const count = await cursor.count()
                let users ;
                    if(page){
                        users = await cursor.skip(page*size).limit(size).toArray() 
                    }
                    else{
                        users = await cursor.toArray()
                    }
                
                res.send({
                    count,
                    users
                })
            })
            app.delete('/blogs/:id',async(req,res)=>{
                const id = req.params.id
                const query = {_id:ObjectId(id)}
                const result = await blogCollection.deleteOne(query)
                console.log(result)
                res.json(result)

            })
            app.get('/blogs/:id',async (req,res)=>{
                const id = req.params.id
                console.log('this is id',id)
                const query = {_id: ObjectId(id)}
                const user =await blogCollection.findOne(query)
                res.send(user)

            })
            // end normal Blogs  post collection ...............................................................






            // japanese post Culture blog ---------------------------------------------------------------------
            app.post('/japaneseCulture',async(req,res)=>{
                const newUser = req.body;
                const result =await japaneseCultureCollection.insertOne(newUser)
                res.json(result)
            })
             // japanese get  Culture blog 
             app.get('/japaneseCulture',async (req,res)=>{
                const cursor = japaneseCultureCollection.find({})
                const page = req.query.page;
                const size = parseInt(req.query.size);
                const count = await cursor.count()
                let users ;
                    if(page){
                        users = await cursor.skip(page*size).limit(size).toArray() 
                    }
                    else{
                        users = await cursor.toArray()
                    }
                
                res.send({
                    count,
                    users
                })
            })
            app.delete('/japaneseCulture/:id',async(req,res)=>{
                const id = req.params.id
                const query = {_id:ObjectId(id)}
                const result = await japaneseCultureCollection.deleteOne(query)
                console.log(result)
                res.json(result)

            })
            app.get('/japaneseCulture/:id',async (req,res)=>{
                const id = req.params.id
                console.log('this is id',id)
                const query = {_id: ObjectId(id)}
                const user =await japaneseCultureCollection.findOne(query)
                res.send(user)

            })
            // end japanese post Culture blog ---------------------------------------------------------------------





            // user collection 
            app.post ('/usersCollection',async (req,res)=>{
                const user = req.body ;
                const result = await usersCollection.insertOne(user)
                res.json(result)
            })

            app.get('/websiteUser',async (req,res)=>{
                const cursor =  usersCollection.find({})
                const user = await cursor.toArray()
                res.send(user)
            })
            
            //blog comments ---------------------------------------------------------
            app.get('/comments',async (req,res)=>{
                const cursor = commentsCollection.find({})
                const users = await cursor.toArray()
                res.send(users)
            }) 

            app.post('/comments',async (req,res )=>{
                const user = req.body;
                const reuslt = await commentsCollection.insertOne(user)
                console.log(reuslt)
                res.json(reuslt)
            })
             //DELETE API
             app.delete('/comments/:id',async(req,res)=>{
                const id = req.params.id
                const query = {_id:ObjectId(id)}
                const result = await commentsCollection.deleteOne(query)
                console.log(result)
                res.json(result)

            })
             // SINGLE ID FOR UPDATE 
             app.get('/comments/:id',async (req,res)=>{
                const id = req.params.id
                console.log('this is id',id)
                const query = {_id: ObjectId(id)}
                const user =await commentsCollection.findOne(query)
                res.send(user)

            })
            // --------------------------------------------------------------------------
            // japanese comments --------------------------------------------------------------------------
            app.get('/japaneseComments',async (req,res)=>{
                const cursor = japanesecommentsCollection.find({})
                const users = await cursor.toArray()
                res.send(users)
            }) 

            app.post('/japaneseComments',async (req,res )=>{
                const user = req.body;
                const reuslt = await japanesecommentsCollection.insertOne(user)
                console.log(reuslt)
                res.json(reuslt)
            })
             //DELETE API
             app.delete('/japaneseComments/:id',async(req,res)=>{
                const id = req.params.id
                const query = {_id:ObjectId(id)}
                const result = await japanesecommentsCollection.deleteOne(query)
                console.log(result)
                res.json(result)

            })
             // SINGLE ID FOR UPDATE 
             app.get('/japaneseComments/:id',async (req,res)=>{
                const id = req.params.id
                console.log('this is id',id)
                const query = {_id: ObjectId(id)}
                const user =await japanesecommentsCollection.findOne(query)
                res.send(user)

            })
            // --------------------------------------------------------------------------

            // upsert 
            app.put('/usersCollection',async (req,res)=>{
                const user = req.body ;
                const filter = {email:user.email}
                const options = {upsert : true }
                const updateDoc = {$set:user}
                const result = await usersCollection.updateOne(filter,updateDoc,options)
                res.json(result)
            })
            // admin 
            app.put('/usersCollection/admin',async (req,res)=>{
                const user = req.body;
                const filter = {email:user.email};
                const updateDoc = {$set:{role:'admin'}};
                const result = await usersCollection.updateOne(filter,updateDoc)
                res.json(result)
            })
            //check admin or another people
            app.get('/usersCollection/:email',async (req,res)=>{
                const email = req.params.email;
                const query = {email:email}
                const user = await usersCollection.findOne(query)
                let isAdmin = false;
                    if(user?.role === 'admin'){
                        isAdmin = true
                    }
                res.json({admin:isAdmin})
            })
        }
        finally{

        }
    }
    run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})