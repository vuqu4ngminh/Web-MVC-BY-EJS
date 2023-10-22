import connection from '../database/connectDB'

// display list
const handleHomePage = async (req,res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM laptop');
        return res.render("homeUser.ejs",{data: rows, activeTab: 'home', message: req.flash('message')});
    } catch (error) {
        console.log(error);
        return res.render("homeUser.ejs",{activeTab: 'home'});
    }
}

// sort
const sortPrice = async (req,res) => {
    let value = req.params.value
    if(value == 'asc'){
        const [rows] = await connection.execute('SELECT * FROM laptop ORDER BY price ASC');
        return res.render("homeUser.ejs",{data: rows, activeTab: 'home', message: req.flash('message')});
    }
    const [rows] = await connection.execute('SELECT * FROM laptop ORDER BY price DESC');
    return res.render("homeUser.ejs",{data: rows, activeTab: 'home', message: req.flash('message')});
}
const sortName = async (req,res) => {
    let value = req.params.value
    if(value == 'asc'){
        const [rows] = await connection.execute('SELECT * FROM laptop ORDER BY name ASC');
        return res.render("homeUser.ejs",{data: rows, activeTab: 'home', message: req.flash('message')});
    }
    const [rows] = await connection.execute('SELECT * FROM laptop ORDER BY name DESC');
    return res.render("homeUser.ejs",{data: rows, activeTab: 'home', message: req.flash('message')});
}
const sortStatus = async (req,res) => {
    let value = req.params.value
    if(value == '1'){
        const [rows] = await connection.execute('SELECT * FROM laptop WHERE status = ? ORDER BY price ASC',["1"]);
        return res.render("homeUser.ejs",{data: rows, activeTab: 'home', message: req.flash('message')});
    }
    const [rows] = await connection.execute('SELECT * FROM laptop WHERE status = ? ORDER BY price ASC',["0"]);
    return res.render("homeUser.ejs",{data: rows, activeTab: 'home', message: req.flash('message')});
}

// search result
const searchName = async (req,res) => {
    let name = req.body.search
    try {
        const [rows] = await connection.execute('SELECT * FROM laptop WHERE name LIKE ?', [`%${name}%`]);
        return res.render("searchUser.ejs",{data: rows, activeTab: 'home', result: name})
    } catch (error) {
        console.log(error);
    }
}

// display laptop detail
const detailLaptop = async (req,res) => {
    let id = req.params.id
    try {
        const [rows] = await connection.execute('SELECT * FROM laptop WHERE id = ?',[id]);
        return res.render('detailLaptop.ejs',{data: rows, activeTab: 'home'})
    } catch (error) {
        console.log(error);
    }
}

const handleLoginPage = (req,res) => {
    return res.render("login.ejs",{message: req.flash('message'), activeTab: 'login'})
}

module.exports = {
    handleHomePage,
    handleLoginPage,
    sortPrice,
    sortName,
    sortStatus,
    searchName,
    detailLaptop
}