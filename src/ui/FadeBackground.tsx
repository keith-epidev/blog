import React,{useState,useEffect, useRef} from "react";


export function FadeBackground(props:any){


    const [scrollY,setScrollY] = useState(window.scrollY);
    const [windowHeight,setWindowHeight] = useState(window.innerHeight);
    const divRef = useRef<HTMLDivElement>(null);


    useEffect( () => {

        let scrollFn = (e:any) => { setScrollY(window.scrollY); }
        let resizeFn = (e:any) => { setWindowHeight(window.innerHeight); }

        document.addEventListener('scroll', scrollFn);
        document.addEventListener('resize', resizeFn);

        return () => {
            document.removeEventListener('scroll',scrollFn,true);
            document.removeEventListener('resize',resizeFn,true);
        }
    })

    let active = false;
    if(divRef.current){
        let div = divRef.current;
        let rect = div.getBoundingClientRect()

        if( rect.top > scrollY && rect.bottom < (scrollY+windowHeight) )
            active = true;
    }

 
    let styles = {
        base:{
            background:active?"#FFF":"#000",
            color:active?"#000":"#FFF",
            transition:"background 0.5s, color 0.5s"

        }
    }


    return <div ref={divRef} style={styles.base}>
        {props.children}
    </div>


}