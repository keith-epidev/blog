import moment from "moment";
import { RGBAColor } from "../Color";
import { calcStatSample, medianCalc } from "./Statistics";

export const MAGICNULL = Infinity;


export interface SeriesI{
    label:string;
    rate:number;
    xOffset:number;
    values:ArrayBuffer;
  }
  
  
  export class Series{
    label:string;
    values:Float32Array;
    xOffset:number;
    rate:number;
    index:number;
    color:RGBAColor;
  
    constructor(d:SeriesI){ 
      this.label = d.label;
      this.values = new Float32Array(d.values);
      this.xOffset = d.xOffset;
      this.rate = d.rate;
      this.index = 0;
      this.color = [0,0,0,0];
    }

 
    getDuration(){
      return this.values.length/this.rate;
    }
  
    getStart(){
      return this.xOffset;
    }
  
    getEnd(){
      return this.getStart()+this.getDuration();
    }
  
    getDateRangeString(){
      let start = this.getStart();
      let end = this.getEnd();
  
      return `${moment(start*1000).format("DD/MM/YY")} - ${moment(end*1000).format("DD/MM/YY")}`;
    }
  
  }



export async function binLoader(src:string){
  let options:any = {
      credentials: 'same-origin',
      headers:{},
      cors:"no-cors"
  };

  return fetch(src,options) 
  .then(async (response) => { 
        let content_type = response.headers.get('Content-Type');
        //console.log(`[${response.type}] ${response.status} ${response.statusText} ${response.url} ${content_type}`);

        let blob = await response.arrayBuffer();
        return blob;
  });
}

export async function loadSeries(label:string,src:string){
  let bin = await binLoader(src);
  return seriesFromBin(label,bin);
}

  
  export function seriesFromBin(label:string,buffer:ArrayBuffer):Series{
    //console.log(buffer);
    const header = new Float32Array(buffer.slice(0,4*2));
    let offset = buffer.byteLength - buffer.byteLength%4; // this is weird, trimming any extra?
    let samplesMinMax = new Float32Array(buffer.slice(4*2,offset));


    let samples = new Float32Array(samplesMinMax.length/4);
    for(let i = 0; i < samplesMinMax.length/4; i++)
      samples[i] = getTemp(samplesMinMax[i*4+1]/samplesMinMax[i*4])

    let timestamp = header[0];
    let rate = header[1];
    //console.log(rate,timestamp,samples);
    let s = new Series({
      label:label,
      xOffset:timestamp,
      rate:rate,
      values:samples
    });
    return s;
  }
  




export function getTemp(voutQ:number){

  let beta25 = 4092;
  let R25 = 100000;
  let T0 = 273.15 + 25;


  let v = 5;//3.3;

  let vout = voutQ*v / 1024;
//  console.log(voutQ,vout);

  let rs = 4700;
  let vRs = v - vout;
  let i = vRs/rs;

  let Rt = vout / i;
 // console.log(Rt);
  let t_inv = 1/T0 + (1/beta25) * Math.log(Rt / R25);

  return (1/t_inv) - 273.15;
}

  export function seriesFromCSV(header:string[],rows:number[][]):Series[]{
  

    let seriesCount = header.length-1;
    let rate = 60; //1 min
    let startTime = rows[0][0];
    let endTime = rows[rows.length-1][0]+rate;
    let diff = endTime-startTime;
    
    let count = Math.floor(diff/rate);
    let samples:Float32Array[] = [];
    for(let i = 0; i < seriesCount; i++)
      samples.push(new Float32Array(count));
  
    let rowIndex = 0;
    let sampleIndex = 0;
    for(let t = startTime+rate; t < endTime; t += rate){
      let page:number[][] =  [];
      for(let j = 0; j < seriesCount; j++)
        page.push([]);
      
      for(rowIndex; rowIndex < rows.length; rowIndex++){
        let row = rows[rowIndex];

        if( row[0] <= t ){
          for(let j = 0; j < seriesCount; j++)
            page[j].push(row[j+1]);
        }else{
          break;
        }
      }

      if(page.length > 0){
        for(let j = 0; j < seriesCount; j++)
          samples[j][sampleIndex] = medianCalc(page[j]);
      }else{
        for(let j = 0; j < seriesCount; j++)
        samples[j][sampleIndex] = MAGICNULL;
      }
  
      sampleIndex++;
    }

    let results:Series[] = [];

    for(let j = 0; j < seriesCount; j++){
      let s = new Series({
        label:header[j],
        xOffset:startTime,
        rate:rate,
        values:samples[j]
      })
      results.push(s);
    }

    return results;
  }
  