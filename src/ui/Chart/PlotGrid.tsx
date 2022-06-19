import { ChartSettingsI, Vec } from ".";



export interface PlotGridI{
    position:Vec;
    size:Vec;
    config:ChartSettingsI;
  
  }
  
  export function PlotGrid(props:PlotGridI){
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
      <GridX position={position} size={size}  config={config}  />
      <GridY position={position} size={size}  config={config} />
    </g>
  }
  
  
  
  export interface GridXI{
    position:Vec;
    size:Vec;
    config:ChartSettingsI;
  
  }
  
  export function GridX(props:GridXI){
    const {position,size,config} = props;
  
    let styles = {
      line:{
        strokeWidth:1,
        stroke:"#CCC",
        fill:"none"
      }
    }
    
    let pathD = `M 0 0 `;
    let [x,y] = position;
    let [width,height] = size;
    let dY =  height/config.gridX;
  
    for(let y = 0; y < height; y += dY){
      pathD += `L 0 ${y} L ${width} ${y} L ${width} ${y+dY}`
    }
  
    return <g transform={`translate(${x},${y})`}>    
      <path d={pathD} style={styles.line} mask="url(#myMask)" />
    </g>
  }
  
  
  export interface GridYI{
    position:Vec;
    size:Vec;
    config:ChartSettingsI;
  
  }
  
  
  export function GridY(props:GridYI){
    const {position,size,config} = props;
  
    let styles = {
      line:{
        strokeWidth:1,
        stroke:"#CCC",
        fill:"none"
      }
    }
    
    let pathD = `M 0 0 `;
    let [x,y] = position;
    let [width,height] = size;
    let dX =  width/config.gridY;
  
    for(let x = 0; x < width; x += dX){
      pathD += `L ${x} 0 L ${x} ${height} L ${x+dX} ${height}`;
    }
  
    return <g transform={`translate(${x},${y})`}>    
      <path d={pathD} style={styles.line} mask="url(#myMask)" />
    </g>
  }
  
  
  