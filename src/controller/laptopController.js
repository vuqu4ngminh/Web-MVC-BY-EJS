import { db } from '../db'

//DELETE LAPTOP
const deleteLaptop = (req, res) => {
    let id = req.params.id
    try {
        db.execute('DELETE FROM laptop WHERE id = ?', [id]);
        return res.redirect("/admin")
    } catch (error) {
        console.log(error);
    }
}

//DISPLAY LIST OF LAPTOP
const displayAllLaptop = async (req,res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM laptop');
        return res.render("home.ejs",{data: rows, loggedin: req.session.loggedin})
    } catch (error) {
        console.log(error);
    }
}

//CREATE LAPTOP
const displayAddForm = (req, res) => {
    return res.render("add.ejs", {loggedin: req.session.loggedin})
}

const addLaptop = async (req, res) => {
    let name = req.body.name
    let price = req.body.price
    let description = req.body.description
    let img = req.body.image
    let status = req.body.status

    try {
        await db.execute('INSERT INTO laptop (name, price, description, img, status) VALUES (?, ?, ?, ?)', [name, price, description, img, status])
    } catch (error) {
        console.log(error)
    }
    return res.redirect('/')
}

//DISPLAY DETAIL OF LAPTOP
const getLaptopById = async (req, res) => {
    let lapId = req.params.id;
    try {
        
        const [rows, fields] = await db.execute('SELECT * FROM laptop WHERE id = ?', [lapId]);
        return res.render('detail.ejs',{laptop: rows,  loggedin: req.session.loggedin})
    } catch (error) {
        console.log(error)
    }
    // return res.render('detail.ejs',{laptop: rows})
}


//UPDATE LAPTOP
const updateLaptopForm = async (req, res) => {
    let lapId = req.params.id;
    try {
        
        const [rows, fields] = await db.execute('SELECT * FROM laptop WHERE id = ?', [lapId]);
        return res.render('update.ejs',{laptop: rows, loggedin: req.session.loggedin})
    } catch (error) {
        console.log(error)
    }
}

const updateLaptop = async (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let price = req.body.price;
    let description = req.body.description;
    let img = req.body.image;
    let status = req.body.status

    try {
        await db.execute('UPDATE laptop SET name = ?, price = ?, description = ?, img = ?, status = ? WHERE id = ?', [name, price, description, img, status, id]);
        return res.redirect('/')
    } catch (error) {
        console.log(error)
    }    
}

module.exports = {
    deleteLaptop,
    addLaptop,
    displayAddForm,
    getLaptopById,
    displayAllLaptop,
    updateLaptop,
    updateLaptopForm
}