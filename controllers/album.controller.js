const express = require('express');
const { AlbumService } = require('../services/album.service');
const authenticateRequest = require('../middlewares/authenticateRequest');

class AlbumController {
    constructor() {
        this.path = '/albums';
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/', authenticateRequest, this.getAllAlbums);
        this.router.get('/:id', authenticateRequest, this.getAlbumById);
        this.router.post('/add-album', authenticateRequest, this.addAlbum);
        this.router.put('/:id', authenticateRequest, this.updateAlbum);
        this.router.delete('/:id', authenticateRequest, this.deleteAlbum);
    }

    async getAllAlbums(req, res, next) {
        try {
            const data = await AlbumService.getAllAlbums(req);
            res.status(200).json({
                status: 200,
                data,
                message: 'Albums retrieved successfully.',
                error: null,
            });
        } catch (error) {
            console.log('Error fetching albums: ', error.message);
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

    async getAlbumById(req, res, next) {
        try {
            const data = await AlbumService.getAlbumById(req);
            res.status(200).json({
                status: 200,
                data,
                message: 'Album retrieved successfully.',
                error: null,
            });
        } catch (error) {
            console.log('Error fetching album: ', error.message);
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

    async addAlbum(req, res, next) {
        try {
            await AlbumService.addAlbum(req);
            res.status(201).json({
                status: 201,
                data: null,
                message: 'Album created successfully.',
                error: null,
            });
        } catch (error) {
            console.error('Error Adding album: ', error.message);
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

    async updateAlbum(req, res, next) {
        try {
            await AlbumService.updateAlbum(req);
            res.status(204).json({
                status: 204,
                data: null,
                message: 'Album updated successfully.',
                error: null,
            });
        } catch (error) {
            console.log('Error updating album: ', error.message);
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

    async deleteAlbum(req, res, next) {
        try {
            const albumName = await AlbumService.deleteAlbum(req);
            res.status(200).json({
                status: 200,
                data: null,
                message: `Album: ${albumName} deleted successfully.`,
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

exports.AlbumController = AlbumController
