const express = require("express");
const app = express();
const PORT = 4000;
const db = require("./db.js");
app.use(express.json());
const teamRoute = require("./routes/team.js");
const playerRoute = require("./routes/player.js");
const tournamentRoute = require("./routes/tournament.js");

const Round = require("./modals/rounds.js");
const Team = require("./modals/team.js");

app.use("/api/team", teamRoute);
app.use("/api/player", playerRoute);
app.use("/api/tournament", tournamentRoute);

app.listen(PORT, () => {
  console.log(`Listening to port ${PORT}`);
});
