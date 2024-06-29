const Tournament = require("../modals/tournament.js");
const Teams = require("../modals/team.js");
const Round = require("../modals/rounds.js");
const CountRounds = require("../modals/countRounds.js");
const createRoundOne = async (fixingType, teams, tournamentId) => {
  let roundNumber = 1;
  let matchNumber = 0;

  if (fixingType === "sequential") {
    const matches = [];
    for (let i = 0; i < teams.length; i += 2) {
      matches.push({
        matchNumber: ++matchNumber,
        team1: teams[i]?._id,
        team2: teams[i + 1]?._id,
        winner: null,
      });
    }

    const firstRound = new Round({
      tournamentId: tournamentId,
      roundNumber,
      matches,
    });
    const savedRound = await firstRound.save();

    return savedRound;
  } else if (fixingType === "random") {
    shuffleArray(teams);

    const matches = [];
    for (let i = 0; i < teams.length; i += 2) {
      matches.push({
        matchNumber: ++matchNumber,
        team1: teams[i]?._id,
        team2: teams[i + 1]?._id,
        winner: null,
      });
    }

    const randomRound = new Round({
      tournamentId: tournamentId,
      roundNumber,
      matches,
    });
    const savedRound = await randomRound.save();

    return savedRound;
  } else if (fixingType === "top_vs_bottom") {
    // Assuming top vs bottom logic means pairing the strongest teams with the weakest
    const sortedTeams = [...teams].sort((a, b) => {
      // Example: Sorting teams by some criteria (e.g., ranking)
      return b.rank - a.rank; // Sort descending by rank (assuming rank is a property of teams)
    });

    const matches = [];
    const halfLength = Math.ceil(sortedTeams.length / 2);
    for (let i = 0; i < halfLength; i++) {
      matches.push({
        matchNumber: ++matchNumber,
        team1: sortedTeams[i]?._id,
        team2: sortedTeams[sortedTeams.length - 1 - i]?._id,
        winner: null,
      });
    }

    const topBottomRound = new Round({
      tournamentId: tournamentId,
      roundNumber,
      matches,
    });
    const savedRound = await topBottomRound.save();

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

const createTournament = async (req, res) => {
  try {
    const {
      tournamentName,
      sportName,
      format,
      noOfParticipants,
      selectionType,
      fixingType,
    } = req.body;

    if (!tournamentName) {
      return res.status(400).json({ message: "Tournament Name is required" });
    }

    if (!selectionType) {
      return res.status(400).json({ message: "Tournament Name is required" });
    }

    if (!sportName) {
      return res.status(400).json({ message: "Sport Name is required" });
    }

    if (!noOfParticipants) {
      return res
        .status(400)
        .json({ message: "Total Participants is required" });
    }

    if (!fixingType) {
      return res.status(400).json({ message: "Fixing Type is required" });
    }

    if (!format) {
      return res
        .status(400)
        .json({ message: "Type of Formatting Teams is required" });
    }

    const newTournament = new Tournament({
      tournamentName,
      sportName,
      selectionType,
      format,
      noOfParticipants,
      fixingType,
    });
    const saveTournament = await newTournament.save();

    if (saveTournament.noOfParticipants > 0) {
      for (let i = 0; i < saveTournament.noOfParticipants; i++) {
        let newTeam = new Teams({
          tournamentId: saveTournament._id,
          teamName: `Team ${i + 1}`,
        });
        let saveTeam = await newTeam.save();
      }
    }

    const findTeams = await Teams.find({ tournamentId: saveTournament._id });

    const firstRound = await createRoundOne(
      saveTournament.fixingType,
      findTeams,
      saveTournament._id
    );

    const numberOfRounds = calculateNumberOfRounds(
      saveTournament.noOfParticipants
    );

    const newCount = new CountRounds({
      tournamentId: saveTournament._id,
      noOfRounds: numberOfRounds,
    });
    const saveCount = await newCount.save();

    return res.status(201).json({
      tournament: saveTournament,
      teams: findTeams,
      fixing: firstRound,
      roundsCount: saveCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

module.exports = createTournament;
