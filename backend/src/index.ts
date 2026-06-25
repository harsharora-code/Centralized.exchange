import {createClient} from "redis";
import express from "express";
import {untilWeGotBack} from "./untilWeGotBack.js"

const client = await createClient()
.on("error", (err) => console.log("Redis-client error", err))
.connect();

const app = express();

app.use(express.json());

app.post("/orders", async (req, res) => {
    console.log("req-received");
    //@ts-ignore
    const userId = req.userId;
    let identifier = Math.random();
    const {type, marketPrice, market_id, filledQty, side} = req.body;
    console.log("before push");
    await client.lPush("incoming-order", JSON.stringify({
        type, marketPrice, market_id, filledQty, side, identifier  
    }))
    console.log("after-push");

    const returnData = await untilWeGotBack(identifier);
    console.log("got returned: ", returnData);
    res.json({
        message: "order-placed", filledQty: returnData.filledQty
    });

})
app.listen(3000);