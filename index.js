import express from "express"
import 'dotenv/config'
import cors from 'cors'
import { MongoClient, ObjectId } from "mongodb";
const app = express()
const port = 8000
app.use(express.json({ limit: "10mb" }));
//  app.use(express.json());
 app.use(cors());



const client = new MongoClient(process.env.MONGODB_URL);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

 const connectedClient= await connectToMongoDB();
 const database = connectedClient.db("salonbook")
 const users = database.collection("user")
const services = database.collection("services");

app.get('/',  (req, res) => {
  res.send(' run the server ')
})


 app.get('/users',async (req,res)=>{
    const cursor = users.find({});
    const result =  await cursor .toArray();
    res.send (result);
 }) 

// // bookig add card 
// app.post("/services", async (req, res) => {
//   const service = {
//     ...req.body,
//     createdAt: new Date(),
//     updatedAt: new Date(),
//   };

//   const result = await services.insertOne(service);

//   res.status(201).send(result);
// });

// app.get("/services", async (req, res) => {
//   const cursor = services.find({});
//   const result = await cursor.toArray();

//   res.send(result);
// });


// // update 
// app.patch("/services/:id", async (req, res) => {
//   const { id } = req.params;

//   if (!ObjectId.isValid(id)) {
//     return res.status(400).send({ message: "Invalid service ID" });
//   }

//   const { name, category, description, price, duration, image, status } =
//     req.body;

//   const updateData = {};

//   if (name !== undefined) updateData.name = name;
//   if (category !== undefined) updateData.category = category;
//   if (description !== undefined) updateData.description = description;
//   if (price !== undefined) updateData.price = Number(price);
//   if (duration !== undefined) updateData.duration = Number(duration);
//   if (image !== undefined) updateData.image = image;
//   if (status !== undefined) updateData.status = status;

//   if (Object.keys(updateData).length === 0) {
//     return res.status(400).send({ message: "No data provided to update" });
//   }

//   updateData.updatedAt = new Date();

//   const result = await services.updateOne(
//     { _id: new ObjectId(id) },
//     { $set: updateData }
//   );

//   if (result.matchedCount === 0) {
//     return res.status(404).send({ message: "Service not found" });
//   }

//   res.send({ message: "Service updated successfully" });
// });


//   app.delete("/services/:id", async (req, res) => {
//     const id = req.params.id;
//     const query = {_id: new Object(id)};
//     const result = await services.deleteOne(query);
//     res.send (result);
//   })





app.listen(port, () => {
  console.log(`running succesfully ${port}`)
})