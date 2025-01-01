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
},
{
    timestamps: true
});

module.exports = {
    Album: mongoose.model('Album', AlbumSchema)
};
