const express = require("express");
const crypto = require("crypto");

// init express app
const app = express();

// serve public folder
app.use(express.static("public"));

const connections = {};

app.get("/active", function (req, res) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  const id = crypto.randomBytes(16).toString("hex");
  connections[id] = res;
  updateCount();

  res.on("close", () => {
    delete connections[id];
    res.end();
    updateCount();
  });
});

function updateCount() {
  server.getConnections(function (error, count) {
    for (const id in connections) {
      const res = connections[id];
      res.write("data: " + count + "\n\n");
    }
  });
}

// start express server
const server = app.listen(3000, () => console.log("app running on port 3000"));
