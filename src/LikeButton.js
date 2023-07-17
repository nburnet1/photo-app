
import React from 'react';
import {getHeaders} from './utils';



export default function LikeButton({post,token,requery,likeID}) {
    async function likePost() {
        console.log("Liking");
        const response = await fetch(`api/posts/likes/`, {
            method : "POST",
            headers: getHeaders(token),
            body: JSON.stringify({"post_id" : post.id})
        });
        const data = await response.json();
        console.log(data);
        requery();
    }

    async function unlikePost(){
        console.log("Unliking");
        const response = await fetch("api/posts/likes/"+likeID, {
            method : "DELETE",
            headers: getHeaders(token)
        });
        const data = await response.json();
        console.log(data);
        requery();

    }
    return (likeID ?
        <button className="like" aria-label="Unlike" role="switch" aria-checked={"true"} onClick={unlikePost}><i className={"fas fa-heart"}></i></button> :
        <button className="like" role="switch" aria-label="Like" aria-checked={"false"} onClick={likePost}><i className={"fa-regular fa-heart"}></i></button>);
}
