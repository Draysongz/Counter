import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Counter } from '../wrappers/Counter';
import '@ton/test-utils';

describe('Counter', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let counter: SandboxContract<Counter>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();
        const Id = BigInt(Math.floor(Math.random() * 10000))

        counter = blockchain.openContract(await Counter.fromInit(Id ));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await counter.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            }
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: counter.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and counter are ready to use
    });

    it('should increase counter', async()=>{
        const increaseTime = 3
        for(let i = 0; i < increaseTime; i++){
            console.log(`increase ${i + 1}/${increaseTime  }`)

            const increaser = await blockchain.treasury('increaser' + i)

            const counterBefpre = await counter.getCounter();

            console.log('counter before increasing', counterBefpre)

            const increaseBy = BigInt(Math.floor(Math.random() * 100))

            console.log('increase value', increaseBy)

            const increaseResult = counter.send(
                increaser.getSender(),
                {
                    value: toNano('0.005')
                }, {
                    $$type: 'Add',
                    queryId: 0n,
                    amount: increaseBy
                }
            )
            expect((await increaseResult).transactions).toHaveTransaction({
                from: increaser.address,
                to: counter.address,
                success: true
            })

            const counterAfter = await counter.getCounter()

            console.log("couter after", counterAfter)

            expect(counterAfter).toBe(counterBefpre + increaseBy)
        } 
    })
});
