const express = require('express');
const { FavoritesService } = require('../services/favorite.service');
const authenticateRequest = require('../middlewares/authenticateRequest');

class FavoritesController {
    constructor() {
        this.path = '/favorites';
        this.router = express.Router();
        this.initRoutes();
    }

    initRoutes() {
        this.router.get('/:category', authenticateRequest, this.getFavorites);
        this.router.post('/add-favorite', authenticateRequest, this.addFavorite);
        this.router.delete('/remove-favorite/:id', authenticateRequest, this.removeFavorite);
    }

    async getFavorites(req, res, next) {
        try {
            const { category } = req.params;
            const data = await FavoritesService.getFavorites(req, category);
            res.status(200).json({
                status: 200,
                data,
                message: 'Favorites retrieved successfully.',
                error: null,
            });
        } catch (error) {
            console.error('Error fetching favorites: ', error.message);
            if (error instanceof ErrorHandler) {
                return res.status(error.statusCode).json({
                    status: error.statusCode,
                    data: null,
                    message: error.message,
                    error: null
                });
            }
            next(error);
        }
    }

    async addFavorite(req, res, next) {
        try {
            await FavoritesService.addFavorite(req);
            res.status(201).json({
                status: 201,
                data: null,
                message: 'Favorite added successfully.',
                error: null,
            });
        } catch (error) {
            console.error('Error adding favorite: ', error.message);
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

    async removeFavorite(req, res, next) {
        try {
            await FavoritesService.removeFavorite(req);
            res.status(200).json({
                status: 200,
                data: null,
                message: 'Favorite removed successfully.',
                error: null,
            });
        } catch (error) {
            console.error('Error removing favorite: ', error.message);
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

exports.FavoritesController = FavoritesController;
