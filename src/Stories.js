import React from 'react';
import { useState, useEffect } from "react";
import {getHeaders} from './utils';

export default function Stories({token}) {

    const [stories, setStories] = useState(null);

    // wrap all fetch function definitions and invocations
    // in a useEffect()
    useEffect(() => {
        async function fetchStories() {
            const response = await fetch('/api/stories/', {
                headers: getHeaders(token)
            });
            const data = await response.json();
            setStories(data);
        }
        fetchStories();
    }, [token]);



    if (!stories) {
        return '';
    }

    return (

        stories.map(story =>{
            return(
                <div><img src={story.user.thumb_url} className="pic" alt="profile pic for haley"/>
                    <p>{story.user.username}</p>
                </div>
            )

        })

    );

}