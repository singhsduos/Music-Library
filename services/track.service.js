const mongoose = require("mongoose");
const { Track } = require('../models/track.model');
const { Artist } = require('../models/artist.model');
const { Album } = require('../models/album.model');

class TrackService {
    checkRequiredFields(fields, requiredFields) {
        requiredFields.forEach(field => {
            if (fields[field] === undefined || fields[field] === null || fields[field] === '') {
                throw new ErrorHandler(400, `Bad Request. Missing or empty required field: ${field}`);
            }
        });
    }

    async getAllTracks(req) {
        try {
            const { limit = 5, offset = 0, artist_id, album_id, hidden } = req.query;
            const filter = {};

            if (artist_id) filter.artist_id = mongoose.Types.ObjectId(artist_id);
            if (album_id) filter.album_id = mongoose.Types.ObjectId(album_id);
            if (hidden !== undefined) filter.hidden = hidden;

            const tracks = await Track.find(filter)
            .skip(Number(offset))
            .limit(Number(limit));

            return tracks;
        } catch (error) {
            console.error('Error fetching tracks:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async getTrackById(req) {
        try {
            const { id: trackId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(trackId)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid Track ID.');
            }

            const track = await Track.findById(trackId);

            if (!track) {
                throw new ErrorHandler(404, "Resource Doesn't Exist");
            }

            return track;
        } catch (error) {
            console.error('Error fetching track:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async addTrack(req) {
        const { artist_id, album_id, name, duration, hidden } = req.body;

        this.checkRequiredFields({ name, artist_id, album_id, duration }, ['name', 'artist_id', 'album_id', 'duration']);

        if (!mongoose.Types.ObjectId.isValid(artist_id)) {
            throw new ErrorHandler(400, 'Bad Request: Invalid Artist ID.');
        }

        if (!mongoose.Types.ObjectId.isValid(album_id)) {
            throw new ErrorHandler(400, 'Bad Request: Invalid Album ID.');
        }

        const artist = await Artist.findById(artist_id);
        if (!artist) {
            throw new ErrorHandler(404, 'Artist not found.');
        }

        const album = await Album.findById(album_id);
        if (!album) {
            throw new ErrorHandler(404, 'Album not found.');
        }

        const newTrack = new Track({ artist_id, album_id, name, duration, hidden });
        await newTrack.save();
    }

    async updateTrack(req) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            const allowedFields = ['name', 'duration', 'hidden', 'artist_id', 'album_id'];
            const invalidFields = Object.keys(updateData).filter(field => !allowedFields.includes(field));

            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid Track ID.');
            }

            if (invalidFields.length > 0) {
                throw new ErrorHandler(400, `Bad Request: Invalid fields provided - ${invalidFields.join(', ')}`);
            }

            if (!Object.keys(updateData).length) {
                throw new ErrorHandler(400, 'Bad Request: No data provided for update.');
            }

            const updatedTrack = await Track.findByIdAndUpdate(
                id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            if (!updatedTrack) {
                throw new ErrorHandler(404, "Resource not found.");
            }

            return true;
        } catch (error) {
            console.error('Error updating track:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }

    async deleteTrack(req) {
        try {
            const { id: trackId } = req.params;

            if (!mongoose.Types.ObjectId.isValid(trackId)) {
                throw new ErrorHandler(400, 'Bad Request: Invalid Track ID.');
            }

            const track = await Track.findById(trackId);
            if (!track) {
                throw new ErrorHandler(404, "Resource Doesn't Exist");
            }

            const trackName = track.name;
            await Track.findByIdAndDelete(trackId);

            return trackName;
        } catch (error) {
            console.error('Error deleting track:', error.message);
            throw new ErrorHandler(error.statusCode || 500, error.message, error);
        }
    }
}

exports.TrackService = new TrackService();
