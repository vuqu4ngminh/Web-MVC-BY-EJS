// routes
const handleHomePage = (req,res) => {
    return res.render("home.ejs",{activeTab: 'home'});
}

const handleLoginPage = (req,res) => {
    return res.render("login.ejs",{message: req.flash('message'), activeTab: 'login'})
}
const handleCartPage = (req,res) => {
    return res.render("cart.ejs", {activeTab: 'cart'})
}
const handleContactPage = (req,res) => {
    return res.render("contact.ejs", {activeTab: 'contact'})
}

module.exports = {
    handleHomePage,
    handleLoginPage,
    handleCartPage,
    handleContactPage,
}