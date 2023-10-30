import { db } from '../db'
// DISPLAY GET ORDER FORM
const displayGetOrder = (req, res) => {
    if (req.session.loggedin) {
        return res.render("cartInfo.ejs", { loggedin: req.session.loggedin })
    } else {
        return res.render("accessDenied.ejs")
    }

}


//GET USER ORDER
const getOrder = async (req, res) => {
    let name = req.body.name
    let phone = req.body.phone
    let email = req.body.email
    let address = req.body.address

    const cart = req.session.cart

    try {
        const [result] = await db.execute("INSERT INTO `order` (customerName, phone, email, address) VALUES (?, ?, ?, ?)", [name, phone, email, address])

        const orderLapid = result.insertId

        for (const item of cart) {
            const { amount, id, total } = item;

            await db.execute("INSERT INTO `orderlaptop` (amount, laptopId, total, id) VALUES (?, ?, ?, ?)", [amount, id, total, orderLapid])
        }

        req.session.cart = []

        return res.redirect("/")

    } catch (error) {
        console.log(error)
    }

}

//DELETE ORDER
const deleteOrder = (req, res) => {
    let id = req.params.id
    try {
        db.execute('DELETE FROM `order` WHERE id = ?', [id]);
        return res.redirect("/admin/order")
    } catch (error) {
        console.log(error);
    }
}

//GET ORDER BY ID
const getOrderById = async (req, res) => {
    let orderId = req.params.id;

    try {
        const [rows, fields] = await db.execute('SELECT * FROM `orderlaptop` WHERE id = ?', [orderId]);

        const lapId = rows.map(item => item.laptopId)

        const names = []

        for (const id of lapId) {
            const [nameRows, namefields] = await db.execute('SELECT name FROM `laptop` WHERE id = ?', [id]);

            names.push(nameRows[0].name)
        }

        return res.render('orderDetail.ejs', { data: rows, name: names, loggedin: req.session.loggedin })
    } catch (error) {
        console.log(error)
    }

}

module.exports = {
    displayGetOrder,
    getOrder,
    deleteOrder,
    getOrderById
}