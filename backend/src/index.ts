import {createClient} from "redis";
import express from "express";
import { untilWeGotBack } from "./untilGoBack.js";

const client = await createClient()
.on("error", (err) => console.log("Redis-client error", err))
.connect();

const app = express();

app.use(express.json());

app.post("/orders", async (req, res) => {
    //@ts-ignore
    const userId = req.userId;
    let identifier = Math.random();
    const {type, marketPrice, market_id, filledQty, side} = req.body;
    await client.lPush("incoming-order", JSON.stringify({
        type, marketPrice, market_id, filledQty, side, identifier  
    }))

    const returnData = await untilWeGotBack(identifier);
    res.json({
        message: "order-placed", filledQty: returnData.filledQty
    });

})
app.listen(3002);