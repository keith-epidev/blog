import { Vec } from ".";

export interface YAxisI{
    position:Vec;
    size:Vec;
  };
  
  export function YAxis(props:YAxisI){
    const {position,size} = props;
  
    let style = {
      strokeWidth:2,
      stroke:"#CCC"
    }
  
    let x1 = position[0]+size[0];
    let x2 = position[0]+size[0];
    let y1 = position[1];
    let y2 = position[1]+size[1];
    
    return <line x1={x1} x2={x2} y1={y1} y2={y2} style={style} />
  }
  
  
  