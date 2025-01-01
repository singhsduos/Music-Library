const mongoose = require("mongoose");
const { Favorite } = require('../models/favorite.model');
const { Artist } = require('../models/artist.model');
const { Album } = require('../models/album.model');
const { Track } = require('../models/track.model');

class FavoritesService {
    checkRequiredFields(fields, requiredFields) {
        requiredFields.forEach(field => {
            if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
                throw new ErrorHandler(400, `Bad Request. Missing or empty required field: ${field}`);
            }
        });
    }

    async getFavorites(req, category) {
        try {
            const userId = req.user._id;
            const { limit = 5, offset = 0 } = req.query;

            if (!['artist', 'album', 'track'].includes(category)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid category.');
            }

            const favorites = await Favorite.aggregate([
                { $match: { user_id: mongoose.Types.ObjectId(userId), category } },
                {
                    $lookup: {
                        from: `${category}s`, 
                        localField: 'item_id',
                        foreignField: '_id',
                        as: 'itemDetails'
                    }
                },
                { $unwind: '$itemDetails' },
                {
                    $project: {
                        favorite_id: '$_id',
                        category: 1,
                        item_id: 1,
                        name: '$itemDetails.name',
                        created_at: '$createdAt'
                    }
                },
                { $skip: parseInt(offset) },
                { $limit: parseInt(limit) }
            ]);

            return favorites;
        } catch (error) {
            console.error('Error fetching favorites:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async addFavorite(req) {
        try {
            const userId = req.user._id;
            const { category, item_id } = req.body;

            this.checkRequiredFields(req.body, ['category', 'item_id']);

            if (!['artist', 'album', 'track'].includes(category)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid category.');
            }

            if (!mongoose.Types.ObjectId.isValid(item_id)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid item_id.');
            }

            let item;
            if (category === 'artist') {
                item = await Artist.findById(item_id);
            } else if (category === 'album') {
                item = await Album.findById(item_id);
            } else if (category === 'track') {
                item = await Track.findById(item_id);
            }

            if (!item) {
                throw new ErrorHandler(404, "Resource doesn't exist");
            }

            const favoriteExists = await Favorite.findOne({ user_id: userId, category, item_id });
            if (favoriteExists) {
                throw new ErrorHandler(400, 'Favorite already exists.');
            }

            const favorite = new Favorite({
                user_id: userId,
                category,
                item_id,
                name: item.name
            });

            await favorite.save();
        } catch (error) {
            console.error('Error adding favorite:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async removeFavorite(req) {
        try {
            const userId = req.user._id;
            const { id } = req.params;

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid favorite ID.');
            }

            const favorite = await Favorite.findOne({ _id: id, user_id: userId });
            if (!favorite) {
                throw new ErrorHandler(404, "Resource doesn't exist or does not belong to this user.");
            }

            await Favorite.findByIdAndDelete(id);
        } catch (error) {
            console.error('Error removing favorite:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }
}

exports.FavoritesService = new FavoritesService();
