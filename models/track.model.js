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
},
{
    timestamps: true
});

module.exports = {
    Track: mongoose.model('Track', TrackSchema)
};
