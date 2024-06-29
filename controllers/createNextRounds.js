const Round = require("../modals/rounds.js");

const createNextRound = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const rounds = await Round.find({ tournamentId }).sort({ roundNumber: 1 });

    if (rounds.length === 0) {
      return res.status(404).json({ message: "No rounds found for this tournament" });
    }

    const currentRound = rounds[rounds.length - 1];

    const allMatchesCompleted = currentRound.matches.every((match) => match.winner);

    if (!allMatchesCompleted) {
      return res.status(400).json({ message: "Not all matches have winners yet" });
    }

    const winners = currentRound.matches.map((match) => match.winner);
    if (currentRound.oddTeam) {
      winners.push(currentRound.oddTeam); // Add the odd team from the current round
    }

    if (winners.length < 2) {
      return res.status(400).json({ message: "Not enough winners to create the next round" });
    }

    const nextRoundNumber = currentRound.roundNumber + 1;
    const nextRoundMatches = [];
    let oddTeam = null;

    for (let i = 0; i < winners.length; i += 2) {
      if (i + 1 < winners.length) {
        nextRoundMatches.push({
          matchNumber: i / 2 + 1,
          team1: winners[i],
          team2: winners[i + 1],
          winner: null,
        });
      } else {
        oddTeam = winners[i];
      }
    }

    const nextRound = new Round({
      tournamentId,
      roundNumber: nextRoundNumber,
      matches: nextRoundMatches,
      oddTeam,
    });

    const savedNextRound = await nextRound.save();

    return res.status(201).json({
      message: "Next round created successfully",
      nextRound: savedNextRound,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};


module.exports = createNextRound;
