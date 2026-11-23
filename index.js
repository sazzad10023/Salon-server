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
const appointments = database.collection("appointments");
const transactions = database.collection("transactions");

app.get('/',  (req, res) => {
  res.send(' run the server ')
})


 app.get('/users',async (req,res)=>{
    const cursor = users.find({});
    const result =  await cursor .toArray();
    res.send (result);
 }) 

 // customer detalils

// Get single user details
app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await users.findOne({
      $or: [{ _id: id }, { id }],
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to fetch user",
    });
  }
});

// Block User
app.patch("/users/:id/block", async (req, res) => {
  try {
    const { id } = req.params;
    const { banReason } = req.body;

    const result = await users.updateOne(
      { $or: [{ _id: id }, { id }] },
      {
        $set: {
          banned: true,
          banReason: banReason || "Blocked by admin",
          bannedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      message: "User blocked successfully",
    });
  } catch (error) {
    console.error("Block user error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to block user",
    });
  }
});

// Unblock User
app.patch("/users/:id/unblock", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await users.updateOne(
      { $or: [{ _id: id }, { id }] },
      {
        $set: {
          banned: false,
          updatedAt: new Date(),
        },
        $unset: {
          banReason: "",
          bannedAt: "",
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    res.send({
      success: true,
      message: "User unblocked successfully",
    });
  } catch (error) {
    console.error("Unblock user error:", error);
    res.status(500).send({
      success: false,
      message: "Failed to unblock user",
    });
  }
});


// // bookig add card 
app.post("/services", async (req, res) => {
  const service = {
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const result = await services.insertOne(service);

  res.status(201).send(result);
});


app.get("/services", async (req, res) => {
    console.log("Authorization:", req.headers.authorization);

  const cursor = services.find({});
  const result = await cursor.toArray();

  res.send(result);
});


// // update 
app.patch("/services/:id", async (req, res) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).send({ message: "Invalid service ID" });
  }

  const { name, category, description, price, duration, image, status } =
    req.body;

  const updateData = {};

  if (name !== undefined) updateData.name = name;
  if (category !== undefined) updateData.category = category;
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = Number(price);
  if (duration !== undefined) updateData.duration = Number(duration);
  if (image !== undefined) updateData.image = image;
  if (status !== undefined) updateData.status = status;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).send({ message: "No data provided to update" });
  }

  updateData.updatedAt = new Date();

  const result = await services.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  if (result.matchedCount === 0) {
    return res.status(404).send({ message: "Service not found" });
  }

  res.send({ message: "Service updated successfully" });
});


  app.delete("/services/:id", async (req, res) => {
    const id = req.params.id;
    const query = {_id: new Object(id)};
    const result = await services.deleteOne(query);
    res.send (result);
  })

  

/// booking information 
app.post("/appointments", async (req, res) => {
  try {
    const appointment = {
      ...req.body,
      status: "Pending",
      paymentStatus: "Unpaid",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await appointments.insertOne(appointment);

    res.status(201).send({
      success: true,
      message: "Appointment created successfully!",
      data: {
        ...appointment,
        _id: result.insertedId,
      },
    });
  } catch (error) {
    console.error("Appointment creation error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to create appointment.",
    });
  }
});

 //my aponinment 

 // Get all appointments
// app.get("/appointments", async (req, res) => {
//   try {
//     const cursor = appointments.find({}).sort({ createdAt: -1 });
//     const result = await cursor.toArray();

//     res.send({
//       success: true,
//       data: result,
//     });
//   } catch (error) {
//     console.error("Get appointments error:", error);

//     res.status(500).send({
//       success: false,
//       message: "Failed to fetch appointments.",
//     });
//   }
// });
app.get("/appointments", async (req, res) => {
  try {
    const cursor = appointments.find({}).sort({ createdAt: -1 });
    const result = await cursor.toArray();

    res.send({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Get appointments error:", error);

    res.status(500).send({
      success: false,
      message: "Failed to fetch appointments.",
    });
  }
});


// Update appointment status (admin confirm / cancel)
app.patch("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ success: false, message: "Invalid appointment ID" });
    }

    const { status, paymentStatus } = req.body;
    const updateData = {};

    if (status !== undefined) {
      if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid appointment status" });
      }

      updateData.status = status;
    }

    if (paymentStatus !== undefined) {
      if (!["Paid", "Unpaid"].includes(paymentStatus)) {
        return res
          .status(400)
          .send({ success: false, message: "Invalid payment status" });
      }

      updateData.paymentStatus = paymentStatus;
    }

    if (Object.keys(updateData).length === 0) {
      return res
        .status(400)
        .send({ success: false, message: "No data provided to update" });
    }

    updateData.updatedAt = new Date();

    const result = await appointments.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .send({ success: false, message: "Appointment not found" });
    }

    res.send({ success: true, message: "Appointment updated successfully" });
  } catch (error) {
    console.error("Appointment update error:", error);

    res
      .status(500)
      .send({ success: false, message: "Failed to update appointment." });
  }
});


// admin dashboard 
// Admin Dashboard Statistics
// app.get("/api/admin/dashboard/stats", async (req, res) => {
//   try {
//     const [
//       totalCustomers,
//       totalActiveServices,
//       totalAppointments,
//       pendingAppointments,
//       confirmedAppointments,
//       paymentTotals,
//     ] = await Promise.all([
//       // Total registered customers
//       users.countDocuments({
//         role: "customer",
//       }),

//       // Total active services
//       services.countDocuments({
//         status: "Active",
//       }),

//       // Total appointment requests
//       appointments.countDocuments({}),

//       // Pending appointments
//       appointments.countDocuments({
//         status: "Pending",
//       }),

//       // Confirmed appointments
//       appointments.countDocuments({
//         status: "Confirmed",
//       }),

//       // Total successful payments
//       transactions.aggregate([
//         {
//           $match: {
//             paymentStatus: "paid",
//           },
//         },
//         {
//           $group: {
//             _id: "$currency",
//             totalAmount: {
//               $sum: "$amount",
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0,
//             currency: "$_id",
//             amount: "$totalAmount",
//           },
//         },
//       ]).toArray(),
//     ]);

//     res.status(200).send({
//       success: true,
//       message: "Dashboard statistics fetched successfully",
//       data: {
//         totalCustomers,
//         totalActiveServices,
//         totalAppointments,
//         pendingAppointments,
//         confirmedAppointments,
//         totalSuccessfulPayments: paymentTotals,
//       },
//     });
//   } catch (error) {
//     console.error("Dashboard statistics error:", error);

//     res.status(500).send({
//       success: false,
//       message: "Failed to fetch dashboard statistics",
//     });
//   }
// });

// customer over view 
// Customer Dashboard Statistics
// app.get("/customer-stats", async (req, res) => {
//   try {
//     const [
//       totalAppointments,
//       pendingAppointments,
//       confirmedAppointments,
//       cancelledAppointments,
//     ] = await Promise.all([
//       appointments.countDocuments({}),

//       appointments.countDocuments({
//         status: "Pending",
//       }),

//       appointments.countDocuments({
//         status: "Confirmed",
//       }),

//       appointments.countDocuments({
//         status: "Cancelled",
//       }),
//     ]);

//     res.status(200).send({
//       success: true,
//       message: "Dashboard statistics fetched successfully",
//       data: {
//         totalAppointments,
//         pendingAppointments,
//         confirmedAppointments,
//         cancelledAppointments,
//       },
//     });
//   } catch (error) {
//     console.error("Customer Dashboard Error:", error);

//     res.status(500).send({
//       success: false,
//       message: "Failed to fetch dashboard statistics",
//     });
//   }
// });


// transtion  

// app.get("/transactions", async (req, res) => {
//   try {
//     // Get all transactions
//     const transactionList = await transactions
//       .find()
//       .sort({ createdAt: -1 })
//       .toArray();

//     const result = [];

//     // Get appointment and service information
//     for (const transaction of transactionList) {
//       const appointment = await appointments.findOne({
//         _id: new ObjectId(transaction.appointmentId),
//       });

//       if (!appointment) continue;

//       const service = await services.findOne({
//         _id: new ObjectId(appointment.serviceId),
//       });

//       result.push({
//         _id: transaction._id,

//         // Customer Information
//         customer: appointment.customer,

//         // Related Service
//         service: service
//           ? service.name
//           : "Service not found",

//         // Appointment Information
//         appointmentDate: appointment.appointmentDate,
//         timeSlot: appointment.timeSlot,

//         // Payment Information
//         amount: transaction.amount,
//         currency: transaction.currency,
//         paymentStatus: transaction.paymentStatus,

//         // Stripe Information
//         stripeSessionId:
//           transaction.stripeSessionId ||
//           appointment.paymentSessionId,

//         // Transaction Date
//         transactionDate: transaction.createdAt,
//       });
//     }

//     res.status(200).send({
//       success: true,
//       total: result.length,
//       data: result,
//     });

//   } catch (error) {
//     console.error("Transaction Error:", error);

//     res.status(500).send({
//       success: false,
//       message: "Failed to fetch transactions",
//     });
//   }
// });



// feature service 
// app.get("/featured-services", async (req, res) => {
//   try {
//     const featuredServices = await services
//       .find({
//         status: { $regex: /^active$/i },
//       })
//       .sort({ createdAt: -1 })
//       .limit(6)
//       .toArray();

//     res.status(200).json({
//       success: true,
//       message: "Active services fetched successfully",
//       data: featuredServices,
//     });
//   } catch (error) {
//     console.error(error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch active services",
//     });
//   }
// });
app.listen(port, () => {
  console.log(`running succesfully ${port}`)
})