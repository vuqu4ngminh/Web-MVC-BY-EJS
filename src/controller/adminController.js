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
    const [revenue] = await pool.execute('SELECT SUM(total) FROM orders WHERE status = ?',["closed"])
    const [orderCompleted] = await pool.execute('SELECT COUNT(id) FROM orders WHERE status = ?',["closed"])
    const [orderOpen] = await pool.execute('SELECT COUNT(id) FROM orders WHERE status = ?',["open"])
    const [orderAborted] = await pool.execute('SELECT COUNT(id) FROM orders WHERE status = ?',["aborted"])
    const [laptopSold] = await pool.execute(`
        SELECT SUM(amount) 
        FROM orders_laptops 
        INNER JOIN orders ON orders_laptops.orderId = orders.id
        WHERE orders.status = ?
    `,["closed"])
    const rows = {
        revenue: Object.values(revenue[0])[0],
        orderCompleted: Object.values(orderCompleted[0])[0],
        orderOpen: Object.values(orderOpen[0])[0],
        orderAborted: Object.values(orderAborted[0])[0],
        laptopSold: Object.values(laptopSold[0])[0],
    }
    return res.render("homeAdmin.ejs", {data: rows, activeTab: 'adminHome'})
}

// update
const displayUpdateForm = (req,res) => {
    return res.render("updateAdmin.ejs", {activeTab: 'adminInfo', message: req.flash('message'), error: req.flash('error')})
}
const updateAdmin = async (req,res) => {
    let newPassword = CryptoJS.MD5(req.body.newPassword).toString()
    let confirmPassword = CryptoJS.MD5(req.body.confirmPassword).toString()
    let currentPassword = CryptoJS.MD5(req.body.currentPassword).toString()
    const [rows] = await pool.execute('SELECT * FROM admin WHERE password = ?', [currentPassword]);
    if(rows.length == 1){
        if(newPassword == confirmPassword){
            await pool.execute('UPDATE admin SET password = ? WHERE id = ?',[newPassword, rows[0].id]);
            req.flash('message', 'Đổi mật khẩu thành công');
            return res.redirect('/admin/update')
        } else {
            req.flash('error', 'Mật khẩu mới và xác nhận mật khẩu không trùng nhau');
            return res.redirect('/admin/update')
        }
    } else {
        req.flash('error', 'Mật khẩu hiện tại không chính xác');
        return res.redirect('/admin/update')
    }
}

module.exports = {
    loginAdmin,
    logoutAdmin,
    homeAdmin,
    displayUpdateForm,
    updateAdmin
}