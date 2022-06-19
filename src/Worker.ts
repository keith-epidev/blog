

/* eslint-disable no-restricted-globals */
/* eslint-disable no-eval */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/first */

if (process.env.NODE_ENV != 'production') {
    (global as any).$RefreshReg$ = () => {/**/};
    (global as any).$RefreshSig$ = () => () => {/**/};
}

//import { generateDistribution, ssFromDistribution } from "./lib/Distribution";

export {};


/* eslint no-restricted-globals: off */

const ctx: Worker = self as any;

// Post data to parent thread
//ctx.postMessage();
run((v)=> ctx.postMessage(v) )

// Respond to message from parent thread
ctx.addEventListener("message", (event) => {
    console.log(event.data);


});





function run(postMessage:(v:any) => void){
    const { generateDistribution } = require("./lib/Distribution");

    let size = 1000;
    let iteration = 10**3;
    let distribution:number[] = new Array(size).fill(0);

    console.log("running");

    


    let nextRender = Date.now();

    for(let i = 0; i < iteration; i++){
       generateDistribution(distribution,size,1000);

        let now = Date.now();
        if( now > nextRender ){
            //let ss1 = ssFromDistribution(distribution);
           postMessage({data:distribution,index:i,total:iteration})
            nextRender = now + 250;
        }
    }
    //let ss1 = ssFromDistribution(distribution);
    postMessage({data:distribution,index:iteration,total:iteration})
    
    console.log("done");





}