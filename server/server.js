const mongoose = require("mongoose");
const Document = require("./Document");

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
    origin: "https://google-docs-clone-miraj.vercel.app",
    methods: ["GET", "POST"],
  },
});

const defaultValue = "";

io.on("connection", (socket) => {
  socket.on("get-document", async (documentId) => {
    const document = await findOrCreateDocument(documentId);
    socket.join(documentId);
    socket.emit("load-document", document.data);
    socket.on("send-changes", (delta) => {
      socket.broadcast.to(documentId).emit("receive-changes", delta);
    });
    socket.on("save-document", async (data) => {
      await Document.findByIdAndUpdate(documentId, { data });
    });
  });
});

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
