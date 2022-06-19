import { ArrowBackIos } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";


interface BackButtonI{
    float?:boolean;
}

export function BackButton(props:BackButtonI){
    const {float} = props;
    
    let navigate = useNavigate();
    let style:any = {};

    if(typeof float != "undefined" && float)
        style = {position:"absolute"};

    return <IconButton style={style}  size="small" color="inherit" onClick={() => navigate("/")}> <ArrowBackIos /> </IconButton> 
}