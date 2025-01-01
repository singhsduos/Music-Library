const express = require('express');
const { ArtistService } = require('../services/artist.service');
const authenticateRequest = require('../middlewares/authenticateRequest');

class ArtistController {
    constructor() {
        this.path = '/artists';
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', authenticateRequest, this.getArtists);
        this.router.get('/:id', authenticateRequest, this.getArtistById);
        this.router.post('/add-artist', authenticateRequest, this.addArtist);
        this.router.put('/:id', authenticateRequest, this.updateArtist);
        this.router.delete('/:id', authenticateRequest, this.deleteArtist);
    }

    async getArtists(req, res, next) {
        try {
            const artists = await ArtistService.getArtists(req);
            res.status(200).json({
                status: 200,
                data: artists,
                message: "Artists retrieved successfully.",
                error: null,
            });
        } catch (error) {
            console.log('Error fetching artists: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json(
                    {
                        "status": error.statusCode,
                        "data": null,
                        "message": error.message,
                        "error": null
                    }
                );
            }
            next(error);
        }
    }

    async getArtistById(req, res, next) {
        try {
            const artist = await ArtistService.getArtistById(req);
            res.status(200).json({
                status: 200,
                data: artist,
                message: "Artist retrieved successfully.",
                error: null,
            });
        } catch (error) {
            console.log('Error fetching artist: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json(
                    {
                        "status": error.statusCode,
                        "data": null,
                        "message": error.message,
                        "error": null
                    }
                );
            }
            next(error);
        }
    }
    
    async addArtist(req, res, next) {
        try {
            const result = await ArtistService.addArtist(req);

            res.status(201).json({
                status: 201,
                data: null,
                message: 'Artist created successfully.',
                error: null,
            });
        } catch (error) {
            console.error('Error Adding Artist: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json({
                    status: error.statusCode,
                    data: null,
                    message: error.message,
                    error: null,
                });
            }
            next(error);
        }
    }

    async updateArtist(req, res, next) {
        try {
            await ArtistService.updateArtist(req);
            res.status(204).json({
                status: 204,
                data: null,
                message: 'Artist updated successfully.',
                error: null,
            });
        } catch (error) {
            console.log('Error updating artist: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json(
                    {
                        "status": error.statusCode,
                        "data": null,
                        "message": error.message,
                        "error": null
                    }
                );
            }
            next(error);
        }
    }

    async deleteArtist(req, res, next) {
        try {
            const { artistId, artistName } = await ArtistService.deleteArtist(req);

            res.status(200).json({
                status: 200,
                data: { artist_id: artistId },
                message: `Artist: ${artistName} deleted successfully.`,
                error: null,
            });
        } catch (error) {
            console.error('Error deleting artist:', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json({
                    status: error.statusCode,
                    data: null,
                    message: error.message,
                    error: null,
                });
            }
            next(error);
        }
    }
}

exports.ArtistController = ArtistController
