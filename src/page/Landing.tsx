import React from 'react';

import {AppBar, Card, CardContent, Container, Grid} from "@mui/material";
import { Link } from '../ui/Link';
import { Header } from '../ui/Header';
import { PostList } from '../ui/PostList';

export function Landing() {

  const styles = {
    body:{
      paddingTop:20
    },
    content:{
      paddingLeft:20,
      paddingRight:20
    }
  }


  return <div style={styles.body}>


<Container maxWidth="lg">
<Grid container>
  <Grid item xs={12}>
  <Card>
    <CardContent>
      <div style={styles.content}>
        
      <Grid container spacing={10}>
        <Grid item xs={12} md={4}>
          <div style={{textAlign:"left"}}>
            <h2>Keith Brown</h2>
            <h3>Computer Science &amp;<br/> Electronics Engineering</h3>
            <div>Melbourne, AUS</div><br/>
            <div><Link href="mailto:keith@epidev.com">keith@epidev.com</Link></div>
            <br/>
            <div><Link to="/resume">Resume</Link></div><br/>
         
            <br/>
            <div>I am interested in <br/>Artificial Intelligence, <br/>Computational Metaphysics, <br/>3D Printing and Rock Climbing.</div>
            <br/>
          </div>
        </Grid>
        <Grid item  xs={12} md={8}>
          <h2>Posts</h2>

          <PostList />
        
        </Grid>
      </Grid>
  </div>
    </CardContent>
  </Card>



  </Grid>
</Grid>

</Container>

  </div>
}


/*   <div><Link to="/readingList">Reading List</Link></div>*/

/*

  
          <div><Link to="/post/distributionAnalysis" >2/09/21 - Chess engine</Link></div>  
          <div><Link to="/post/distributionAnalysis" >2/09/21 - Node JS Buffer compare</Link></div> 
          <div><Link to="/post/distributionAnalysis" >2/09/21 - Programming Cellular Automata</Link></div> 

          <div><Link to="/post/distributionAnalysis" >2/09/21 - Naive symbolic compression</Link></div>  
          <div><Link to="/post/you_are_not_alive" >2/09/21 - You are (not) alive</Link></div>  
          <div><Link to="/post/distributionAnalysis" >25/09/21 - Distribution Analysis</Link></div>  
          <div><Link to="/post/heatbreak" >25/08/21 - 3D Printer Heat-break Comparison</Link></div>  
        */