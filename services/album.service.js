const mongoose = require("mongoose");
const { Album } = require('../models/album.model');
const { Artist } = require('../models/artist.model');


class AlbumService {
    checkRequiredFields(fields, requiredFields) {
        requiredFields.forEach(field => {
            if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
                throw new ErrorHandler(400, `Bad Request. Missing or empty required field: ${field}`);
            }
        });
    }
    async getAllAlbums(req) {
        try {
            const { limit = 5, offset = 0, artist_id, hidden, year } = req.query;
            const filter = {};

            if (artist_id) filter.artist_id = mongoose.Types.ObjectId(artist_id);
            if (hidden !== undefined) filter.hidden = hidden;
            if (year) filter.year = year

            const albums = await Album.find(filter)
                .skip(Number(offset))
                .limit(Number(limit));

            return albums;
        } catch (error) {
            console.error('Error fetching albums:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }

    }

    async getAlbumById(req) {
        try {
            const { id: albumId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(albumId)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid Album ID.');
            }

            const album = await Album.findById(albumId);

            if (!album) {
                throw new ErrorHandler(404, "Resource Doesn't Exist");
            }

            return album;
        } catch (error) {
            console.error('Error fetching album:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }


    }

    async addAlbum(req) {
        const { artist_id, name, year, hidden } = req.body;

        this.checkRequiredFields({ name, artist_id, year }, ['name', 'artist_id', 'year']);


        if (!mongoose.Types.ObjectId.isValid(artist_id)) {
            throw new ErrorHandler(400, 'Bad Request: Invalid Artist ID.');
        }

        const artist = await Artist.findById(artist_id);
        if (!artist) {
            throw new ErrorHandler(404, 'Artist not found.');
        }

        const newAlbum = new Album({ artist_id, name, year, hidden });
        await newAlbum.save();
    }

    async updateAlbum(req) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const allowedFields = ['name', 'year', 'hidden', 'artist_id'];
            const invalidFields = Object.keys(updateData).filter(field => !allowedFields.includes(field));

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid Album ID.');
            }

            if (invalidFields.length > 0) {
                throw new ErrorHandler(400, `Bad Request: Invalid fields provided - ${invalidFields.join(', ')}`);
            }

            if (!Object.keys(updateData).length) {
                throw new ErrorHandler(400, 'Bad Request: No data provided for update.');
            }

            const updatedAlbum = await Album.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedAlbum) {
                throw new ErrorHandler(404, "Resource not found.");
            }


            return true;
        } catch (error) {
            console.error('Error updating album:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async deleteAlbum(req) {
        try {
            const { id: albumId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(albumId)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid Album ID.');
            }

            const album = await Album.findById(albumId);
            if (!album) {
                throw new ErrorHandler(404, "Resource Doesn't Exist");
            }

            const albumName = album.name;
            await Album.findByIdAndDelete(albumId);

            return albumName;
        } catch (error) {
            console.error('Error deleting album:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }
}

exports.AlbumService = new AlbumService();
