import React from 'react';
import { useState, useEffect } from "react";
import {getHeaders} from './utils';


export default function Suggestion({suggestion, token}){
    const [followID,setFollowID] = useState(null);

    async function follow() {
        console.log("Following");
        const response = await fetch(`api/following/`, {
            method : "POST",
            headers: getHeaders(token),
            body: JSON.stringify({"user_id" : suggestion.id})
        });
        const data = await response.json();
        console.log(data);
        setFollowID(data.id);
    };

    async function unfollow(){
        const response = await fetch("api/following/"+followID, {
            method : "DELETE",
            headers: getHeaders(token)
        });
        const data = await response.json();
        console.log(data);
        setFollowID(null);
    }



    return (
        <section id=""><img src={suggestion.thumb_url} className="pic" alt="Profile pic for "/>
            <div>
                <p>{suggestion.username}</p>
                <p>suggested for you</p>
            </div>
            <div>
                {(followID ?
                    <button role="switch" onClick={unfollow} className="link following active" aria-checked="true" aria-label="Unfollow">unfollow</button> :
                    <button role="switch" onClick={follow} className="link following" aria-checked="false" aria-label="Follow">follow</button>)}
            </div>
        </section>
    );

}