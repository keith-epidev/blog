import { ChartSettingsI, Vec } from ".";
import { rgbToStrAlpha } from "../../lib/Color";
import { StatisticView } from "../../lib/Datamancer/StatisticView";



interface PlotOutliersI{
    position:Vec;
    size:Vec;
    setIndex:number,
    view:StatisticView
    config:ChartSettingsI;
  }
  
  export function PlotOutliers(props:PlotOutliersI){
    const {position,size,setIndex,view,config} = props;
  
    let styles = {
      body:{
        strokeWidth:1,
        stroke:"#CCC",
        fill:"rgba(0,0,0,0.1)"
      },
      circle:{
        strokeWidth:0,
        fill:rgbToStrAlpha(view.colors[setIndex]),
        stroke:"none"
      }
    };
  
  
    let [x,y] = position;
    let [width,height] = size;
  
    let range = config.range;
    let domain = config.domain;
  
    if(domain[0] == 0 && domain[1] == 0)
      return null;
    
    let duration = (domain[1] - domain[0]);
    
  
    let dx =  width/view.width;
    let dy = height/(range[1]-range[0]);
    let marks:any[] = [];
  
    for(let i = 0; i < view.width; i++){
      let x = i*dx; 
      let outliers = view.getOutliers(i,setIndex);
  
      for(let j = 0; j < outliers.length; j++){
        let o = outliers[j];
        let y = height-o*dy + range[0]*dy;
        marks.push(<circle key={`${setIndex}-${i}-${j}`} style={styles.circle} r={2} cx={x} cy={y} mask="url(#myMask)" />)
      }
  
  
    }
    
  
    return <g transform={`translate(${x},${y})`}>
       <mask id="myMask">
        <rect x={0} y={0} width={width} height={height} style={styles.body} fill="white" />
      </mask>
  
      {marks}
  
      </g>
  }
  