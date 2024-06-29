const Round = require("../modals/rounds.js");

const createNextRound = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    // Find all rounds for the given tournament ID
    const rounds = await Round.find({ tournamentId }).sort({ roundNumber: 1 });

    if (rounds.length === 0) {
      return res.status(404).json({ message: "No rounds found for this tournament" });
    }

    // Get the current round (the one with the highest round number)
    const currentRound = rounds[rounds.length - 1];

    // Check if all matches in the current round have winners
    const allMatchesCompleted = currentRound.matches.every((match) => match.winner);

    if (!allMatchesCompleted) {
      return res.status(400).json({ message: "Not all matches have winners yet" });
    }

    // Collect winners' IDs
    const winners = currentRound.matches.map((match) => match.winner);

    // Ensure there are at least two winners to create the next round
    if (winners.length < 2) {
      return res.status(400).json({ message: "Not enough winners to create the next round" });
    }

    // Create matches for the next round
    const nextRoundNumber = currentRound.roundNumber + 1;
    const nextRoundMatches = [];
    for (let i = 0; i < winners.length; i += 2) {
      const match = {
        matchNumber: i / 2 + 1, // Adjust match numbering for the next round
        team1: winners[i],
        team2: winners[i + 1] !== undefined ? winners[i + 1] : null, // If there's an odd number of winners, the last one will not have a pair
        winner: null, // Initialize winner as null for the new matches
      };
      nextRoundMatches.push(match);
    }

    // Save the next round
    const nextRound = new Round({
      tournamentId,
      roundNumber: nextRoundNumber,
      matches: nextRoundMatches,
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
