const express = require("express");
const dbConnection = require("./config/connectDB");
const routes = require("./routes/notice");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors({
	origin: true,
	credentials: true,
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	allowedHeaders: ["Content-Type", "x-user-role", "Authorization"]
}));

//DB Connection
dbConnection();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/",(req,res) => res.send("Hello Server is Running .."));
app.use("/api/notices", routes);


const PORT = 3000;

app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));