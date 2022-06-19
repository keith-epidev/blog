import React,{ useEffect, useState } from "react"
import { Link } from "./Link";

interface PostLink{
    key:string;
    label:string;
    date:string;
}


export function PostList(props:any){


    const [posts,setPosts] = useState<PostLink[]|null>(null);


    async function load(){
        let file = await fetch("/post/index")
        let list:PostLink[] = (await file.text()).split("\n\n").map( l => l.split("\n")).map( l => ({key:l[2],label:l[1],date:l[0]})) ;
        setPosts(list);
    }


    useEffect( () => {
        load();
    },[]);


    if(posts == null)
        return null;
    else
        return <div>
            {posts.map( post => <div key={post.key}><Link to={`/post/${post.key}`} >{post.date} |  {post.label}</Link></div>)}
        </div>







}