const musicModel = require('../models/music.model');
const albumModel = require('../models/album.model');
const {uploadFile} = require('../services/storage.service');
const jwt = require('jsonwebtoken');

async function createMusic(req, res) {
     const token = req.cookies.token;

     if(!token) {
        return res.status(401).json({message: "Unauthorized"})
     }

     try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if(decoded.role !== "artist") {
            return res.status(403).json({message: "You don't have access to create music"});
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
        
     } catch (err) {
        return res.status(401).json({message: "Unauthorized"})
     }

}

async function createAlbum(req, res) {
   const token = req.cookies.token;


   if(!token) {
      return res.status(401).json({message: "Unauthorized"});
   }

   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.role != 'artist') {
         return res.status(403).json({message: "You don't have access to create an album"});
      }

      const {title, musicIds} = req.body;

      const album = await albumModel.create({
         title,
         artist: decoded.id,
         musics: musics
      })

      res.status(201).json({
         message: "Album created successfully",
         album: {
            id: album._id,
            title:album.title,
            artist: album.artist,
            music: album.musics
         }
      })
   } catch(err) {
      console.log(err);
      return res.status(401).json({message: "Unauthorized"});
   }
}

module.exports = { createMusic, createAlbum };