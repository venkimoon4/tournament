const Teams = require("../modals/team.js");
const Round = require("../modals/rounds.js");
const Tournament = require("../modals/tournament.js");

const createRoundOne = async (fixingType, teams, tournamentId) => {
  let roundNumber = 1;
  let matchNumber = 0;

  if (
    fixingType === "sequential" ||
    fixingType === "random" ||
    fixingType === "top_vs_bottom"
  ) {
    if (fixingType === "random") {
      shuffleArray(teams);
    } else if (fixingType === "top_vs_bottom") {
      teams.sort((a, b) => a.rank - b.rank);
      const half = Math.ceil(teams.length / 2);
      const topTeams = teams.slice(0, half);
      const bottomTeams = teams.slice(-half).reverse();
      teams = [];

      for (let i = 0; i < half; i++) {
        if (topTeams[i]) teams.push(topTeams[i]);
        if (bottomTeams[i]) teams.push(bottomTeams[i]);
      }
    }

    const matches = [];
    let oddTeam = null;

    for (let i = 0; i < teams.length; i += 2) {
      if (i + 1 < teams.length) {
        matches.push({
          matchNumber: ++matchNumber,
          team1: teams[i]._id,
          team2: teams[i + 1]._id,
          winner: null,
        });
      } else {
        oddTeam = teams[i]._id;
      }
    }

    const firstRound = new Round({
      tournamentId: tournamentId,
      roundNumber,
      matches,
      oddTeam,
    });
    const savedRound = await firstRound.save();

    return savedRound;
  } else {
    throw new Error(
      "Unsupported fixingType. Must be 'sequential', 'random', or 'top_vs_bottom'."
    );
  }
};

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const calculateNumberOfRounds = (noOfParticipants) => {
  if (noOfParticipants < 2) {
    throw new Error("Number of participants must be at least 2.");
  }

  let rounds = 0;
  while (noOfParticipants > 1) {
    noOfParticipants = Math.ceil(noOfParticipants / 2);
    rounds++;
  }

  return rounds;
};

const createTeams = async (req, res) => {
  try {
    const { teamName } = req.body;
    const { id } = req.params;

    if (!teamName) {
      return res.status(400).json({ message: "Team Name is required" });
    }

    const newTeam = new Teams({ teamName, tournamentId: id });
    const saveTeam = await newTeam.save();

    const deleteRound = await Round.deleteMany({ tournamentId: id });

    const findTournament = await Tournament.findById(id);

    if (!findTournament) {
      return res.status(400).json({ message: "tournament not found" });
    }

    const findTeams = await Teams.find({ tournamentId: id });

    if (!findTeams) {
      return res.status(400).json({ message: "team not found" });
    }

    const createRounds = await createRoundOne(
      findTournament.fixingType,
      findTeams,
      id
    );

    return res.status(201).json({ team: saveTeam, round: createRounds });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = createTeams;
