const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    category: {
        type: String,
        enum: ['artist', 'album', 'track'],
        required: true
    },
    item_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: 'category'
    },
    user_id: {
        type: mongoose.Types.ObjectId,
        required: true,
        refPath: 'User'
    },
},
{
    timestamps: true
});

module.exports = {
    Favorite: mongoose.model('Favorite', FavoriteSchema)
};
