import { ChartSettingsI, Vec } from ".";

export interface YAxisTitleI{
    position:Vec;
    size:Vec;
    config:ChartSettingsI;
  }
  
  export function YAxisTitle(props:YAxisTitleI){
    const {position,size,config} = props;
  
    let styles = {
      text:{
        stroke:"none",
        fill:"black",
        dominantBaseline:"middle",
        textAnchor:"middle" 
  
      } as React.CSSProperties
    };
    let [x,y] = position;
    let [width,height] = size;
  
    let axisLabel = config.rangeLabel;
  
    return <g transform={`translate(${x} ${y}), rotate(-90)`} >
        <text x={0} y={0} style={styles.text} >{axisLabel}</text>
    </g>
  }
  