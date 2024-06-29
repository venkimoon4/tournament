const Teams = require("../modals/team.js");

const createTeams = async (req, res) => {
  try {
    const { teamName } = req.body;
    const { id } = req.params;

    if (!teamName) {
      return res.status(400).json({ message: "Team Name is required" });
    }

    const newTeam = new Teams({ teamName, tournamentId: id });
    const saveTeam = await newTeam.save();

    return res.status(201).json({ team: saveTeam });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = createTeams;
