require("./db/connection");
require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");

const users = require("./models/user");

app.use(express.json())
app.use(cors());

app.post("/create", async (req, res) => {
    try {
        console.log(req.body)
        const hash = await bcrypt.hash(req.body.password, 8);
        console.log(hash)
        const result = await users.create({
            ...req.body,
            password: hash
        })
        res.status(200).json(result);
    } catch (e) {
        res.send(e)
    }
})

app.get("/get", async (req, res) => {
    try {
        const result = await users.find({})
        res.status(200).json(result);
    } catch (e) {
        res.send(e)
    }
})


app.post("/login", async (req, res) => {
    try {
        const existUser = await users.find({ name: req.body.name });
        console.log(existUser, "existUser")
        if (existUser.length <= 0) {
            return res.status(400).json("user not found")
        } else {
            const comparePassword = await bcrypt.compare(
                req.body.password,
                existUser[0].password,
            );
            console.log(comparePassword,"comparePassword")
            if (comparePassword) {
                var token = jwt.sign({ id: existUser._id }, process.env.JWT_SECRET, {
                    expiresIn: "24h", //86400 // expires in 24 hours
                });
                console.log(token,"token")   
                return res.status(200).json(token) 
            } else {
                return res.status(400).json("Wrong Password");
            }
            // const result = await users.find({})
        }
    } catch (e) {
       return res.send(e)
    }
})

console.log(process.env.FRONT_URL)

app.listen(8080, () => {
    console.log("running on 8080");
})