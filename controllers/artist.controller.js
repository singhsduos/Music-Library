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
        this.router.post('/add-artist', authenticateRequest, this.addArtist);
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
}

exports.ArtistController = ArtistController
