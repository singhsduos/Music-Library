const mongoose = require("mongoose");
const { Artist } = require('../models/artist.model');


class ArtistService {
    checkRequiredFields(fields, requiredFields) {
        requiredFields.forEach(field => {
            if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
                throw new ErrorHandler(400, `Bad Request. Missing or empty required field: ${field}`);
            }
        });
    }

    async getArtists(req) {
        try {
            const { limit, offset, grammy, hidden } = req.query;
            let filter = {};

            if (grammy) {
                filter.grammy = grammy;
            }

            if (hidden !== undefined) {
                filter.hidden = hidden === 'true';
            }

            const artists = await Artist.find(filter)
            .skip(parseInt(offset) || 0)
            .limit(parseInt(limit) || 5);

            return artists;
        } catch (error) {
            console.error('Error fetching artists:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async getArtistById(req) {
        try {
            const { id: artistId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(artistId)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid Artist ID.');
            }

            const artist = await Artist.findById(artistId);

            if (!artist) {
                throw new ErrorHandler(404, 'Artist not found.');
            }

            return artist;
        } catch (error) {
            console.error('Error fetching artist:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async addArtist(req) {
        try {
            const { name, grammy, hidden } = req.body;

            this.checkRequiredFields({name}, ['name']);

            if (typeof grammy !== 'number') {
                throw new ErrorHandler(400, 'Bad Request. Invalid value for grammy field.');
            }

            if (hidden && typeof hidden !== 'boolean' && typeof hidden !== 'number') {
                throw new ErrorHandler(400, 'Bad Request. Invalid value for hidden field.');
            }

            const newArtist = new Artist({
                name,
                grammy,
                hidden,
            });

            await newArtist.save();
            return newArtist;
        } catch (error) {
            console.error('Error in addArtist service:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

}

exports.ArtistService = new ArtistService();
