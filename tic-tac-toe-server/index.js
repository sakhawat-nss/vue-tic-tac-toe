const express = require("express");
const expressWs = require('express-ws');
const dotenv = require("dotenv");
const cors = require('cors');
const bodyParser = require('body-parser');
const { getGames, addGame, connectWSS } = require("./controllers");

dotenv.config();

const app = express();
const port = process.env.PORT;
expressWs(app);

app.use(bodyParser.json());
app.use(cors());

app.get("/games", getGames);
app.post("/games", addGame);
app.ws('/wss/:uuid', connectWSS);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
