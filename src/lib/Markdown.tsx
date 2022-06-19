import React, { useEffect, useState,useRef, useReducer, Ref } from 'react';
import { Card, CardContent, Divider, Grid, GridSize, Paper } from "@mui/material";
import { Diagram, ExternalLink, ExternalLinkView, GridGallery, Reference, ReferenceLinkView } from "../ui/Document";
// import { Chart } from '../ui/Chart';
// import { getTemp, processStatisticSeries, StatisticSeries, statisticSeriesApply, StatisticSeriesFromBuffer } from './Statistic';
//import { loadFolder } from '../page/HeatBreakReport';
import { durationTranslator, noTranslator, PercentageTranslator, SITranslator, TimestampTranslator } from './UnitTranslator';
//import useDetectPrint from "react-detect-print";
import moment from "moment";
// import { ssFromDistribution } from './Distribution';
// import { calcPercent, dsFromfs, FramedSampleSet, frameTimeSeries, numberfined, Sample, ssFromFramedSet, StatisticSet } from './Quant';
// import { CoinMarketCapSeries } from './CoinMarketCap';
// import { seriesDomain, seriesRange } from '../page/DistributionAnalysis';
import { RGBAColor, genColorIndex } from './Color';
import { binLoader, seriesFromBin } from './Datamancer/Series';
import { processStatisticView, StatisticView } from './Datamancer/StatisticView';
import { Chart, ChartSettingsI } from '../ui/Chart';
// import { binloader } from './Loader';


/*

export async function loadFolder(folder:string,files:[string,string,RGBAColor][], crop:number){

    let items:StatisticSeries[] = [];
  
    for(let file of files){
      let buffer1 = await binloader(`${folder}/${file[0]}.bin`);
      let ss1 = StatisticSeriesFromBuffer(file[1], file[2], buffer1);
      let series = ss1.series[0];
     series = series.slice(crop*4,series.length);
     //console.log("series.length",series.length);
  
     ss1 = processStatisticSeries(ss1,series)
  
      ss1 = statisticSeriesApply(ss1,getTemp);
      ss1.start = 0;
      ss1.rate = ss1.rate;
  
      //console.log(ss1);
  
      items.push(ss1);
    }
  
    return items;
  }

  

*/

export interface Match{
    pattern:string;
    modifier:string;
    fn:Function,
    baseOnly:boolean;
    valid:(parent:string) => boolean;
}


export function getSoonestMatch(data:string,parent:string):[Match,RegExpExecArray]|null{

    

    let matches = [];
    let tests:Match[] = [

        {pattern:"((?:^\\|\\s(?:.+)\\n)+)",fn:GridView,modifier:"gm",baseOnly:true,valid:() =>  parent == ""},

        {pattern:"^(.*)\\n?\\`{3}\\n?((?:(.|\n)+?))\\`{3}",fn:CodeBlockView,modifier:"gm",baseOnly:false,valid:() => true},
        
        {pattern:"\\`(.+?)\\`",fn:CodeView,modifier:"gm",baseOnly:false,valid:() => true},


        {pattern:"^\\^\\s+(.+)", fn:CenterView, modifier:"gm", baseOnly:true, valid:() => parent == ""},

        {pattern:"^===([^=]+)===$",fn:Heading3View,modifier:"gm",baseOnly:true,valid:() => parent == "" || parent == "center"  || parent == "grid"},
        {pattern:"^==([^=]+)==$",fn:Heading2View,modifier:"gm",baseOnly:true,valid:() => parent == "" || parent == "center"|| parent == "grid"},
        {pattern:"^=([^=]+)=$",fn:Heading1View,modifier:"gm",baseOnly:true,valid:() => parent == ""|| parent == "center"},
        {pattern:"^={3,}$",fn:DividerView,modifier:"gm",baseOnly:true,valid:() => parent == ""},
      
        {pattern:"((?!^>>$)(?:^(?![\\`\\^=|-])[^\n]+\n)+)",fn:ParagraphView,modifier:"gms",baseOnly:true,valid:() => parent == ""  || parent == "grid"}, //((?:.+\n{1})+)\n
        
   //((?!^>>$)(?:^[^=\-|][^\n]+\n)+)
   //((?!^>>$)(?:^[^=|\\n]+\n)+)
        {pattern:"(?:^>>\n)((?:^[^=|\n]+\n)+)",fn:FloatView,modifier:"gms",baseOnly:true,valid:() => parent == ""}, //((?:.+\n{1})+)\n
     
         

        {pattern:"(\\n+)",fn:BreakView,modifier:"gms",baseOnly:true,valid:() => parent == "paragraph"},
        {pattern:"(\\\\n)",fn:BreakView,modifier:"gms",baseOnly:true,valid:() => parent == "heading1" || parent == "heading2" || parent == "heading3" ||  parent == "paragraph" },


        {pattern:"\\*(.+)\\*",fn:BoldView,modifier:"gm",baseOnly:false,valid:() => parent != ""},

        {pattern:"{{(.+)}}",fn:ReferenceView,modifier:"gm",baseOnly:false,valid:() => parent != ""},        
        {pattern:"<<(.+)>>",fn:LinkView,modifier:"gm",baseOnly:false,valid:() => parent != ""},
     
        {pattern:"((?:^\\s{0,4}- (?:.+)\\n)+)",fn:BulletGroupViewLevel1,modifier:"gm",baseOnly:false,valid:(parent:string) => parent == "" || parent == "grid" },
        {pattern:"((?:^\\s{4}- (?:.+)\\n)+)",fn:BulletGroupViewLevel2,modifier:"gm",baseOnly:false,valid:(parent:string) => parent == "bullet"},
       
       {pattern:"^- (.+\\n(?:^\\s{4}- (.+)\\n)*)",fn:BulletView,modifier:"gm",baseOnly:false,valid:(parent:string) => parent == "bulletGroup1"},
       {pattern:"^\\s{4}- (.+\\n(?:^\\s{8}- (.+)\\n)*)",fn:BulletView,modifier:"gm",baseOnly:false,valid:(parent:string) => parent == "bulletGroup2"},




        {pattern:"((?:^# (?:.+)\n)+)",fn:NumberGroupView,modifier:"gm",baseOnly:false,valid:(parent:string) => parent == "paragraph"},
        {pattern:"^# (.+)\n",fn:BulletView,modifier:"gm",baseOnly:false,valid:(parent:string) => parent == "numberGroup"},



       {pattern:"\\[\\[Chart:([^|]+)\\|([^|]+)\\|([^|]+)\\|([^\\]]+\\])\\]\\]",fn:ChartView,modifier:"gm",baseOnly:false,valid:() => true},
    //    {pattern:"\\[\\[ChartCreation:([^|]+)\\|([^|]+)\\]\\]",fn:ChartCreationView,modifier:"gm",baseOnly:false,valid:() => true},
        // {pattern:"\\[\\[ChartTimeSeries:([^|]+)\\|\\[([^\\]]+)\\]\\]\\]",fn:ChartTimeSeriesView,modifier:"gm",baseOnly:false,valid:() => true},
        // {pattern:"\\[\\[ChartTimeSeriesDistribution:([^|]+)\\|\\[([^\\]]+)\\]\\]\\]",fn:ChartTimeSeriesDistributionView,modifier:"gm",baseOnly:false,valid:() => true},

        
        {pattern:"\\[\\[File:([^|]+)\\|([^\\]]+)\\]\\]",fn:ImageView,modifier:"gm",baseOnly:false,valid:() => true},
        {pattern:"\\[\\[File:\\[([^|]+)\\|([^\\]]+)\\]\\[([^|]+)\\|([^\\]]+)\\]\\]\\]",fn:ImageView2,modifier:"gm",baseOnly:false,valid:() => true},
        {pattern:"\\[\\[File:\\[([^|]+)\\|([^\\]]+)\\]\\[([^|]+)\\|([^\\]]+)\\]\\[([^|]+)\\|([^\\]]+)\\]\\[([^|]+)\\|([^\\]]+)\\]\\]\\]",fn:ImageView4,modifier:"gm",baseOnly:false,valid:() => true}
    ];

    let testIndex = -1;
    let soonest = Number.MAX_VALUE
    let soonestIndex = -1;
    let soonestLength = -1;

    for(let i = 0; i < tests.length; i++){
        let test = tests[i];
        if(test.valid(parent)){
            let r = new RegExp(test.pattern,test.modifier);
            let e = r.exec(data)
            
            if(e != null){
                let len = 0;

                if(typeof e[0] != "undefined")
                    len = e[0].length;


                    //console.log(e,soonest,e.index,len,soonestLength);;

                if(soonest > e.index || ( soonest == e.index && len > soonestLength )){

                //console.log("e[0]",e[0]);

                    soonest = e.index;
                    soonestIndex = matches.length;
                    soonestLength = len;
                    testIndex = i;
                }
                matches.push(e);

            }
        }
    }

    if(matches.length > 0)
        return [tests[testIndex],matches[soonestIndex]];
    else
        return null;

}

export function parseMarkdown(data:string,path:string):[any,ExternalLink[],Reference[]]{

    let d = data;
    let references:Reference[];
    let links:ExternalLink[]

    [references,d] = getReferences(d);
    [links,d] = getLinks(d);

    // console.log("references",[d],[references]);
    // console.log("links",[d],[links]);

    return [parseSubMarkdown(d,"",links,references,path),links,references];
}

export function getLinks(data:string):[ExternalLink[],string]{
    let r = new RegExp("Links:\\n-+\\n((?:(?!References:).)+)","gms");

    let match = r.exec(data)
    if(match != null){
        //console.log("matched",match)
        let result = match[1].trim();
        let captured = match[0];
        let s = data.substring(0,match.index);
        let e = data.substring(match.index+captured.length);

        let links:ExternalLink[] = result.split("\n\n").map(v => v.split("\n")).map( l => ({id:l[0],label:l[1],href:l[2]}));


        return [links,s+e];
    }

    return [[],data];

}


export function getReferences(data:string):[Reference[],string]{
    let r = new RegExp("References:\\n-+\\n((?:(?!Links:).)+)","gms");

    let match = r.exec(data)
    if(match != null){
        //console.log("matched",match)
        let result = match[1].trim();
        let captured = match[0];
        let s = data.substring(0,match.index);
        let e = data.substring(match.index+captured.length);

        let references:Reference[] = result.split("\n\n").map(v => v.split("\n")).map( l => ({id:l[0],label:l[1],href:l[2]}));


        return [references,s+e];
    }

    return [[],data];

}

let key = 0;

export function parseSubMarkdown(data:string,parent:string,links:ExternalLink[],references:Reference[],path:string){
    let result:any[] = [];
    let d = data+"";

    while(d.length > 0){

            let matched = getSoonestMatch(d,parent);
            //console.log(parent,[d]);

            if(matched == null){
                result.push(d)
                break;
            }else{
                let [test,match] = matched;
                let previous = d.substring(0,match.index);

                let end = match.index+match[0].length;
                d = d.substr(end);
        
                result.push(previous);
                let tag = React.createElement(test.fn as any,{key:key++,data:match,links:links,references:references,path:path})//,(match,links,references,path); // React.createElement(test.fn, {key:,data:match} );
                result.push(tag);
            }
    
    }
    
    return result;
}


interface MarkDownElementProps{
    data:RegExpExecArray;
    links:ExternalLink[];
    references:Reference[];
    path:string;
}


function ReferenceView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    return <ReferenceLinkView ids={data[1].split("|")} references={references} />
}


function LinkView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    return <ExternalLinkView id={data[1]} externalLinks={links} />
}



function fixPath(src:string,path:string){
    if(src[0] == "/")
        return src;
    else
        return `${path}/${src}`;
}



function ChartView(props:MarkDownElementProps){
    const {data,links,references,path} = props;

    let label = data[1];
    let src = JSON.parse(data[2]);
    let domain = JSON.parse(data[3])
    let range = JSON.parse(data[4])

    let [view,setView] = useState<StatisticView|null>(null)
    let [config,setConfig] = useState<ChartSettingsI|null>(null)

    const parentDivRef = useRef<HTMLDivElement|null>(null);
    const loading = useRef(false);



    const timeoutRef = useRef<any|null>(null);

    function timeoutRender(){
        if(timeoutRef.current != null) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
         load();
        },5);


    }


    
    

    
      useEffect(() => {
        let f = () => {  /*console.log("resize");*/ timeoutRender(); }
        let event = window.addEventListener('resize', f);
        return () => window.removeEventListener('resize',f);
      }, []);


      function getSmallestFactorBetween(value:number,bounds:[number,number]){
        for(let i = bounds[0]; i < bounds[1]; i++){
            if(value%i == 0)
                return i;
        }
        return false;
      }

      function getSmallestFactorBetweenTwo(value1:number,value2:number,bounds:[number,number]){
        for(let i = bounds[0]; i < bounds[1]; i++){
            if(value1%i == 0 && value2%i == 0)
                return i;
        }
        return false;
      }
    
    //console.log(data);

    //const [plots,setPlots] = useState<StatisticSeries[]|null>(null);
    async function load(){
     
        let parentDiv = parentDivRef.current;
        if(parentDiv != null && !loading.current && view == null){
            loading.current = true;
            //console.log("load graph "+label);

            let width = Math.floor(parentDiv.getBoundingClientRect().width);
            //let height = Math.floor(width*0.75);
            
            let yStepBetween:[number,number] = [50,width];
            let domainDiff = domain[1] - domain[0];
            let rangeDiff = range[1] - range[0];

            let ySmallestFactor = getSmallestFactorBetweenTwo(domainDiff,width,yStepBetween);
            let gridY:number;
            console.log(width,ySmallestFactor);
            if(ySmallestFactor === false){
                
                gridY = Math.floor((width-140)/yStepBetween[0]); // decimal as factor not within target range
                console.log("factor not available",gridY)
            }else{
                gridY = domainDiff/ySmallestFactor; // integer as its a factor
            }
            let steps = (width-140)/gridY;
            
            let xStepBetween:[number,number] = [5,gridY];
            let xSmallestFactor = getSmallestFactorBetween(rangeDiff,xStepBetween);
            let gridX:number;
            if(xSmallestFactor === false){
                let heightScale = 0.66;
                gridX = Math.ceil(((width-140)*heightScale-160)/steps); // decimal as factor not within target range
            }else{
                gridX =  xSmallestFactor; // rangeDiff/xSmallestFactor; // integer as its a factor
            }


            //let heightBetween = [Math.ceil(((width-140)*0.5-160)/steps),Math.ceil(((width-140)*1-160)/steps)]

            //let gridX = Math.ceil(((width-140)*heightScale-160)/steps);



            let height = gridX*steps+160;

            let s = [];
            for(let f of src){
                let buffer = await binLoader(fixPath(f[0],path));
                let series = seriesFromBin(f[1],buffer);
                let color:RGBAColor = [f[2][0],f[2][1],f[2][2],255];
                series.color = color;
                s.push(series);
            }
            //console.log(s);
            

            let view = processStatisticView(s,domain,width-140);
            setView(view);

        

            let config:ChartSettingsI = {
                title:label,
            //   plot:boolean;
                width:width,
                height:height,
            //   automaticDomain:boolean;
                domain:domain,
                domainLabel:"Time (s)",
            //   automaticRange:boolean;
                range:range,
                rangeLabel:"Temperature (°C)",
                enableMinMax:true,
                enableMean:false,
                enableMedian:true,
                enableOutliers:true,
                enableCO2Ranges:false,
                gridX:gridX,
                gridY:gridY
            }

            setConfig(config);
            
            loading.current = false;
            //console.log("loaded",width)
        }else{
            //console.log(label+" loading blocked!")
        }




    }


    useEffect(() => {
        load();
    },[]);

    const styleSVG = {
    //    transform:"scale(0.99)"
    };



  let content = null;
  if(view == null || config == null){
    content =  <div>
        <pre>Loading Chart</pre>
        <pre>label: {label}</pre>
        <pre>src: {JSON.stringify(src)}</pre>
        <pre>domain: {JSON.stringify(domain)}</pre>
        <pre>range: {JSON.stringify(range)}</pre>
        </div>;
    }else{
        content = <Chart config={config}  view={view}  /> //label={label} xLabel="Time" yLabel={`Temperature (°C)`} //v range={range} yTranslatorFn={SITranslator} xTranslatorFn={durationTranslator} 
    }

    return <div ref={parentDivRef}>
        {content}
    </div>
}





function BreakView(props:MarkDownElementProps){
    return <br/>
}



function ImageView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    let src = fixPath(data[1],path);
    return <Diagram src={src} label={data[2]}  />
    
}





function ImageView2(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    //let result = parseSubMarkdown(data);
    // console.log(data);
    //<GridGallery diagrams={[{src:"/img/temp_sensor_tube.jpg",label:"Heat-break thermistor insert"},{src:"/img/embedded_temp_sensor.jpg",label:"Thermistor inserted into assembly"}]}/>

    let diagrams = [];
    diagrams.push({src:data[1],label:data[2]})
    diagrams.push({src:data[3],label:data[4]})
    diagrams.map( d => d.src = fixPath(d.src,path) );

    return <GridGallery diagrams={diagrams} />
    
}


function ImageView4(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    //let result = parseSubMarkdown(data);
    // console.log(data);
    //<GridGallery diagrams={[{src:"/img/temp_sensor_tube.jpg",label:"Heat-break thermistor insert"},{src:"/img/embedded_temp_sensor.jpg",label:"Thermistor inserted into assembly"}]}/>

    let diagrams = [];
    diagrams.push({src:data[1],label:data[2]})
    diagrams.push({src:data[3],label:data[4]})
    diagrams.push({src:data[5],label:data[6]})
    diagrams.push({src:data[7],label:data[8]})
    diagrams.map( d => d.src = fixPath(d.src,path) );
    // console.log(diagrams);

    return <GridGallery diagrams={diagrams} />
    
}




function GridView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    const printing = false;//useDetectPrint();

    let columns:any = [];
    
    // console.log(data[1]);

    let rows:any = data[1].trim().split("\n");
    for(let i = 0; i < rows.length; i++)
        rows[i] = rows[i].substr(1).split("|").map((cell:any) => cell.substr(1).replace(/\s+$/, ''))
    
    let column_count = rows[0].length;
    for(let i = 0; i < column_count; i++)
        columns.push("");

    
    for(let row of rows){
        for(let c = 0; c < row.length; c++)
            columns[c] += row[c]+"\n";
    }


    // console.log("rows",rows)
    // console.log("columns",columns)

    let results = [];
    for(let c = 0; c < columns.length; c++){
        results.push(parseSubMarkdown(columns[c],"grid",links,references,path));
    }



    let s = (12/column_count) as GridSize;
    let xs:GridSize = printing?s:12; // 12
    let sm:GridSize = s;

    //console.log("printing",printing,xs,md);


    return <Grid container>{results.map( (c:any,i) => <Grid key={i} item xs={xs} sm={sm} >{c}</Grid>)}</Grid>
}




function Heading1View(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    let result = parseSubMarkdown(data[1],"heading1",links,references,path);
    return <h1>{result}</h1>
}



function Heading2View(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    let result = parseSubMarkdown(data[1],"heading2",links,references,path);
    return <h2>{result}</h2>
}


function Heading3View(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    let result = parseSubMarkdown(data[1],"heading3",links,references,path);
    return <h3>{result}</h3>
}


function ParagraphView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    let result = parseSubMarkdown(data[1],"paragraph",links,references,path);
    let style = {
        display:"block",
        marginBlockStart:"1em",
        marginBlockEnd:"1em",   
        marginInlineStart:"0px",
        marginInlineEnd:"0px"
        
    }

    return <div style={style}>{result}</div>
}




function FloatView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    let result = parseSubMarkdown(data[1],"paragraph",links,references,path);
    let s:any = {
        display:"block",
        marginBlockStart:"1em",
        marginBlockEnd:"1em",   
        marginInlineStart:"0px",
        marginInlineEnd:"0px",
        float:"right"
    }

    return <div style={s}>{result}</div>
}

function CenterView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    let result = parseSubMarkdown(data[1],"center",links,references,path);
    return <div style={{textAlign:"center"}}>{result}</div>
}


function BoldView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    let result = parseSubMarkdown(data[1],"bold",links,references,path);
    return <b>{result}</b>
}

function DividerView(props:MarkDownElementProps){
    let s = {
        marginTop:17.5,
        marginBottom:17.5
    }
    return <Divider style={s} />
}


function BulletGroupViewLevel1(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    //console.log("bulletGroup",data);
    let s = {
     //   margin:0
    }
    let result = parseSubMarkdown(data[1],"bulletGroup1",links,references,path);
    return <ul style={s}>{result}</ul>;
}

function BulletGroupViewLevel2(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    //console.log("bulletGroup",data);
    let s = {
     //   margin:0
    }
    let result = parseSubMarkdown(data[1],"bulletGroup2",links,references,path);
    return <ul style={s}>{result}</ul>;
}

function NumberGroupView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    //console.log("numberGroup",data);
    let result = parseSubMarkdown(data[1],"numberGroup",links,references,path);
    return <ol>{result}</ol>;
}

function BulletView(props:MarkDownElementProps){
    const {data,links,references,path} = props;
    //console.log("bullet",data);
    let result = parseSubMarkdown(data[1],"bullet",links,references,path);
    return <li>{result}</li>;
}



function CodeBlockView(props:MarkDownElementProps){
    const {data,links,references,path} = props;

    const styles = {
        pre:{
            fontSize:14,
            margin:0
        },
        card:{
            //display:"inline"
        },
        cardContent:{

            //display:"inline",
            paddingLeft:16,
            paddingRight:16,
            paddingTop:8,
            paddingBottom:8
        },
        comment:{
            display:"block",
            marginBlockStart:"1em",
            marginBlockEnd:"-1em",   
            marginInlineStart:"0px",
            marginInlineEnd:"0px"
        }
    }
    
    let comment = data[1];
    console.log(comment);
    let commentResult = parseSubMarkdown("\n"+comment+"\n","",links,references,path);
    let content = data[2]//.trim();

    return <React.Fragment>
        {comment.length > 0 ? <div style={styles.comment}>{commentResult}</div>:null}
        <Card variant="outlined" style={styles.card}>
            <CardContent style={styles.cardContent}>
            <pre style={styles.pre}>{content}</pre>
            </CardContent>
        </Card>
        </React.Fragment>;
}

function CodeView(props:MarkDownElementProps){
    const {data,links,references,path} = props;

    const styles = {
        pre:{
            fontSize:14,
            margin:0,
            whiteSpace: "nowrap",
            fontFamily: "monospace"
        } as React.CSSProperties,
        card:{
            display:"inline"
        },
        cardContent:{

            display:"inline",
            paddingLeft:4,
            paddingRight:4
        }
    }
    
    
    let content = data[1]//.trim();

    return <Card variant="outlined" style={styles.card} >
         <CardContent style={styles.cardContent}>
             <span style={styles.pre}>{content}</span>
             </CardContent>
             </Card>
}


/*

<Card variant="outlined" style={{display:"inline"}} >
            <CardContent style={{display:"inline"}}>



            </CardContent>
        </Card>;
        */