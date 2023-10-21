import express from "express";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
import bodyParser from 'body-parser';
import session from 'express-session';
import flush from 'connect-flash';

require("dotenv").config();

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flush());
configViewEngine(app)
initWebRoutes(app)

const PORT = process.env.PORT || 6060

// configPassport();
app.listen(PORT, () => {
    console.log("Server is running on " + PORT);
})