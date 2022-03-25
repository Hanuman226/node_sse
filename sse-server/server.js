const express = require("express");
const cors = require("cors");
const path=require("path");
const app = express();

app.use(cors());
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.get("/status", (request, response) =>
  response.json({ clients: clients.length })
);

const PORT = process.env.PORT || 3000;

let clients = [];
let employees = [];

function eventsHandler(request, response, next) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);

  const data = `data: ${JSON.stringify(employees)}\n\n`;

  response.write(data);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response,
  };

  clients.push(newClient);

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter((client) => client.id !== clientId);
  });
}

app.get("/events", eventsHandler);

function sendEventsToAll(newEmployee) {
  clients.forEach((client) =>
    client.response.write(`data: ${JSON.stringify(newEmployee)}\n\n`)
  );
}

async function addEmployee(request, respsonse, next) {
  const newEmployee = request.body;
  employees.push(newEmployee);
  respsonse.json(newEmployee);
  return sendEventsToAll(newEmployee);
}

app.post("/employee", addEmployee);


app.use(express.static(path.join(__dirname, '../sse-client/build')));


app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Employees Events service listening at http://localhost:${PORT}`);
});
