// display cart
const displayCart = (req, res) => {
    return res.render("cart.ejs", { data: req.session.cart, loggedin: req.session.loggedin });
}
// add item
const addToCart = (req, res) => {
    try {
        const item = {
            id: req.body.laptopId,
            name: req.body.laptopName,
            price: Number(req.body.laptopPrice),
            total: Number(req.body.laptopPrice),
            amount: Number(req.body.laptopAmount)
        }

        for (let currentItem of req.session.cart) {
            if (currentItem.id == item.id) {
                currentItem.total += item.price
                currentItem.amount += item.amount
                // req.flash('message', 'Thêm vào giỏ hàng thành công');
                return res.redirect("/")
            }
        }
        req.session.cart.push(item)
        // req.flash('message', 'Thêm vào giỏ hàng thành công');
        return res.redirect("/")
    } catch (error) {
        console.log(error);
        return res.render("notFound.ejs")
    }
}

// delete item
const deleteItem = (req, res) => {
    let id = req.params.id
    const filteredArray = req.session.cart.filter(item => item.id !== id);
    req.session.cart = filteredArray
    // req.flash('message', 'Xóa sản phẩm thành công');
    return res.redirect('/cart')
}

// update amount
const upAmount = (req, res) => {
    let id = req.params.id
    req.session.cart.forEach(item => {
        if (item.id === id) {
            item.amount += 1;
            item.total += item.price;
        }
    });
    return res.redirect('/cart')
}
const downAmount = (req, res) => {
    let id = req.params.id
    req.session.cart.forEach(item => {
        if (item.id === id) {
            if (item.amount == 1) {
                // req.flash('error', 'Số lượng phải lớn hơn 0');
                return res.redirect('/cart')
            }
            item.amount -= 1;
            item.total -= item.price;
            return res.redirect('/cart')
        }
    });
}

module.exports = {
    addToCart,
    deleteItem,
    displayCart,
    upAmount,
    downAmount
}