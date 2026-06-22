import { parse } from "dotenv";
import {createClient} from "redis";
const client = await createClient().connect();
console.log("worker-started");

const balances = {

};

const orderBooks  = {
  SOL: {},
  BTC: {}, 
  USDT: {}
}
//make a differnent client because one client cannot read and write data
const publisherClient = await createClient().connect();
while(1) {
    const response = await client.brPop("incoming-order", 0);
    if(!response) {
      console.log(response);
        continue;

    }
    const parseResponse = JSON.parse(response.element);

    if(parseResponse.type === "create_order") {

    }
    if(parseResponse.type === "get_depth") {

    }
    if(parseResponse.type === "get_user_balance") {

    }
    if(parseResponse.type === "get_order") {

    }

  const filledQty = parseResponse.filledQty;
  const identifier = parseResponse.identifier;
  publisherClient.lPush("response-queue", JSON.stringify({filledQty, identifier}));
}