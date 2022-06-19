import { default as React, useContext, useState } from 'react';

import { AppBar, Toolbar, IconButton, Typography } from '@mui/material'
import {Link} from './Link'
import { useNavigate } from "react-router-dom";
import { ArrowBackIos } from "@mui/icons-material";


interface HeaderI{
    title:string;
    back:boolean;
}


export function Header(props: HeaderI) {

    let navigate = useNavigate();

    const {title, back} = props;

    const styles = {
        root: {
            flexGrow: 1,
            userSelect: "none"
        } as React.CSSProperties,
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginLeft: -12,
            marginRight: 20,
        },
        logo: {
            height: 24
        },
        title: {
            display: "inline"
        }
    };


    function goBack() {
        navigate(-1);
    }



    return <React.Fragment>
        <AppBar position="fixed" style={styles.root} color="default">
            <Toolbar variant="dense">

                {back ? <IconButton edge="start" size="small" color="inherit" onClick={goBack}> <ArrowBackIos /> </IconButton> : null}

                <div style={styles.grow}>
                    <Link to="/" color="inherit">
                        <Typography variant="h6" style={styles.title} color="inherit">{title}</Typography>
                    </Link>
                </div>
                
           </Toolbar>
        </AppBar>
        

    </React.Fragment>
}
