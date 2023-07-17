import React from 'react';
import {getHeaders} from './utils';



export default function BookmarkButton({post,token,requery,bookmarkID}) {
    async function postBookmark() {
        console.log("Bookmarking");
        const response = await fetch(`api/bookmarks/`, {
            method : "POST",
            headers: getHeaders(token),
            body: JSON.stringify({"post_id" : post.id})
        });
        const data = await response.json();
        console.log(data);
        requery();
    }

    async function deleteBookmark(){
        console.log("Unbookmarking");
        const response = await fetch(`api/bookmarks/${bookmarkID}`, {
            method : "DELETE",
            headers: getHeaders(token)
        });
        const data = await response.json();
        console.log(data);
        requery();

    }
    return (bookmarkID ?
        <button className="bookmark" aria-label="Unbookmark" role="switch" aria-checked={"true"} onClick={deleteBookmark}><i className={"fa-solid fa-bookmark"}></i></button> :
        <button className="bookmark" aria-label="Bookmark" role="switch" aria-checked={"false"} onClick={postBookmark}><i className={"fa-regular fa-bookmark"}></i></button>);
}
