

export interface StatSample{
    median:number;
    mean:number;
    max:number;
    min:number;
    count:number;
    standardDeviation:number;
    upperQuartile:number;
    lowerQuartile:number;
    interQuartileRange:number;
    outliers:number[];
  }
  
  
  
  function getEmptyStat():StatSample{
  return {
    outliers:[],
    upperQuartile:0,
    lowerQuartile:0,
    interQuartileRange:0,
    median:0,
    mean:0,
    max:0,
    min:0,
    standardDeviation:0,
    count:0
  }
  }
  
  
  
  export function calculateStandardDeviation(values:number[]){
    let mean = meanCalc(values);
    let total = 0;
    for(let i = 0; i < values.length; i++){
      let value = values[i];
      total += ( Math.sqrt( (value - mean )**2 ) ) ** 2;
    }
    total /= (values.length-1)
    return Math.sqrt(total);
  }
  
  
  export function calcStatSample(values:number[],calcStandardDeviation:boolean=true):StatSample{
      let median = medianCalc(values);
      let mean = meanCalc(values);
      
      let [lower,upper] = upperLowerCalc(values); 
      let upperQuartile = medianCalc(upper);
      let lowerQuartile = medianCalc(lower);
      let interQuartileRange = upperQuartile-lowerQuartile
      
  
      let [inRange,outliers] = extractOutliers(values,lowerQuartile,upperQuartile,interQuartileRange);
  
  
      let max = maxNumbersCalc(inRange);
      let min = minNumbersCalc(inRange);
  
      let standardDeviation = 0;
      if(calcStandardDeviation)
        standardDeviation = calculateStandardDeviation(inRange);
  
  
      return {
          outliers:outliers,
          median: median,
          mean: mean,
          max: max,
          min: min,
          upperQuartile:upperQuartile,
          lowerQuartile:lowerQuartile,
          interQuartileRange:interQuartileRange,
          standardDeviation:standardDeviation,
          count: values.length
      };
  
  
  
  
  }
  
  
  export function extractOutliers(values:number[], lQ:number, uQ:number, IQR:number):[number[],number[]] {
    let outliers:number[] = [];
    let okay:number[] = [];
  
    if(values.length < 10){
      return [values,[]];
    }else{
    for(let i = 0; i < values.length; i++){
      let v = values[i];
      if( v < (IQR-(3*lQ/2)) ){
        outliers.push(v);
      } else if ( v > (IQR+(3*uQ/2)) ){
        outliers.push(v);
      }else{
        okay.push(v);
      }
    }
    
    return [okay,outliers];
  }
  
  
  }
  
  
  export function upperLowerCalc(values:number[]){
  
    let s = values.sort( (a,b) => a-b );
    let i = Math.floor(s.length/2);
    if(s.length%2 == 1){
        return [ s.slice(0,i), s.slice(i+1)];
    }else{
        return [ s.slice(0,i), s.slice(i)];
    }
  
  }
  
  
  export function minNumbersCalc(values:number[]){
    if(values.length == 0) 
      return 0;
  
    let v = values[0];
  
    for(let i = 0; i < values.length; i++){
      if(values[i] < v){
        v = values[i];
      }
    }
  
    return v;
  }
  
  
  export function maxNumbersCalc(values:number[]){
    if(values.length == 0) 
    return 0;
  
    let v = values[0];
  
    for(let i = 0; i < values.length; i++){
      //console.log(i, values.length);
      if(values[i] > v){
        v = values[i];
      }
    }
  
    return v;
  }
  
  
  
  export function medianCalc(values:number[]){
    if(values.length == 0) 
    return 0;
  
    let s = values.sort( (a,b) => a-b );
    let i = Math.floor(s.length/2);
    if(s.length%2 == 1){
        return s[i];
    }else{
        return (s[i-1]+s[i])/2
    }
  }
  
  
  
  export function meanCalc(values:number[]){
    if(values.length == 0) 
      return 0;
  
   let total = 0;
  
   for(let i = 0; i < values.length; i++)
      total += values[i];
  
    return total/values.length;
  
  }
  