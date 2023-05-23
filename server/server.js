const mongoose = require("mongoose");
const Document = require("./Document");

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://mirajasraf786:miraj123@cluster0.uxmfjq0.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

db.once("open", () => {
  console.log("Connected to MongoDB Atlas");
});

const io = require("socket.io")(3001, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

io.on("connection", (socket) => {
  console.log("Server is connected");

  // Handle "get-document" event
  socket.on("get-document", async (documentId) => {
    // Find or create the document
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    
    // Emit "load-document" event to the client with the document data
    socket.emit("load-document", document.data);

    // Handle "send-changes" event
    socket.on("send-changes", (delta) => {
      // Broadcast the changes to other clients in the same document room
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });

    // Handle "save-document" event
    socket.on("save-document", async (data) => {
      // Update the document in the database
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

// Function to find or create a document based on the given ID
async function findOrCreateDocument(id) {
  if (id == null) {
    return;
  }

  const document = await Document.findById(id);
  if (document) {
    return document;
  }
  return await Document.create({ _id: id, data: defaultValue });
}
