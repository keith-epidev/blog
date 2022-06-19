import moment from "moment";
import { ChartSettingsI, Vec } from ".";


export interface YAxisLabelsI{
    position:Vec;
    size:Vec;
    config:ChartSettingsI;
  }
  
  export function YAxisLabels(props:YAxisLabelsI){
    const {position,size,config} = props;
  
    let styles = {
      text:{
        stroke:"none",
        fill:"black",
        dominantBaseline:"hanging",
        textAnchor:"middle" 
  
      } as React.CSSProperties
    };
    
    let [x,y] = position;
    let [width,height] = size;
    let dX =  width/config.gridY;
  
    let domain = config.domain;
    let duration = domain[1]-domain[0];
    let dVX = duration/config.gridY;
  
    let labels:any = [];
    for(let x = 0; x <= config.gridY; x++){
      let v =  (domain[0] + dVX*x );
      let str = v+""; //moment(v*1000).format("DD/MM/YY");
      labels.push(<text key={`y-axis-${x}`} x={x*dX} y={10} style={styles.text} >{str}</text>)
    }
  
    return <g transform={`translate(${x},${y})`}>    
      {labels}
    </g>
  
  
  }