const express = require("express");
const createTournament = require("../controllers/createTournament");
const getRoundInfo = require("../controllers/getRound");
const createNextRounds = require("../controllers/createNextRounds");
const updateWinner = require("../controllers/updateWinner");

const router = express.Router();

router.post("/createTournament", createTournament);
router.get("/getRounds/:tournamentId", getRoundInfo);
router.get("/createNextRounds/:tournamentId", createNextRounds);
router.put("/setWinner/:roundId", updateWinner);

module.exports = router;
