import { ChartSettingsI, Vec } from ".";


interface XAxisLabelsI{
    position:Vec;
    size:Vec;
    config:ChartSettingsI;
  }
  
  export function XAxisLabels(props:XAxisLabelsI){
    const {position,size,config} = props;
  
    let styles = {
      text:{
        stroke:"none",
        fill:"black",
        dominantBaseline:"middle",
        textAnchor:"end" 
  
      } as React.CSSProperties
    };
    
    let [x,y] = position;
    let [width,height] = size;
    let dY =  height/config.gridX;
    let range = config.range;
    let valueRange = range[1] - range[0];   //config.domain[1] - config.domain[0];
    let dVY = valueRange/config.gridX;
  
    let labels:any = [];
    for(let y = 0; y <= config.gridX; y ++){
      let v = Math.round(( range[0] + dVY*y)*10 )/10;
      labels.push(<text key={`x-axis-${y}`} x={width-10} y={height-y*dY} style={styles.text} >{v}</text>)
    }
  
    return <g transform={`translate(${x},${y})`}>    
      {labels}
    </g>
  
  
  }
  
  