import express from "express";
import userController from "../controller/userController";
import adminController from "../controller/adminController";
import laptopController from "../controller/laptopController";

const router = express.Router()

const isAdmin = (req,res,next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    } else {
        return res.render("unauthorized.ejs");
    }
}
const initWebRoutes = (app) => {
    // routes
    router.get("/", userController.handleHomePage)
    router.get("/admin", userController.handleLoginPage)
    router.get("/cart", userController.handleCartPage)
    router.get("/contact", userController.handleContactPage)
    router.post('/admin/login', adminController.loginAdmin)

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

    return app.use("/", router)
}

export default initWebRoutes;