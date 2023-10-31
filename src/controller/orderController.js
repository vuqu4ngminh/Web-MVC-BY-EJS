import connection from "../database/connectDB"

const createId = () => {
    let value = 0;
    do {
        value = Math.floor(Math.random() * 2147483648)
    } while (value > 2147483647);
    return value;
}
const checkPhone = (phone) => {
    const t = /^0\d{9}$/;
    return t.test(phone);
}
const getCurrentDate = () => {
    let currentDate = new Date();
    return currentDate.toISOString().slice(0, 19).replace('T', ' ');
}

// display order form
const displayAddForm = (req, res) => {
    if (req.session.cart.length == 0) {
        return res.render("notFound.ejs");
    } else {
        return res.render('addOrder.ejs', { activeTab: 'cart', error: req.flash('error') })
    }
}
// display order success
const displayOrderSuccess = (req, res) => {
    if (req.session.orderStatus == true) {
        return res.render('orderSuccess.ejs', { activeTab: 'cart' })
    } else {
        return res.render("notFound.ejs");
    }
}
// add order
const addOrder = async (req, res) => {
    if (req.session.cart.length == 0) {
        return res.render("notFound.ejs");
    } else {
        let totalOrder = 0;
        for (const item of req.session.cart) {
            totalOrder += item.total
        }
        try {
            let id = createId();
            let name = req.body.client.toUpperCase()
            let phone = req.body.phone
            let address = req.body.address
            let email = req.body.email
            let date = getCurrentDate()
            let status = "open"
            if (!checkPhone(phone)) {
                req.flash('error', 'Số điện thoại không đúng định dạng vui lòng điền lại');
                return res.redirect("/cart/order")
            } else {
                await connection.execute("INSERT INTO orders (id, phone, email, customerName, address, orderDate, total, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [id, phone, email, name, address, date,totalOrder, status]);
                for (const item of req.session.cart) {
                    let laptopId = item.id
                    let total = item.total
                    let amount = item.amount
                    await connection.execute("INSERT INTO orders_laptops (orderId, laptopId, total, amount) VALUES (?, ?, ?, ?)", [id, laptopId, total, amount]);
                }
                req.session.cart = []
                req.session.orderStatus = true;
                return res.render("orderSuccess.ejs", { activeTab: 'cart' })
            }
        } catch (error) {
            console.log(error);
        }
    }
}

// display order admin
const displayAllOrder = async (req, res) => {
    const [rows] = await connection.execute('SELECT * FROM orders ORDER BY orderDate DESC');
    return res.render("homeOrder.ejs", { data: rows, activeTab: 'adminOrder', searchOrder: req.flash('search'), completeOrder: req.flash('confirm')});
}

// search order
const searchOrderById = async (req,res) => {
    let id = req.body.searchOrder
    try {
        const [rows] = await connection.execute('SELECT * FROM orders WHERE id = ?',[id]);
        if(rows.length == 1){
            return res.render("homeOrder.ejs", { data: rows, activeTab: 'adminOrder', searchOrder: req.flash('search'), completeOrder: req.flash('confirm')});
        } else {
            req.flash('search', 'Mã đơn hàng không tồn tại');
            return res.redirect("/admin/order")
        }
    } catch (error) {
        console.log(error);
    }
}
// display detail order
const displayDetailOrder = async (req,res) => {
    let id = req.params.id
    const [rows] = await connection.execute(`
        SELECT orders.*, orders_laptops.*, laptop.name
        FROM orders_laptops
        INNER JOIN orders ON orders_laptops.orderId = orders.id
        INNER JOIN laptop ON orders_laptops.laptopId = laptop.id
        WHERE orders_laptops.orderId = ?;
    `,[id]);
    return res.render("updateOrder.ejs",{activeTab: 'adminOrder', data: rows, message: req.flash('message')})
}
// update order
const updateOrder = async (req,res) => {
    let id = req.params.id
    await connection.execute("UPDATE orders SET status = ? WHERE id = ?",["closed",id]);
    req.flash('message', 'Thành công');
    return res.redirect(`/admin/order/update/${id}`)
}
// delete order
const deleteOrder = async (req,res) => {
    let id = req.params.id
    await connection.execute("UPDATE orders SET status = ? WHERE id = ?",["aborted",id]);
    req.flash('message', 'Thành công');
    return res.redirect(`/admin/order/update/${id}`)
}
// filter by status
const displayAllOrderByStatus = async (req,res) => {
    let value = req.params.value
    const [rows] = await connection.execute('SELECT * FROM orders WHERE status = ? ORDER BY orderDate DESC',[value]);
    return res.render("homeOrder.ejs", { data: rows, activeTab: 'adminOrder', searchOrder: req.flash('search'), completeOrder: req.flash('confirm')});
}
module.exports = {
    addOrder,
    displayAddForm,
    displayOrderSuccess,
    displayAllOrder,
    displayAllOrderByStatus,
    searchOrderById,
    displayDetailOrder,
    updateOrder,
    deleteOrder
}