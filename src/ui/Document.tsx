import { Card, CardContent, Grid, Theme, useMediaQuery } from "@mui/material";
//import useDetectPrint from "react-detect-print";




interface ReferenceListI{
  references:Reference[]
}


export function ReferenceList(props:ReferenceListI){

  const {references} = props;

  if(references.length == 0)
    return null;


  return <Grid item xs={12}>
      <h2 id="references">References</h2>
      <ol>
        {references.map((link,i) => {
          return <li key={i}>{link.label} - <a href={link.href}>{link.href}</a></li>
        })}
      </ol>

    </Grid>
}


interface ExternalLinkListI{
  links:ExternalLink[]
}


export function ExternalLinkList(props:ExternalLinkListI){

  const {links} = props;

  if(links.length == 0)
    return null;

  return <Grid item xs={12}>       
    <h2>External Links</h2>
    <ol>
      {links.map((link,i) => {
      return <li key={i}>{link.label} - <a href={link.href}>{link.href}</a></li>
      })}
    </ol>
  </Grid>

}



  export interface ExternalLinkViewI{
    id:string;
    externalLinks:ExternalLink[]
  }

  export function ExternalLinkView(props:ExternalLinkViewI){
    let {id,externalLinks} = props;
    let index = externalLinks.map(e => e.id).indexOf(id);

    if(index == -1)
      return <span style={{color:"red"}}>Link '{id}' not found</span>

    let item = externalLinks[index];

    return <a href={item.href}>{item.label}</a>
  }

  export interface ReferenceLinkViewI{
    ids:string[];
    references:Reference[];
  }

  export function ReferenceLinkView(props:ReferenceLinkViewI){
    let {ids,references} = props;
    let indexes = ids.map( id => references.map(e => e.id).indexOf(id) );
    //let item = references[];
    let str =  indexes.map(i => i+1).map( i => (i == 0) ? "NA" : i  ).join(", ")

    return <a href="#references">[{str}]</a>
  }


  export interface ExternalLink{
    id:string;
    label:string;
    href:string;
  }
  
  export interface Reference{
    id:string;
    label:string;
    href:string;
  }




interface DiagramI{
  src:string;
  label:string;
  percentage?:number;
}

export function Diagram(props:DiagramI){
  
  const {src,label,percentage} = props;


  const sm = useMediaQuery((theme:Theme) => theme.breakpoints.down('sm'));
  let p:number;
  if(typeof percentage != "undefined")
    p = percentage;
  else
    p = sm ? 100 : 65;

  const styles = {
    base:{
      marginLeft:sm?0:40,
      marginRight:sm?0:40,
      marginTop:40,
      marginBottom:40
    },
    label:{
      textAlign:"center",
      fontWeight:"bold"

    } as React.CSSProperties,
    imgHolder:{
      
      textAlign:"center"
    } as React.CSSProperties,
    img:{
      width:`${p}%`,
      margin:"auto"
    }



  }


  return <div style={styles.base}>

      <div style={styles.imgHolder}>
        <img src={src} style={styles.img} />
      </div>

    <div style={styles.label}>{label}</div>

  </div>





}

interface GridGalleryI{
  diagrams:DiagramI[];
}

export function GridGallery(props:GridGalleryI){
  const {diagrams} = props;


  const matches = useMediaQuery((theme:Theme) => theme.breakpoints.up('sm'));
  let percentage = 100;
  if(matches){
    percentage = 80;
  }

  return <Grid container>
    {diagrams.map(d => {
      return <Grid key={d.src} item xs={12} md={6}>
        <Diagram src={d.src} label={d.label} percentage={percentage} />
      </Grid>
    })}
  </Grid>
            
}




export function PrintCard(props:any){
  const sm = useMediaQuery((theme:Theme) => theme.breakpoints.down('sm'));
  const printing = false;//useDetectPrint();

  if(printing){
    return props.children;
  }else{
    return  <Card>
    <CardContent>
      {props.children}
      </CardContent>
      </Card> 
  }




}