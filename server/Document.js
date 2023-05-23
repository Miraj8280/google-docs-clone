const { Schema, model } = require("mongoose");

// Define the Document schema
const Document = new Schema({
  _id: String, // ID field for the document (String type)
  data: Object, // Data field for the document (Object type)
});

// Create and export the Document model using the schema
module.exports = model("Document", Document);
