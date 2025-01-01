const mongoose = require("mongoose");

const ArtistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    grammy: {
        type: Number,
        default: 0
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
    Artist: mongoose.model('Artist', ArtistSchema)
};
