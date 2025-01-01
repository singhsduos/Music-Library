const mongoose = require("mongoose");

const TrackSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    hidden: {
        type: Boolean,
        default: false
    },
    artist_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Artist',
        required: true
    },
    album_id: {
        type: mongoose.Types.ObjectId,
        ref: 'Album',
        required: true
    }
},
{
    timestamps: true
});

module.exports = {
    Track: mongoose.model('Track', TrackSchema)
};
