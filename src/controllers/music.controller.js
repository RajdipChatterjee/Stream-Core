const musicModel = require('../models/music.model');
const {uploadFile} = require('../services/storage.service');
const jwt = require('jsonwebtoken');

async function createMusic(req, res) {
     const token = req.cookies.token;

     if(!token) {
        return res.status(401).json({message: "Unauthorized"})
     }

     let decoded;

     try {
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(decoded.role !== "artist") {
            return res.status(403).json({message: "You don't have access to create music"});
        }
     } catch (err) {
        return res.status(401).json({message: "Unauthorized"})
     }

     const title = req.body.title;
     const file = req.file;

     const result = await uploadFile(file.buffer.toString('base64'));

     const music = await musicModel.create({
      uri: result.url,
      title,
      artist: decoded._id
     })

     res.status(201).json({
      message: "Music created successfully",
      music: {
         id: music._id,
         uri: music.uri,
         title: music.title,
         artist: music.artist
      }
     })
}

module.exports = { createMusic };