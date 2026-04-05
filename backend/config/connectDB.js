const mongoose = require("mongoose");

//DB Connection
const dburl = "mongodb+srv://guwanihathurusinghe_db_user:1234@cluster0.n1avrzr.mongodb.net/?appName=Cluster0";

mongoose.set("strictQuery", true);

const connection = async () => {
  try {
    await mongoose.connect(dburl);
    console.log("Connected to MongoDB Successfully!");
  } catch (e) {
    console.error("MongoDB Connection Error:", e.message);
    process.exit(1);
  }
};

module.exports = connection;