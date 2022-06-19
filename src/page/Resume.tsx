import React, { useEffect, useState,useRef, useReducer } from 'react';


import {Link} from "../ui/Link"
import useMediaQuery from '@mui/material/useMediaQuery';

import {Card, CardContent, Container, Grid, Divider, Theme, CircularProgress, LinearProgress} from "@mui/material";

import { Diagram, ExternalLink, PrintCard, Reference, ReferenceLinkView } from '../ui/Document';
import { parseMarkdown } from '../lib/Markdown';
import { BackButton } from '../ui/BackButton';
//import useDetectPrint from "react-detect-print";




export function Resume(props:any) {

  const sm = useMediaQuery((theme:Theme) => theme.breakpoints.down('sm'));

  const printing = true;//useDetectPrint();


  let slim = printing||sm;

  const styles = {
    body:{
      paddingTop:slim?0:20
    },
    base:{
      width:600
    },
    title:{
      textAlign:"center"
    } as React.CSSProperties,
    divider:{
      marginTop:40,
      marginBottom:40
    },
    content:{
      paddingLeft:slim?0:20,
      paddingRight:slim?0:20
    },
    container:{
      paddingLeft:slim?0:16,
      paddingRight:slim?0:16
    },
    download:{
      textAlign:sm?"auto":"right"
    }as React.CSSProperties
    
  
  }
  

  const [result,setResult] = useState<null|[any,ExternalLink[],Reference[]]>(null);

  
  async function load(){
    let path = `/resume`
    let response = await fetch(`${path}/index.mdx`)
    let text = await response.text();

    //console.log(response);
    if(response.status != 200 || text.indexOf("Only files inside the `public` folder can be referenced from the HTML.") != -1){
      setResult(parseMarkdown(`|\t==Post not found!==`,path))
      return;
    }
    let result = parseMarkdown(text,path);
    setResult(result);
  }

  const forceUpdate = useReducer((x) => x + 1, 0)[1]
  useEffect( ()=>{
    load();
  },[]);


  if(result == null)
    return null;
else{

  let md = result[0];
  const links:ExternalLink[] = result[1];
  const references:Reference[] = result[2];


  let content = <div style={styles.content}>  
  <Grid container spacing={6}>
    <Grid item xs={12}>{md}</Grid>
      {printing?null:<React.Fragment>
        {sm?<React.Fragment>                          
          <Grid item xs={12} style={styles.download}>
            Download: <Link href="/resume/Keith Brown.pdf" download="Keith Brown Resume.pdf">PDF version</Link> | <Link href="/resume/index.mdx" download="Keith Brown Resume.mdx" >Markdown source</Link>
          </Grid>
          <Grid item xs={12}>
            <BackButton float={false} /> <Link to="/">Return to home</Link>
          </Grid>
        </React.Fragment>:<React.Fragment>
        <Grid item xs={6}>
          <BackButton float={false} /> <Link to="/">Return to home</Link>
      </Grid>
        <Grid item xs={6} style={styles.download}>
          Download: <Link href="/resume/Keith Brown.pdf" download="Keith Brown Resume.pdf">PDF version</Link> | <Link href="/resume/index.mdx" download="Keith Brown Resume.mdx" >Markdown source</Link>
      </Grid>
    </React.Fragment>}
  </React.Fragment>}
  </Grid>
</div>


return <div style={styles.body}>
  <Container maxWidth="lg" style={styles.container}>
    <Grid container>
      <Grid item xs={12}>
      {printing?content:<Card><CardContent>{content}</CardContent></Card>}
    </Grid>
  </Grid>
</Container>
</div>

  }

}

