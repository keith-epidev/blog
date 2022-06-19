import React, { PureComponent, useRef, useState, useCallback, useEffect  } from 'react';
import { Card, CardContent, CircularProgress, Grid } from "@mui/material";
import moment from "moment";
import { StatisticView } from '../../lib/Datamancer/StatisticView';
import { RGBAColor } from '../../lib/Color';
import { PlotArea } from './PlotArea';
import { PlotLine } from './PlotLine';
import { PlotOutliers } from './PlotOutliers';
import { PlotGrid } from './PlotGrid';
import { XAxisLabels } from './XAxisLabels';
import { YAxisLabels } from './YAxisLabels';
import { XAxis } from './XAxis';
import { YAxis } from './YAxis';
import { Title } from './Title';
import { YAxisTitle } from './YAxisTitle';
import { XAxisTitle } from './XAxisTitle';
import { PlotFrame } from './PlotFrame';

//import { GraphSetArrayBuffer, ProcessedGraphView, processGraphConfig, StatArrayEnum } from "../lib/ArrayBufferChart";
//import { generateColor, RGBColor, rgbToStr, rgbToStrAlpha } from "../../lib/Color";


// export function validateChartSetting(config:ChartSettingsI){
//   let v:any = {};

  
//   if(config.width == 0)
//     return {width:"width is 0"};

//   if(config.height == 0)
//     return {height:"height is 0"};
    

//     if( config.domain[0] >= config.domain[1] )
//     v.domain = "domain is incorrect";

//     if( config.range[0] >= config.range[1] )
//       v.range = "range is incorrect";

//   return v;
// }



export interface ChartI{
  view:StatisticView;
  config:ChartSettingsI;
}


export interface RangeI{
  start:number;
  end:number;
  color:RGBAColor;
  opacity:number;
}


export interface ChartSettingsI{
  title:string;
//   plot:boolean;
  width:number;
  height:number;
//   automaticDomain:boolean;
  domain:[number,number];
  domainLabel:string;
//   automaticRange:boolean;
  range:[number,number];
  rangeLabel:string;
  enableMinMax:boolean;
  enableMean:boolean;
  enableMedian:boolean;
  enableOutliers:boolean;
  enableCO2Ranges:boolean;
  gridX:number;
  gridY:number;
}




export type Vec = [number,number];




export function Chart(props:ChartI){
  const {view,config} = props;

//   const [canvas,setCanvas] = useState<SVGElement|null>(null);


  //const [loading,setLoading] = useState(true);
  //const [view,setView] = useState<ProcessedGraphView|null>(null)

  let {width,height} = config;
  
  const styles = {
    base:{
        marginTop:20,
        marginBottom:20
    },
    label:{
      textAlign:"center",
      fontWeight:"bold"
    } as React.CSSProperties,
    imgHolder:{
      textAlign:"center"
    } as React.CSSProperties,
    img:{
      width:"100%"
    },
    svg:{
        width:width,
        height:height,
        fontSize:"0.875rem"
    }
  }

  
  let xGutter = [100,40]; //total 140
  let yGutter = [100,60]; // total 160

  
  let bodySize:Vec = [width-xGutter[0]-xGutter[1], height-yGutter[0]-yGutter[1] ];
  let xAxisPosition:Vec = [xGutter[0],height-yGutter[1]];
  let xAxisSize:Vec = [bodySize[0],yGutter[0]];
  
  let yAxisPosition:Vec = [0,yGutter[0]];
  let yAxisSize:Vec = [xGutter[0], bodySize[1]];

  let bodyPosition:Vec = [xGutter[0],yGutter[0]];


  let titlePosition:Vec = [width/2,yGutter[0]/2];
  let yAxisTitlePosition:Vec = [10,height/2];
  let xAxisTitlePosition:Vec = [width/2,height-10];




//   useEffect( () => {
//     if(sets.length > 0){
//       // console.log("processing buffer at chart");
//       setLoading(true);
//       let processed = processGraphConfig(sensorIndex,sets,config.domain,config.width);
//       // console.log(processed);
//       setView(processed);
//       setLoading(false);
//     }else{
//       setView(null);
//     }
//   },[setHash]);

//{ranges.map( (range,i) => <PlotRange key={`range-${i}`} position={bodyPosition} size={bodySize} config={config}  range={range} />  )}
//ef={(r) => setCanvas(r)}
//   if(view == null)
//     return null;
//   else   if(loading){
//     return <div><CircularProgress color="primary" /></div>
  //}else{
    return <svg style={styles.svg} >

        <PlotGrid position={bodyPosition} size={bodySize} config={config} />

        {config.enableMedian?   [...Array(view.setCount)].map( (v,i) => <PlotLine key={`median-${i}`} view={view} setIndex={i} index={"median"} position={bodyPosition} size={bodySize} config={config} /> ):null}
        {config.enableMean?  [...Array(view.setCount)].map( (v,i) => <PlotLine key={`mean-${i}`} view={view}  setIndex={i} index={"mean"} position={bodyPosition} size={bodySize} config={config} /> ):null}
        {config.enableMinMax?  [...Array(view.setCount)].map( (v,i) => <PlotArea key={`minmax-${i}`} view={view}  setIndex={i} position={bodyPosition} size={bodySize}  config={config} /> ):null}
        {config.enableOutliers? [...Array(view.setCount)].map( (v,i) => <PlotOutliers key={`outliers-${i}`}  view={view}  setIndex={i}  position={bodyPosition} size={bodySize} config={config} /> ):null}


        <XAxisLabels position={yAxisPosition} size={yAxisSize} config={config}  />
        <YAxisLabels position={xAxisPosition} size={xAxisSize} config={config}  />

        <Title position={titlePosition} size={xAxisSize} config={config} />
        
        <YAxisTitle position={yAxisTitlePosition} size={xAxisSize} config={config}  />
        <XAxisTitle position={xAxisTitlePosition} size={xAxisSize} config={config} />

        <PlotFrame position={bodyPosition} size={bodySize} config={config} />
        


    </svg>
  //}

}


{/* <XAxis position={xAxisPosition} size={xAxisSize} />
<YAxis position={yAxisPosition} size={yAxisSize} /> */}

