import { createClient } from "redis";
const suscriber = createClient().on("error", (err) => console.log("Redis client error", err)).connect();

type resolveFn = (value: {filledQty: number}) => void;
let pendingResolve: Record<number, resolveFn> = {};
async function poller() {
 const response = await (await suscriber).brPop("response-queue", 5);
 if(!response) {
    console.log("poller got: ", response);
    poller();
 } else {
    const parseResponse =  JSON.parse(response.element);
    const resolver = pendingResolve[parseResponse.identifier];
    if(parseResponse.identifier && resolver) {
       resolver({
        filledQty: parseResponse.filledQty
      });
    }
    poller();
 }
}
poller();
type orderesult =  {
    filledQty : number;
}
export function untilWeGotBack(identifier: number) {
    return new Promise<orderesult>((resolve, reject) => {
        pendingResolve[identifier] = resolve;
    })
}