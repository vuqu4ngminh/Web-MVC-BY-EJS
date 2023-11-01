import express from "express";
import userController from "../controller/userController";
import adminController from "../controller/adminController";
import laptopController from "../controller/laptopController";
import cartController from '../controller/cartController';
import orderController from '../controller/orderController';

const router = express.Router()

const isAdmin = (req,res,next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    } else {
        return res.render("notFound.ejs");
    }
}
const createCart = (req,res,next) => {
    req.session.orderStatus = false
    if(!req.session.cart){
        req.session.cart = []
    }
    return next();
}
const initWebRoutes = (app) => {
    // create a cart in session
    router.use(createCart)
    // user routes
    router.get("/", userController.handleHomePage)
    router.get("/cart", cartController.displayCart)
    router.post('/cart/add', cartController.addToCart)
    router.post('/cart/delete/:id', cartController.deleteItem)
    router.post('/cart/up/:id', cartController.upAmount)
    router.post('/cart/down/:id', cartController.downAmount)
    router.post('/admin/login', adminController.loginAdmin)
    router.get("/admin", userController.handleLoginPage)
    router.get('/:id', userController.detailLaptop)
    // sort
    router.get('/price/:value', userController.sortPrice)
    router.get('/name/:value', userController.sortName)
    router.get('/status/:value', userController.sortStatus)
    // search
    router.post('/search', userController.searchName)
    // order confirmation
    router.get('/cart/order', orderController.displayAddForm)
    router.post('/cart/order/add', orderController.addOrder)
    router.get('/cart/order/success', orderController.displayOrderSuccess)
    // check admin
    router.use(isAdmin)
    // admin (protected routes)
    router.post('/admin/logout', adminController.logoutAdmin)
    router.get('/admin/home',adminController.homeAdmin)
    router.get('/admin/laptop', laptopController.getAllLaptop)
    router.post('/admin/laptop', laptopController.searchLaptopById)
    router.get('/admin/laptop/add', laptopController.displayAddForm)
    router.post('/admin/laptop/add', laptopController.addLaptop)
    router.get('/admin/laptop/update/:id', laptopController.displayUpdateForm)
    router.post('/admin/laptop/update', laptopController.updateLaptop)
    router.post('/admin/laptop/delete/:id', laptopController.deleteLaptop)
    router.get('/admin/order', orderController.displayAllOrder)
    router.get('/admin/order/:value', orderController.displayAllOrderByStatus)
    router.post('/admin/order', orderController.searchOrderById)
    router.get('/admin/order/update/:id', orderController.displayDetailOrder)
    router.post('/admin/order/update/:id', orderController.updateOrder)
    router.post('/admin/order/delete/:id', orderController.deleteOrder)
    router.get('/admin/update', adminController.displayUpdateForm)
    router.post('/admin/update', adminController.updateAdmin)

    return app.use("/", router)
}

export default initWebRoutes;
