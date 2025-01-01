const mongoose = require("mongoose");

const AlbumSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    year: {
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
    }

},
{
    timestamps: true
});

module.exports = {
    Album: mongoose.model('Album', AlbumSchema)
};
