require("dotenv").config();
const colors = require("colors");
const path = require("path");
const express = require("express");
const socketHandler = require("./socketHandler");
const app = express();

app.use(express.static(path.join(__dirname, "public")));

const http = require("http");
const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

socketHandler(server);

// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/public/index.html");
// });

server.listen(PORT, () => {
  console.log(`Server is now running on PORT: ${PORT}`.blue);
});
