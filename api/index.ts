import express, { NextFunction, Request, Response } from "express";
import myanimelist from "./lib/myanimelist";
import cors from 'cors'
import path from 'path'

const app = express();

app.use(express.json())
app.use(cors())

app.post("/api/myanimelist", async (req, res) => {
    try {
        const url = req.body.url
        if (!url) return res.sendStatus(400)
        const result = await myanimelist(url)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.sendStatus(500)
    }
});

app.use(express.static(path.join(__dirname, './public')))

app.listen(3001, () => {
    console.log(`server berjalan di http://localhost:3001`);
});
