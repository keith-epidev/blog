import * as React from "react";
import * as ReactDOM from "react-dom";
import * as reactRouterDom from 'react-router-dom'

import { Link as RouterLink } from 'react-router-dom'
import { Link as MLink}  from '@mui/material';


export function Link(props:any){

       const styles = {
            base:{
                textDecoration:"none"
            } as React.CSSProperties
        };
        
        const style = Object.assign({}, styles.base, props.style);
        const MyLink = (props:any) => <RouterLink to={props.to} {...props} />

        if(typeof props.href == "undefined")
            return <MLink component={RouterLink} className={props.className} style={style} color={props.color} to={props.to} >{props.children}</MLink>
        else
            return <MLink  download={props.download} style={style} className={props.className} color={props.color} target="_blank" href={props.href}>{props.children}</MLink>
    
};