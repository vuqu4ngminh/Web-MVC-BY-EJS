const handleHomePage = (req,res) => {
    return res.render("home.ejs");
}

const handleAdminPage = (req,res) => {
    return res.render("admin.ejs")
}

module.exports = {
    handleHomePage,
    handleAdminPage
}