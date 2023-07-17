import React from 'react';
import { useState, useEffect } from "react";
import {getHeaders} from './utils';

export default function AddComment({post,token,requery}) {
    const [commentValue, setCommentValue] = useState('');

    function handleChange(event) {
        setCommentValue(event.target.value);
    }

    async function postComment() {
        const comment = document.getElementById(post.id).value
        console.log("Posting Comment");
        const response = await fetch('/api/comments/', {
            method : "POST",
            headers: getHeaders(token),
            body: JSON.stringify({
                "post_id" : post.id,
                "text": commentValue
            })
        });
        const data = await response.json();
        console.log(data);
        document.getElementById(post.id).value = "";
        document.getElementById(post.id).focus();
        requery();
    };

    return (
        <div className="add-comment">
            <div className="input-holder">
                <input onKeyDown={(event)=>{
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        postComment();
                    }
                }} type="input" onChange={handleChange}  id={post.id} className="comment-textbox" aria-label="Add a comment" placeholder="Add a comment..." data-ddg-inputtype="unknown"/>
            </div>
            <button type="button" onClick={postComment} className="link">Post</button>
        </div>

    );

}