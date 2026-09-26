import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const API_key = process.env.API_KEY;
const API_URL = `https://v6.exchangerate-api.com/v6/${API_key}/pair/`;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
    res.render("index.ejs");
});

app.post("/", async (req, res) => {
    const result = await axios.get(
        API_URL + req.body.from + "/" + req.body.to + "/" + req.body.amount,
    );
    const receivedResult = result.data.conversion_result;
    const roundedResult = Math.round(receivedResult * 100) / 100;
    const targetCode = result.data.target_code;
    res.render("index.ejs", {
        result: {
            amount: roundedResult,
            currency: targetCode,
            baseAmount: req.body.amount,
            baseCurrency: req.body.from,
        },
    });
});

// Commented for Vercel deployment

// app.listen(port, () => {
//     console.log("Server is listening on port", port);
// });

export default app;
