import connection from '../database/connectDB'
// display all laptops
const getAllLaptop = async (req,res) => {
    try {
        const [rows] = await connection.execute('SELECT * FROM laptop');
        return res.render('homeLaptop.ejs',{data: rows, searchLaptop: req.flash('search'), deleteLaptop: req.flash('delete'), activeTab: 'adminLaptop'})
    } catch (error) {
        console.log(error);
    }
}

// search laptop by id
const searchLaptopById = async (req,res) => {
    let id = req.body.searchLaptop
    try {
        const [rows] = await connection.execute('SELECT * FROM laptop WHERE id = ?',[id]);
        if(rows.length == 1){
            return res.render('homeLaptop.ejs',{data: rows, searchLaptop: req.flash('search'), deleteLaptop: req.flash('delete'), activeTab: 'adminLaptop'})
        } else {
            req.flash('search', 'Mã laptop không tồn tại');
            return res.redirect("/admin/laptop")
        }
    } catch (error) {
        console.log(error);
    }
}

// delete
const deleteLaptop = async (req, res) => {
    let id = req.params.id
    try {
        await connection.execute('DELETE FROM laptop WHERE id = ?', [id]);
        req.flash('delete', 'Xóa Laptop thành công');
        return res.redirect("/admin/laptop")
    } catch (error) {
        console.log(error);
    }
}

// add laptop
const displayAddForm = (req,res) => {
    return res.render("addLaptop.ejs",{activeTab:'adminLaptop', message: req.flash('message')})
}
const addLaptop = async (req, res) => {
    let name = req.body.name
    let price = req.body.price
    let description = req.body.description
    let img = req.body.image
    let status = req.body.status
    try {
        await connection.execute('INSERT INTO laptop (name, price, description, imageUrl, status) VALUES (?, ?, ?, ?, ?)', [name, price, description, img, status])
        req.flash('message', 'Thêm Laptop thành công');
    } catch (error) {
        console.log(error)
    }
    return res.redirect("/admin/laptop/add")
}

// update laptop
const displayUpdateForm = async (req,res) => {
    let id = req.params.id
    try {
        const [rows] = await connection.execute('SELECT * FROM laptop WHERE id = ?',[id]);
        return res.render("updateLaptop.ejs",{data: rows, activeTab:'adminLaptop', message: req.flash('message')})
    } catch (error) {
        console.log(error);
        return res.redirect("/admin/laptop")
    }
}
const updateLaptop = async (req,res) => {
    let id = req.body.id
    let name = req.body.name
    let price = req.body.price
    let description = req.body.description
    let img = req.body.image
    let status = req.body.status
    try {
        await connection.execute('UPDATE laptop SET name = ?, price = ?, description = ?, imageUrl = ?, status = ? WHERE id = ?', [name, price, description, img, status, id])
        req.flash('message', 'Cập nhật Laptop thành công');
    } catch (error) {
        console.log(error)
    }
    return res.redirect(`/admin/laptop/update/${id}?`)
}

module.exports = {
    updateLaptop,
    deleteLaptop,
    addLaptop,
    displayAddForm,
    displayUpdateForm,
    getAllLaptop,
    searchLaptopById
}