const mongoose = require("mongoose");

const countRoundSchema = new mongoose.Schema({
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  noOfRounds: {
    type: Number,
    required: true,
  },
});

const CountRounds = mongoose.model("CountRounds", countRoundSchema);

module.exports = CountRounds;
