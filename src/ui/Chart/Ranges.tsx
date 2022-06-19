import { ChartSettingsI, RangeI, Vec } from ".";
import { rgbToStrAlpha } from "../../lib/Color";


interface PlotRangesI{
    position:Vec;
    size:Vec;
    config:ChartSettingsI;
    range:RangeI;
  }
  
  export function PlotRange(props:PlotRangesI){
    const {position,size,config,range} = props;
  
    let styles = {
      body:{
        strokeWidth:0,
        stroke:"none"//,
        //fill:"black"
      },
      mask:{
        strokeWidth:0,
        stroke:"none",
        fill:"white"
      },
    };
  
    let [x,y] = position;
    let [width,height] = size;
  
    if(config.domain[1] == undefined || config.domain[0] == undefined)
      return null;
    
    let chartRange = config.range;
    let domain = config.domain;
    let duration = (config.domain[1] - config.domain[0]);
    
    
    let dy = height/(chartRange[1]-chartRange[0]);
  
    //height-o*dy + range[0]*dy;
  
    let start = range.start * dy 
    let end = range.end * dy 
    
    let band_x1 = 0;
    let band_x2 = width;
    
    let band_y1 = height-end + chartRange[0]*dy
    let band_y2 = height-start + chartRange[0]*dy
  
    let band_width = band_x2 - band_x1 ;
    let band_height = band_y2 - band_y1;
  
    let color = rgbToStrAlpha(range.color); //range.opacity
  
  
    return <g transform={`translate(${x},${y})`}>    
      <mask id="myMask">
        <rect  x={0} y={0} width={width} height={height} style={styles.body} fill="white" />
      </mask>
  
        <rect x={band_x1}  y={band_y1} height={band_height} width={band_width}  fill={color} mask="url(#myMask)"   />
  
      </g>
  }
  
  
  
  