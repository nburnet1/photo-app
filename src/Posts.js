import React from 'react';
import {getHeaders} from './utils';
import { useState, useEffect } from "react";
import Post from "./Post";


export default function Posts({token}) {

    // define the posts as a state variable that is initialized to null
    const [posts, setPosts] = useState(null);

    // wrap all fetch function definitions and invocations
    // in a useEffect()
    useEffect(() => {
        async function fetchPosts() {
            const response = await fetch('/api/posts', {
                headers: getHeaders(token)
            });
            const data = await response.json();
            setPosts(data);
        }
        fetchPosts();
    }, [token]);


    if (!posts) {
        return '';
    }
    return (

        posts.map(post =>{
            return(<Post post={post} token={token}/>);
        })


    );
}