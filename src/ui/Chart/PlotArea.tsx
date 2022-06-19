import { ChartSettingsI, Vec } from ".";
import { RGBAColor, rgbToStrAlpha } from "../../lib/Color";
import { StatArrayEnum, StatisticView } from "../../lib/Datamancer/StatisticView";



interface PlotAreaI{
    position:Vec;
    size:Vec;
    setIndex:number,
    // set:GraphSetArrayBuffer,
    view:StatisticView
    config:ChartSettingsI;
  }
  
  
  export function PlotArea(props:PlotAreaI){
    const {position,size,config,view,setIndex} = props;
  
    let alpha:RGBAColor = [...view.colors[setIndex]];
    alpha[3] = 0.2;

    let styles = {
      body:{
        strokeWidth:0,
        stroke:"none",
        fill:"black"
      },
      line:{
        strokeWidth:0,
        stroke:"none",
        fill:rgbToStrAlpha(alpha)
      }
    };
  
    let [x,y] = position;
    let [width,height] = size;
  
    if(config.domain[1] == undefined || config.domain[0] == undefined)
      return null;
    
    let range = config.range;
    
  
    let dx =  width/view.width;
    let dy = height/(range[1]-range[0]);
  
    let f = view.getStatsTime(0,setIndex,StatArrayEnum.min);
  
    let pathD = `M ${0*dx} ${height-f*dy}`
  
    for(let i = 1; i < view.width; i++){
      let x = i*dx;
      let v = view.getStatsTime(i,setIndex,StatArrayEnum.min);
      let y = height - v*dy + range[0]*dy;
  
      pathD += ` L ${x} ${y}`;
    }
  
    for(let i = view.width-1; i >=0; i--){
      let x = i*dx;
      let v = view.getStatsTime(i,setIndex,StatArrayEnum.max);
      let y = height - v*dy + range[0]*dy;
      // console.log(i,v,y);
  
      pathD += ` L ${x} ${y}`;
    }
  
    pathD += ` Z`;
  
    
  
    return <g transform={`translate(${x},${y})`}>    
      <mask id="myMask">
        <rect x={0} y={0} width={width} height={height} style={styles.body} fill="white" />
      </mask>
  
      <path d={pathD} style={styles.line} mask="url(#myMask)" />
  
      </g>
  }
  
  