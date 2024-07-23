const songModel = require("../Models/songModel");

const postSong = async (req, res) => {
  try {
    const { title, author, uploader } = req.body;

    if (!title || !author)
      return res.status(400).json("All fields are required...");

    let song = new songModel({ title, author, uploader });

    if (req.files) {
      if (req.files.image) {
        song.image = `/uploads/images/${req.files.image[0].filename}`;
      }
      if (req.files.song) {
        song.song = `/uploads/songs/${req.files.song[0].filename}`;
      }
    }

    await song.save();

    res.status(200).json(song);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const getSongs = async (req, res) => {
  const { search } = req.query;

  try {
    let filter = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      filter = {
        $or: [
          { title: { $regex: regex } },
          { author: { $regex: regex } }
        ]
      };
    }

    const songs = await songModel.find(filter);
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getSongsByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const songs = await songModel.find({ uploader: userId });
    res.status(200).json(songs);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
}

const getSongById = async (req, res) => {
  const songId = req.params.songId;

  try {
    const song = await songModel.findById(songId);
    
    if (!song) {
      return res.status(404).json({ message: 'Song not found' });
    }
    
    res.status(200).json(song);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { postSong, getSongs, getSongsByUserId, getSongById };