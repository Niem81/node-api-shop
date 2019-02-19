'use strict';

const express = require('express');
const api = express.Router();

// variable para ingresar los middleware usados
// isLoggedInMiddleware servira para validar que el usuario se encuentre con sesion iniciada
const middleWr = require('../middlewares/middleware');

// conexion con el User Controller y rutas para usuario
const UserCntrl = require('../controllers/user');

api.get('/user', UserCntrl.getUsers);
api.get('/user/:userId', UserCntrl.getUser);
api.post('/user', UserCntrl.createUser);
api.put('/user/:userId', middleWr.isLoggedInMiddleware, UserCntrl.updateUser);
api.delete('/user/:userId', middleWr.isLoggedInMiddleware, UserCntrl.deleteUser);

// rutas para platos
const ProductCntrl = require('../controllers/product');

api.get('/product', ProductCntrl.getDishes);
api.get('/product/:productId', ProductCntrl.getDish);
api.post('/product', ProductCntrl.saveDish);
api.put('/product/:productId', ProductCntrl.updateDish);
api.delete('/product/:productId', ProductCntrl.deleteDish);

// rutas para pedidos
const OrderCntrl = require('../controllers/order');

api.get('/order', OrderCntrl.getOrders);
api.get('/order/:ingredientId', OrderCntrl.getOrder);
api.post('/order', OrderCntrl.saveOrder);
api.put('/order/:ingredientId', OrderCntrl.updateOrder);
api.delete('/order/:ingredientId', OrderCntrl.deleteOrder);

// rutas para autenticacion y registro de usuario
const passport = require('../config/authenticate');

api.get('/profile', middleWr.isLoggedInMiddleware, function(req, res){
    res.redirect('/');
});

api.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) {
            return next(err);
        }
        req.logIn(user, function(err) {
            return res.json(user);
        });
    })(req, res, next);
});

api.get('/logout', function(req, res){
    req.logout();
    res.send('Logout Ok');
});
