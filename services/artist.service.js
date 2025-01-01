const { Artist } = require('../models/artist.model');

class ArtistService {
    checkRequiredFields(fields, requiredFields) {
        requiredFields.forEach(field => {
            if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
                throw new ErrorHandler(400, `Bad Request. Missing or empty required field: ${field}`);
            }
        });
    }

    async addArtist(req) {
        try {
            const { name, grammy, hidden } = req.body;

            this.checkRequiredFields({name}, ['name']);

            if (grammy && typeof grammy !== 'boolean' && typeof grammy !== 'number') {
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
