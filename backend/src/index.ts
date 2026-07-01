import {createClient} from "redis";
import express from "express";
import {untilWeGotBack, queue_id} from "./untilWeGotBack.js"



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
    const pendingResponse = untilWeGotBack(identifier);  //register it before
    await client.lPush("incoming-order", JSON.stringify({
        type, marketPrice, market_id, filledQty, side, identifier, queue_id: queue_id  
    }))
    console.log("after-push");

    const returnData = await pendingResponse;
    
    console.log("got returned: ", returnData);
    res.json({
        message: "order-placed", filledQty: returnData.filledQty
    });

})
app.listen(3001);