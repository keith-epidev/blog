import { ChartSettingsI, Vec } from ".";

export interface TitleI{
    position:Vec;
    size:Vec;
    config:ChartSettingsI;
  }
  
  export function Title(props:TitleI){
    const {position,size,config} = props;
  
    let styles = {
      text:{
          fill:"black",
          textAnchor:"middle",
          fontWeight:"bold"
          //alignmentBaseline:"hanging"
      } as React.CSSProperties,
    };

    let [x,y] = position;
    let [width,height] = size;
  
    let title = config.title;
  
    return <g>
        <text  x={x} y={y} style={styles.text} >{title}</text>
    </g>
  
  }
  