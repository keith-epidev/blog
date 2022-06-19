import { ChartSettingsI, Vec } from ".";



export interface PlotFrameI{
    position:Vec;
    size:Vec;
    config:ChartSettingsI;
  
  }
  
  
  export function PlotFrame(props:PlotFrameI){
    const {position,size,config} = props;

    const styles = {
      rect:{
          strokeWidth:1,
          stroke:"black",
          fill:"none"
      } as React.CSSProperties
    }

    const [x,y] = position;
    const [width,height] = size;
    

    return <g>
      <rect x={x} y={y} height={height} width={width}  style={styles.rect} />
    </g>
  }
  
  