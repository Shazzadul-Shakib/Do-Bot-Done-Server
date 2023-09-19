const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_Password}@do-bot-done.d7mepg5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  const database = client.db("DoBotDone");
  const allTodos = database.collection("allTodos");

  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    // Post todos api
    app.post("/todos", async (req, res) => {
      const todos = req.body;
      const result = await allTodos.insertOne(todos);
      res.send(result);
    });

    // Api to get todos from database
    app.get("/todos", async (req, res) => {
      const email = req.query.userEmail;
      if (!email) {
        res.send([]);
      }
      const query = { userEmail: email };
      const result = await allTodos.find(query).toArray();
      res.send(result);
    });

    // Delete a todo
    app.delete("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await allTodos.deleteOne(query);
      res.send(result);
    });

    // Update a todo
    app.put("/todos/:id", async (req, res) => {
      const id = req.params.id;
      const todo = req.body;
      const filter = { _id: new ObjectId(id) };
      const updateTodo = {
        $set: {
          todo: todo.updateTodo,
        },
      };
      const result = await allTodos.updateOne(filter, updateTodo);
      res.send(result);
    });

    // Update check status for a particular todo
    app.patch('/todos/:id',async(req,res)=>{
      const id=req.params.id;
      const checkStatus=req.body.isChecked;
      const filter = { _id: new ObjectId(id) };
      const updateStatus = {
        $set: {
          isChecked: checkStatus,
        },
      };
      const result=await allTodos.updateOne(filter,updateStatus);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running..");
});
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
