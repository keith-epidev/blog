import React, { useEffect, useState,useRef, useReducer } from 'react';

import {Link} from "../ui/Link"
import useMediaQuery from '@mui/material/useMediaQuery';

import {Card, CardContent, Container, Grid, Divider, Theme, CircularProgress, LinearProgress, Button} from "@mui/material";
import { Diagram, ExternalLink, ExternalLinkList, PrintCard, Reference, ReferenceLinkView, ReferenceList } from '../ui/Document';

import { parseMarkdown } from '../lib/Markdown';
import { BackButton } from '../ui/BackButton';
import { useParams } from 'react-router-dom';

export function Post(props:any) {

  const params = useParams();
  const sm = useMediaQuery((theme:Theme) => theme.breakpoints.down('sm'));

  const printing = false;//useDetectPrint();


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
    }
  
  }

  const [result,setResult] = useState<null|[any,ExternalLink[],Reference[]]>(null);
  const loading = useRef(false);

  
  async function load(){
    
    if(!loading.current && result == null){
      loading.current = true;
      const id = params.id;
      let path = `/post/${id}`
      let response = await fetch(`${path}/index.mdx`)
      let text = await response.text();

    //  console.log(response);
      if(response.status != 200 || text.indexOf("Only files inside the `public` folder can be referenced from the HTML.") != -1){
        setResult(parseMarkdown(`^   ==Post not found!==`,path))
        return;
      }
      let result = parseMarkdown(text,path);
      setResult(result);
      loading.current = false;
    }else{
      //console.log("blocked reload");
    }
  }

  const forceUpdate = useReducer((x) => x + 1, 0)[1];
  useEffect( ()=>{
    load();
  },[]);


  if(result == null)
    return null;
else{

  let md = result[0];
  const links:ExternalLink[] = result[1];
  const references:Reference[] = result[2];


return <div style={styles.body}>
  <Container maxWidth="lg" style={styles.container}>
    <Grid container>
      <Grid item xs={12}>
      <PrintCard>
        
          {(!sm&&!printing)?<BackButton float={true} />:null}
          <div style={styles.content}>  
            <Grid container spacing={6}>

              <Grid item xs={12}>{md}</Grid>

              <Grid item xs={12}>
              <Divider />
              </Grid>

              <ReferenceList references={references} />
              <ExternalLinkList links={links} />
         
              <Grid item xs={12}>
                <p>If you have any comments, corrections or feedback please feel free to email me at <a href="mailto:keith@epidev.com">keith@epidev.com</a></p>
              </Grid>

              {printing?null:<Grid item xs={12}>
                <BackButton float={false} /> <Link to="/">Return to home</Link>
              </Grid>}

            </Grid>
          </div>
      
      </PrintCard>
    </Grid>
  </Grid>
</Container>


</div>

  }

}


