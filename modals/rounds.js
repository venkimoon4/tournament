const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  tournamentId: {
    type: String,
    required: true,
  },
  roundNumber: {
    type: Number,
    required: true,
  },
  matches: [
    {
      matchNumber: {
        type: Number,
        required: true,
      },
      team1: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teams",
        required: true,
      },
      team2: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teams",
        required: true,
      },
      winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teams",
        default: null,
      },
    },
  ],
  oddTeam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Teams",
    default: null,
  },
});

const Round = mongoose.model("Round", roundSchema);
module.exports = Round;
