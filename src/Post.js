import React, {useEffect, useState} from 'react';
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import {getHeaders} from "./utils";
import AddComment from "./AddComment";

export default function Post({post ,token}) {
    const [likeID,setLikeID] = useState(post.current_user_like_id);
    const [bookmarkID,setBookmarkID] = useState(post.current_user_bookmark_id);
    const [likeLength,setLikeLength] = useState(post.likes.length);
    const [commentLength, setCommentLength] = useState(post.comments.length);
    const [commentPost, setCommentPost] = useState(post.comments);

    async function requeryPost(){
        const response = await fetch(`/api/posts/${post.id}`, {
            headers: getHeaders(token)
        });
        const data = await response.json();

        setLikeID(data.current_user_like_id);
        setBookmarkID(data.current_user_bookmark_id);
        setLikeLength(data.likes.length);
        setCommentPost(data.comments);
        setCommentLength(data.comments.length);
    }

    function showLastComment(){
        const lastComment = commentPost[commentLength-1];
        return(
        <div>
            <p>
                <strong>{lastComment.user.username}</strong>
                {lastComment.text}
            </p>
            <p className="timestamp">
                {lastComment.display_time}
            </p>
        </div>
        );

    }

    function ShowComments(){
        return(
            commentPost.map(comment =>{
                return(
                    <div className={"caption"}>
                        <p>
                            <strong>{comment.user.username}</strong>
                            {comment.text}
                        </p>
                        <p className="timestamp">
                            {comment.display_time}
                        </p>
                    </div>
                )
            })
        )
    }
    return (
        <div className="card" key={post.id}>
            <div className="header">
                <h3>{post.user.username}</h3>
                <i className="fa fa-dots"></i>
            </div>
            <img src={post.image_url} />
            <div className="info">
                <div className="buttons">
                    <div>
                        <LikeButton post={post} likeID={likeID} token={token} requery={requeryPost} />
                        <i className={"far fa-comment"}></i>
                        <i className={"far fa-paper-plane"}></i>
                    </div>
                    <div>
                        <BookmarkButton post={post} bookmarkID={bookmarkID} token={token} requery={requeryPost}/>
                    </div>
                </div>
                <p className={"likes"}>
                    <strong>
                        {likeLength} Likes
                    </strong>
                </p>
                <div className={"caption"}>
                    <p>
                        <strong>
                            {post.user.username}
                        </strong>
                        {post.caption}
                    </p>
                    <p className={"timestamp"}>{post.display_time}</p>
                </div>
                {commentLength > 1 ? <button onClick={
                    ()=>{
                        document.getElementById("modal"+post.id).classList.remove("hidden");
                    }
                } className={"link"}><div>view all {commentLength} comment</div></button>:''}
                <div className={"comments"}>
                    {commentLength > 0 ?
                        showLastComment()
                        :
                        ''
                    }

                </div>
                <AddComment post={post} token={token} requery={requeryPost} />

            </div>
            <div id={"modal"+post.id} className="modal-bg hidden">
                <button type="button" className="close" onClick={()=>{
                    document.getElementById("modal"+post.id).classList.add("hidden");
                }} aria-label="Close Button"><i className="fas fa-times"></i></button>

                <div className="modal" role="dialog" aria-live="assertive">
                    <div className="featured-image">
                        <img src={post.image_url} />
                    </div>
                    <div className="container">
                        <h3><img className="pic" alt="Profile of the person who created the post"
                                 src={post.user.thumb_url}/> {post.user.username}</h3>
                        <div className="body">
                            <div className="caption">
                                <p><strong>{post.user.username}</strong>
                                    {post.caption}
                                </p>
                                <p className="timestamp">{post.display_time}</p>
                            </div>
                            <ShowComments/>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );



};