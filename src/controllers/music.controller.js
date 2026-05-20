const musicModel = reqire('../models/music.model');

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
     } catch (err) {
        return res.status(401).json({message: "Unauthorized"})
     }

     const {title} = req.body.title;
     const file = req.file;
}

exports.module = {uploadMusic};