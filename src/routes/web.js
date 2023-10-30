import express from "express";
import laptopController from "../controller/laptopController";
import adminController from "../controller/adminController"
import cartController from "../controller/cartController"
import orderController from "../controller/orderController"

const router = express.Router()

const createCart = (req,res,next) => {
    if(!req.session.cart){
        req.session.cart = []
    }
    return next();
}

const initWebRoutes = (app) => {
    //create a cart in session
    router.use(createCart)

    //display main page
    router.get("/", laptopController.displayAllLaptop)
    router.get("/admin/laptop", adminController.displayAdminLaptopPage)
    router.get('/admin/order', adminController.displayAdminOrderPage)
    

    // laptop
    router.get('/laptop/add', laptopController.displayAddForm)
    router.get('/laptop/detail/:id', laptopController.getLaptopById)
    router.get('/laptop/update/:id', laptopController.updateLaptopForm)

    router.post('/laptop/add', laptopController.addLaptop)
    router.post('/laptop/detail/:id', laptopController.getLaptopById)
    router.post('/laptop/delete/:id', laptopController.deleteLaptop)
    router.post('/laptop/update/:id', laptopController.updateLaptop)

    // auth
    router.get('/auth', adminController.displayLoginForm)
    router.post('/auth/login', adminController.authLogin)
    router.post('/auth/logout', adminController.authLogout)

    // cart
    router.get("/cart", cartController.displayCart)
    router.post('/cart/add', cartController.addToCart)
    router.post('/cart/delete/:id', cartController.deleteItem)
    router.post('/cart/up/:id', cartController.upAmount)
    router.post('/cart/down/:id', cartController.downAmount)
    router.get('/cart/info', orderController.displayGetOrder)
    router.post('/cart/info', orderController.getOrder)

    //order
    router.get('/admin/order/detail/:id', orderController.getOrderById)
    router.post('/admin/order/detail/:id', orderController.getOrderById)
    router.post('/admin/order/delete/:id', orderController.deleteOrder)

    return app.use("/",router)
}

export default initWebRoutes;