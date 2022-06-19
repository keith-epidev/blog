import moment from "moment";
import { RGBAColor } from "../Color";
import { calcStatSample } from "./Statistics";

import {MAGICNULL, Series} from "./Series";


  export class StatisticView{
    buffer:Float32Array;
    outliers:Float32Array;
    width:number;
    setCount:number;
    labels:string[];
    colors:RGBAColor[];
    domain:[number,number];

    constructor(buffer:Float32Array,domain:[number,number],width:number,setCount:number,labels:string[],colors:RGBAColor[],outliers:Float32Array){
      this.buffer = buffer;
      this.domain = domain;
      this.width = width;
      this.setCount = setCount;
      this.colors = colors;
      this.labels = labels;
      this.outliers = outliers;
    }


    getStatsTime(t:number, setIndex:number,statIndex:number){
      return getStatFloat32(this.buffer,t, this.width, setIndex, statIndex);
    }

    getOutliers(t:number, setIndex:number){
      let index = this.getStatsTime(t,setIndex,StatArrayEnum.outlierIndex);
      let length = this.getStatsTime(t,setIndex,StatArrayEnum.outlierLength);

      if(length == 0){
        return [];
      }else{
          return this.outliers.slice(index,index+length);
      }

    }
  }
  
  export function processStatisticView(sets:Series[],domain:[number,number],nWidth:number){
    let width = Math.floor(nWidth);
    let duration = domain[1] - domain[0];
    let timeChunks = duration / width;

    let smallestRate = Math.min(...sets.map(set => set.rate))
    let available = duration/smallestRate;

    //console.log("timeChunks",timeChunks,duration,width,smallestRate,available)


    if(available < width){
      timeChunks = smallestRate;//Math.floor(available);
      width = Math.floor(available);
    }

    let statCount = StatArrayEnum.length;
    let outliers = [];
    let buffer = new Float32Array(width*sets.length*statCount);

    // consrole.log(width*sets.length*statCount);
  
    for(let setIndex = 0; setIndex < sets.length; setIndex++){
      let set = sets[setIndex];
      let count = set.values.length;

      for(let i = 0; i <  width; i++){
        let t0 = i*timeChunks + domain[0];
        let t1 = (i+1)*timeChunks + domain[0];
        let i0 = Math.floor((t0 - set.xOffset)/set.rate);
        let i1 = Math.floor((t1 - set.xOffset)/set.rate);
        
        let values = [];
        for(let j = i0; j < i1; j++){
          if(j >= 0 && j < count){
            let v = set.values[j];
            if(v != MAGICNULL)
            values.push(v);
          }
        }

        //console.log(values);
        let chunkOutliers = writeStatFloat32(values,buffer,i,width,setIndex,outliers.length);
        for(let o = 0; o < chunkOutliers.length; o++)
          outliers.push(chunkOutliers[o]);

      }

    }

    let labels = sets.map(s => s.label);
    let colors = sets.map(s => s.color);


    let floatOutliers = new Float32Array(outliers);
   
    let processed = new StatisticView(buffer,domain,width,sets.length,labels,colors,floatOutliers);
    // console.log(processed);
    // console.log(buffer,domain,width,sets.length,labels,colors,floatOutliers);


    return processed;
  
  }
  
  export enum StatArrayEnum{
    median,
    mean,
    max,
    min,
    count,
    standardDeviation,
    upperQuartile,
    lowerQuartile,
    interQuartileRange,
    outlierIndex,
    outlierLength,
    length
  }
  
  
  export function writeStatFloat32(samples:number[],buffer:Float32Array,index:number,width:number,setIndex:number,outlierIndex:number){
    let stat = calcStatSample(samples);
  
    let i = ( setIndex  * width + index ) * StatArrayEnum.length 
  
    buffer[  i + StatArrayEnum.median ] = stat.median;
    buffer[  i + StatArrayEnum.mean ] = stat.mean;
    buffer[  i + StatArrayEnum.max ] = stat.max;
    buffer[  i + StatArrayEnum.min ] = stat.min;
    buffer[  i + StatArrayEnum.count ] = stat.count;
    buffer[  i + StatArrayEnum.standardDeviation ] = stat.standardDeviation;
    buffer[  i + StatArrayEnum.upperQuartile ] = stat.upperQuartile;
    buffer[  i + StatArrayEnum.lowerQuartile ] = stat.lowerQuartile;
    buffer[  i + StatArrayEnum.interQuartileRange ] = stat.interQuartileRange;
    buffer[  i + StatArrayEnum.outlierIndex ] = outlierIndex;
    buffer[  i + StatArrayEnum.outlierLength ] = stat.outliers.length;

    return stat.outliers;
  }
  
  
  export function getStatFloat32(buffer:Float32Array,index:number,width:number,setIndex:number,statIndex:StatArrayEnum){
    
    let i = ( setIndex *  width + index ) * StatArrayEnum.length 
    let v = buffer[  i + statIndex ];

    return v;
  }
  