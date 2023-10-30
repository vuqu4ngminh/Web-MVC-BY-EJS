import { db } from '../db'

//DISPLAY ADMIN LAPTOP CONTROLLER
const displayAdminLaptopPage = async (req, res) => {
    try {
        if (req.session.loggedin) {
            const [rows] = await db.execute('SELECT * FROM laptop');
            return res.render("adminLaptop.ejs",{data: rows, loggedin: req.session.loggedin})
        } else {
            return res.render("accessDenied.ejs")
        }

    } catch (error) {
        console.log(error);
    }
}

//DISPLAY ADMIN ORDER CONTROLLER
const displayAdminOrderPage = async (req,res) => {
    try {
        if (req.session.loggedin) {
            const [rows] = await db.execute("SELECT * FROM `order`");
            return res.render("adminOrder.ejs",{data: rows, loggedin: req.session.loggedin})
        } else {
            return res.render("accessDenied.ejs")
        }
    } catch (error) {
        console.log(error);
    }
}


//LOGIN 
const displayLoginForm = (req, res) => {
    return res.render("login.ejs")
}

const authLogin = (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username == 'admin' && password == '1') {
        req.session.loggedin = true;
        req.session.username = username;

        return res.redirect("/")
    } else {

    }
}

const authLogout = (req, res) => {
    req.session.destroy()
    res.redirect("/")
}

module.exports = {
    displayLoginForm,
    authLogin,
    authLogout,
    displayAdminLaptopPage,
    displayAdminOrderPage
}