import React, { useEffect, useState,useRef, useReducer } from 'react';


import {Link} from "../ui/Link"
import useMediaQuery from '@mui/material/useMediaQuery';

import {Card, CardContent, Container, Grid, Divider, Theme, CircularProgress, LinearProgress, Typography, TableHead, Table, TableCell, TableRow, TableBody} from "@mui/material";

import { Diagram, ExternalLink, PrintCard, Reference, ReferenceLinkView } from '../ui/Document';
import { BackButton } from '../ui/BackButton';
//import useDetectPrint from "react-detect-print";




export function ReadingList(props:any) {

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
    },
    download:{
      textAlign:sm?"auto":"right"
    }as React.CSSProperties
    
  
  }
  

  const [result,setResult] = useState<any>(null);

  
  async function load(){
    let path = `/data/readingList`
    let response = await fetch(`${path}/index.mdx`)
    let text = await response.text();
    
     if(response.status != 200 || text.indexOf("Only files inside the `public` folder can be referenced from the HTML.") != -1){
       setResult("not found")
     }else{

        let books:any = text.split("\n\n").map( (b:any) => b.split("\n"));
        


        let table = <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Author</TableCell>
                    <TableCell>Published</TableCell>
                    <TableCell>Read</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Comment</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {books.map( (b:any) => <TableRow>
                    <TableCell>{b[0]}</TableCell>
                    <TableCell>{b[1]}</TableCell>
                    <TableCell>{b[2]}</TableCell>
                    <TableCell>{b[3]}</TableCell>
                    <TableCell>{b[4]}</TableCell>
                    <TableCell></TableCell>
                </TableRow>)}
            </TableBody>
        </Table>


         setResult(table);

         
     }
    
  }

  const forceUpdate = useReducer((x) => x + 1, 0)[1]
  useEffect( ()=>{
    load();
  },[]);


  if(result == null)
    return null;
else{



return <div style={styles.body}>
  <Container maxWidth="lg" style={styles.container}>
    <Grid container>
      <Grid item xs={12}>
      <PrintCard>
            
          <div style={styles.content}>  
            <Grid container spacing={6}>

              <Grid item xs={12}>
                  <h1>Reading List</h1>
                    <Divider />
                    <p>Welcome to my reading list. This is simply a place to keep and share a record of works that I have read. I have never been much of a reader but have managed to instil a routine and this list is a form of encouragement to keep it going.</p>
              </Grid>

              <Grid item xs={12}>   
                {result}
              </Grid>

            <Grid item xs={12}>
                <BackButton float={false} /> <Link to="/">Return to home</Link>
            </Grid>


            </Grid>
          </div>
        </PrintCard>
    </Grid>
  </Grid>
</Container>
</div>

  }

}

