import express from "express";
import bodyParser from "body-parser";
import configViewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
import session from "express-session";

require("dotenv").config();

const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
configViewEngine(app)
initWebRoutes(app)



const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log("Server is running on " + PORT);
})