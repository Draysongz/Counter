import { NetworkProvider } from "@ton/blueprint";
import { Counter } from "../wrappers/Counter";
import { Address, toNano } from "@ton/core";

const sleep =(ms: number)=>{
return new Promise(resolve => setTimeout(resolve, ms));
}

export async function run(provider: NetworkProvider) {
    const counter = provider.open(Counter.fromAddress(Address.parse("EQD2jjsG0LpR3Ee8Z4tIgEQ7kMN7NNyaWZy1AtGStSQJv0l1")))


    const counterBefore = await counter.getCounter()
    console.log("counter before", counterBefore)


    await counter.send(
        provider.sender(),
        {
            value: toNano('0.05')
        },{
            $$type: "Add",
            queryId: 0n,
            amount: BigInt(2)
        }
    )


let counterAfter = await counter.getCounter()
let attempt = 1

while(counterAfter === counterBefore){
    console.log("incrementing counter, attempt", attempt)
    await sleep(2000);
    counterAfter = await counter.getCounter();
    attempt++
}


console.log("counter after", counterAfter)
}

