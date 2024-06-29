const Rounds = require("../modals/rounds.js");
const Teams = require("../modals/team.js");

const getRoundInfo = async (req, res) => {
  try {
    const { tournamentId } = req.params;

    const findRound = await Rounds.findOne({ tournamentId: tournamentId });

    if (!findRound) {
      return res.status(404).json({ error: "Round not found" });
    }

    // Iterate through matches and populate team details
    const populatedMatches = await Promise.all(
      findRound.matches.map(async (match) => {
        const team1 = await Teams.findById(match.team1);
        const team2 = await Teams.findById(match.team2);

        return {
          ...match.toObject(),
          team1: team1 ? team1.toObject() : null,
          team2: team2 ? team2.toObject() : null,
        };
      })
    );

    return res
      .status(200)
      .json({ rounds: { ...findRound.toObject(), matches: populatedMatches } });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = getRoundInfo;
