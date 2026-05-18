const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    }
});

const musicModel = mongoose.model('musics', musicSchema)

module.exports = musicModel;