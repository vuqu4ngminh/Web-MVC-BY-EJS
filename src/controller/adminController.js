import pool from '../database/connectDB'
import CryptoJS from 'crypto-js';
// login
const loginAdmin = async (req,res) => {
    let password = req.body.password
    let username = req.body.username
    try {
        const [rows] = await pool.execute('SELECT * FROM admin WHERE username = ? AND password = ?', [username, CryptoJS.MD5(password).toString()]);
        if(rows.length == 1){
            req.session.isAdmin = true;
            return res.redirect('/admin/home')
        } else {
            req.flash('message', 'Tài khoản hoặc mật khẩu không chính xác');
            return res.redirect("/admin")
        }
        
    } catch (error) {
        console.log(error);
    }
}

// logout admin
const logoutAdmin = (req,res) => {
    req.session.isAdmin = false;
    return res.redirect('/')
}

// home admin
const homeAdmin = async (req,res) => {
    return res.render("homeAdmin.ejs", {activeTab: 'adminHome'})
}

module.exports = {
    loginAdmin,
    logoutAdmin,
    homeAdmin
}