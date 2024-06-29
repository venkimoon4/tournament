const express = require("express");
const createTeams = require("../controllers/createTeam");

const router = express.Router();

router.post("/createTeam/:id", createTeams);


module.exports = router;
