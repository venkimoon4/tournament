const Round = require("../modals/rounds.js");

const updateWinner = async (req, res) => {
  try {
    const { matchNumber, teamId } = req.body;
    const { roundId } = req.params;

    if (!matchNumber) {
      return res
        .status(400)
        .json({ message: "match number is required to update winner" });
    }

    if (!teamId) {
      return res
        .status(400)
        .json({ message: "team id is required to update winner" });
    }

    const findRound = await Round.findById(roundId);

    const matchToUpdate = findRound.matches.find(
      (match) => match.matchNumber === matchNumber
    );

    if (!matchToUpdate) {
      return res.status(404).json({ message: "Match not found" });
    }

    matchToUpdate.winner = teamId;
    await findRound.save();
    return res.status(201).json({ findRound });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = updateWinner;
