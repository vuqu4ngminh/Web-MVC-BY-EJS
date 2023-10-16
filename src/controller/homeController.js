import { db } from "../db";

const handleHomePage = (req,res) => {
    const sql = "SELECT * FROM laptop"

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Loi!")
        }
        return res.render("home.ejs", {data: results});
    })

}

const handleAdminPage = (req,res) => {
    return res.render("admin.ejs")
}

module.exports = {
    handleHomePage,
    handleAdminPage
}