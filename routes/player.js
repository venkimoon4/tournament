const express = require("express");
const createPlayer = require("../controllers/createPlayer");

const router = express.Router();

router.post("/createPlayer/:id", createPlayer);

module.exports = router;
