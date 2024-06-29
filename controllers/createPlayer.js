const Player = require("../modals/player.js");
const Teams = require("../modals/team.js");
const createPlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const { playerName, age } = req.body;

    console.log(id, "TEAM ID");

    if (!playerName) {
      return res.status(400).json({ message: "Player Name is required" });
    }

    if (!age) {
      return res.status(400).json({ message: "Player Age is required" });
    }

    const findTeam = await Teams.findById(id);

    if (!findTeam) {
      return res.status(400).json({ message: "Team not found" });
    }

    const newPlayer = new Player({ playerName, age, teamId: id });
    const savePlayer = await newPlayer.save();

    findTeam.playersIds.push(savePlayer._id);
    findTeam.save();

    return res.status(201).json({ player: savePlayer });
  } catch (error) {
    return res.status(500).json({ message: "internal server error" });
  }
};

module.exports = createPlayer;
