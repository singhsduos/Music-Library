const express = require('express');
const { TrackService } = require('../services/track.service');
const authenticateRequest = require('../middlewares/authenticateRequest');

class TrackController {
    constructor() {
        this.path = '/tracks';
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', authenticateRequest, this.getAllTracks);
        this.router.get('/:id', authenticateRequest, this.getTrackById);
        this.router.post('/add-track', authenticateRequest, this.addTrack);
        this.router.put('/:id', authenticateRequest, this.updateTrack);
        this.router.delete('/:id', authenticateRequest, this.deleteTrack);
    }

    async getAllTracks(req, res, next) {
        try {
            const data = await TrackService.getAllTracks(req);
            res.status(200).json({
                status: 200,
                data,
                message: 'Tracks retrieved successfully.',
                error: null,
            });
        } catch (error) {
            console.log('Error fetching tracks: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json({
                    "status": error.statusCode,
                    "data": null,
                    "message": error.message,
                    "error": null
                });
            }
            next(error);
        }
    }

    async getTrackById(req, res, next) {
        try {
            const data = await TrackService.getTrackById(req);
            res.status(200).json({
                status: 200,
                data,
                message: 'Track retrieved successfully.',
                error: null,
            });
        } catch (error) {
            console.log('Error fetching track: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json({
                    "status": error.statusCode,
                    "data": null,
                    "message": error.message,
                    "error": null
                });
            }
            next(error);
        }
    }

    async addTrack(req, res, next) {
        try {
            await TrackService.addTrack(req);
            res.status(201).json({
                status: 201,
                data: null,
                message: 'Track created successfully.',
                error: null,
            });
        } catch (error) {
            console.error('Error Adding track: ', error.message);
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

    async updateTrack(req, res, next) {
        try {
            await TrackService.updateTrack(req);
            res.status(204).json({
                status: 204,
                data: null,
                message: 'Track updated successfully.',
                error: null,
            });
        } catch (error) {
            console.log('Error updating track: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json({
                    "status": error.statusCode,
                    "data": null,
                    "message": error.message,
                    "error": null
                });
            }
            next(error);
        }
    }

    async deleteTrack(req, res, next) {
        try {
            const trackName = await TrackService.deleteTrack(req);
            res.status(200).json({
                status: 200,
                data: null,
                message: `Track: ${trackName} deleted successfully.`,
                error: null,
            });
        } catch (error) {
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

exports.TrackController = TrackController;
