import { ChartSettingsI, Vec } from ".";
import { rgbToStrAlpha } from "../../lib/Color";
import { StatArrayEnum, StatisticView } from "../../lib/Datamancer/StatisticView";


interface PlotLineI{
    position:Vec;
    size:Vec;
    setIndex:number,
    //set:GraphSetArrayBuffer,
    view:StatisticView
    config:ChartSettingsI;
    index:"median"|"mean";
  }
  

export function PlotLine(props:PlotLineI){
    const {index,position,size,setIndex,view,config} = props;
  
    let styles = {
      body:{
        strokeWidth:0,
        stroke:"none",
        fill:"white"
      },
      line:{
        strokeWidth:2,
        stroke:rgbToStrAlpha(view.colors[setIndex]),
        fill:"none",
        strokeLinejoin:"round"
      } as React.CSSProperties
    };
  
   
    let [x,y] = position;
    let [width,height] = size;
  
  
    let range = config.range;
    let domain = config.domain;
  
  
    if(domain[0] == 0 && domain[1] == 0)
      return null;
    
    let duration = (domain[1] - domain[0]);
    
  
    let statIndex = (index=="median")?StatArrayEnum.median:StatArrayEnum.mean
    
    let dx = (width)/(view.width-1);
    let dy = height/(range[1]-range[0]);

    let points:(Vec|undefined)[] = [];

    for(let i = 0; i < view.width; i++){
      let x = i*dx;
      let v = view.getStatsTime(i,setIndex,statIndex);
      let y = height - v*dy + range[0]*dy;

      let thisCount = view.getStatsTime(i,setIndex,StatArrayEnum.count);
      points.push(thisCount>0?[x,y]:undefined);

      //let symbol = "M";
      //if(thisCount > 0 && lastCount > 0)
       // symbol = "L";
  
      // pathD += ` ${symbol} ${x} ${y}`;
    }


    
    let pathD = "";

    for(let i = 0; i < points.length; i++)
      pathD += createPathSegment(points,i)+" ";

    function createPathSegment(points:(Vec|undefined)[], i:number ){

      let p2n = points[i-2];
      let p1n = points[i-1];
      let p0 = points[i-0];
      let p1 = points[i+1];


      // bezier segment
      if( p2n && p1n && p0 && p1 ){
        const [cpsX, cpsY] = controlPoint(p1n, p2n, p0); // start control point
        const [cpeX, cpeY] = controlPoint(p0, p1n, p1, true); // end control point
        return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${p0[0]},${p0[1]}`;
      }else if (p1n && p0){
        return `L ${p0[0]} ${p0[1]}`;
      }else if(p0){
        return `M ${p0[0]} ${p0[1]}`;
      }else{
        //skip
        return "";
      }




      // if(prev == undefined && current == undefined){
      //   // skip
      // }else if( prev == undefined && current != undefined ){
      //   pathD += `M ${current[0]} ${current[1]}`
      // }else if( prev != undefined && current != undefined && next == undefined){
      //   pathD += `L ${current[0]} ${current[1]}`
      // }else if( prev != undefined && current != undefined && next != undefined && next2 != undefined){
      //   //pathD += `M ${current[0]} ${current[1]}`
      //   pathD += bezierCommand(index,points);
      // }else{
      //   console.log("unaccounted")
      // }
    }


    // console.log(pathD);
  
    return <g transform={`translate(${x},${y})`}>
      <mask id="myMask">
        <rect x={0} y={0} width={width} height={height} style={styles.body} fill="white" />
      </mask>
      <path d={pathD} style={styles.line} mask="url(#myMask)" />
    </g>
  }
  
  

  // Properties of a line 
// I:  - pointA (array) [x,y]: coordinates
//     - pointB (array) [x,y]: coordinates
// O:  - (object) { length: l, angle: a }: properties of the line
const line = (pointA:Vec, pointB:Vec) => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  }
}

// Position of a control point 
// I:  - current (array) [x, y]: current point coordinates
//     - previous (array) [x, y]: previous point coordinates
//     - next (array) [x, y]: next point coordinates
//     - reverse (boolean, optional): sets the direction
// O:  - (array) [x,y]: a tuple of coordinates
const controlPoint = (current:Vec, previous:Vec, next:Vec, reverse:boolean=false) => {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current
  const n = next || current
  // The smoothing ratio
  const smoothing = 0.2
  // Properties of the opposed-line
  const o = line(p, n)
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0)
  const length = o.length * smoothing
  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length
  const y = current[1] + Math.sin(angle) * length
  return [x, y]
}

// Create the bezier curve command 
// I:  - point (array) [x,y]: current point coordinates
//     - i (integer): index of 'point' in the array 'a'
//     - a (array): complete array of points coordinates
// O:  - (string) 'C x2,y2 x1,y1 x,y': SVG cubic bezier C command
// const bezierCommand = ( i:number, a:(Vec|undefined)[]) => {
//   let point = a[i];
//   // start control point
//   const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point)
//   // end control point
//   const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true)
//   return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`
// }