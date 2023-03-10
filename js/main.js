import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';

//Show functions
const showStories = async (token) => {
    const endpoint = `${rootURL}/api/stories/?limit=5`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log('Stories:', data);


    const htmlOutput = data.map(storiesToHTML).join('');
    document.querySelector(".story-list").innerHTML = htmlOutput;


}

const showPosts = async (token) => {
    const endpoint = `${rootURL}/api/posts`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();

    console.log('Posts:', data);


    const htmlOutput = data.map(postToHTML).join('');
    document.querySelector(".post-div").innerHTML = htmlOutput;

    let commentButton = document.querySelectorAll(".show-all-comments");

    for(let i = 0; i < commentButton.length; i++){
        commentButton[i].onclick = () => {
            showModal(commentButton[i].id);
        }
    }


    let modal = document.querySelectorAll(".close-modal");


    for(let i = 0; i < modal.length; i ++){
        modal[i].onclick = () =>{
            closeModal(modal[i].id);
        }
    }
    


    


}

const showProfile = async (token) => {
    const endpoint = `${rootURL}/api/profile`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    
    const data = await response.json();



    console.log('Profile:', data);

    document.querySelector("nav").innerHTML = navToHTML(data);
    document.querySelector("header").innerHTML = userSectionToHTML(data);

    return data;
}

const showSuggestions = async (token) => {
    const endpoint = `${rootURL}/api/suggestions`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();

    console.log('Suggestions:', data);

    let htmlOutput = ``;

    for(let i = 0; i < data.length; i++){
        htmlOutput += suggestionsToHTML(data[i]);
    }
    document.querySelector(".suggestions").innerHTML = htmlOutput;
}

const showFollowing = async (token) => {
    const endpoint = `${rootURL}/api/following`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();

    console.log('Following:', data);

    return data;
}

const showModalComments = data =>{
    let tempHTML = ``;

    for(let i = 0; i < data.comments.length; i++){
        tempHTML += `
        <div class="modal-comment-block">
        <img class="modal-user-pfp" src="${data.comments[i].user.thumb_url}"/>
        <div class="modal-post-user"><a href=""><b>${data.comments[i].user.username}</b></a></div>
        <div class="modal-comment-text">${data.comments[i].text}</div>
        </div>
        <div class="post-date">
                    ${data.comments[i].display_time}
        </div>


        `

    }
    return tempHTML;
}

const showModal = (id) =>{
    console.log(id);
    let modal = document.getElementById("modal"+id);
    modal.classList.remove('hidden');
    modal.setAttribute("aria-hidden", 'false');
    modal.tabIndex = -1;
    modal.focus();
}
const closeModal = (id) =>{
    console.log(id);
    let modal = document.getElementById("modal"+id);
    modal.classList.add('hidden');
    modal.setAttribute("aria-hidden", 'true');
    modal.tabIndex = -1;
    modal.focus();
}



const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'noah', 'noah_password');

    // then use the access token provided to access data on the user's behalf
    const profileData = await showProfile(token);
    showFollowing(token);
    showSuggestions(token);
    showStories(token);
    showPosts(token);
    
}


//To HTML Functions
const storiesToHTML = (data) =>{
    return `
    <a href=""><li class="story">
    <img class="story-pfp" src="${data.user.thumb_url}"/>
    <p class="user">${data.user.username}</p>
    </li> </a>
    `

}

const navToHTML = (data) => {
    return `
    <h1>Photo App</h1>
    <ul>
        <li>${data.username}</li>
        <li><a href="">Sign Out</a></li>
    </ul>
    
    `

}

const userSectionToHTML = (data) => {
    return `
    <header>
                <ul class="user-section">
                    <li class="logged-img">
                        <img class="user-pfp" src="${data.thumb_url}"/>
                    </li>
                    <li class="logged-user">
                        <b><h2>${data.username}</h2></b>
                    </li>
                    <li>
                        
                    </li>
                    
                    
                </ul>
                
    </header>
    `

}

const suggestionsToHTML = (data) => {
    return `
    <ul class="suggestion-list">
                        <li>
                            <img class="user-pfp" src="${data.thumb_url}"/>
                        </li>
                        <li class="suggested-user">
                            <h3><b>${data.username}</b></h3>
                            <p>Suggested For You</p>
                        </li>
                        <li id="class_follow_${data.id}"class="follow">
                            ${checkFollow(data)}
                        </li>
    </ul>
    `
}

const postToHTML = (data) => {
    return `
    <section id="card_${data.id}" class="card">
                <ul class="post">
                    <li class="post-head">
                        <h4 class="post-user">
                            ${data.user.username}
                        </h4>
                        <a href=""><i class="fa-solid fa-ellipsis"></i></a>
                    </li>
                    
                    <li class="pic-post">
                        <img class="post-img" src="${data.image_url}" />
                    </li>
                    <li class="icons-list">
                        <div class="interact-list">
                            ${checkHeart(data)}
                            <button class="fa-regular fa-comment"></button>
                            <button class="fa-regular fa-paper-plane"></button>
                        </div>
                        <div>
                            ${checkBookmark(data)}
                        </div>
                        
                    </li>
                    <li class="likes" >
                        <div id="likes_${data.id}">
                        <b>${data.likes.length} Likes</b>
                        </div>
                    </li>
                    <li class="post-des">
                        <div class="post-user"><a href=""><b>${data.user.username}</b></a></div>
                        <div class="description">
                        ${data.caption}
                        </div>
                        
                    </li>
                    <div class="post-date">
                    ${data.display_time}
                    </div>
                    <li id="comment_list_${data.id}" class="comments">
                        
                        ${checkComments(data)}


                    </li>
                    <li class="post-footer">
                        <div class="add-comment">
                            <input id="comment_${data.id}" placeholder="Add a comment..."/>
                        </div>
                        <button onclick="updateComment(id)" id="post_${data.id}" >Post</button>
                    </li>
                </ul>
                <div id="modal${data.id}" class="modal-bg hidden" aria-hidden="true" >
                        <div class="modal-post">
                        <button id="${data.id}" class="close-modal fa-solid fa-x"></button>
                            <img class="modal-img" src="${data.image_url}"/>

                            <div class="modal-text">
                                <div class="modal-des">
                                    <ul class="user-section">
                                        <li class="logged-img">
                                            <img class="user-pfp" src="${data.user.thumb_url}"/>
                                        </li>
                                        <li class="logged-user">
                                            <b><h2>${data.user.username}</h2></b>
                                        </li>
                                    
                                    </ul>
                                </div>
                                <div class="modal-comments">
                                    ${showModalComments(data)}
                                </div>
                            </div>
                        </div>
                    
                </div>
        </section>
    `

}

const repostToHTML = data =>{
    return `
    <ul class="post">
                    <li class="post-head">
                        <h4 class="post-user">
                            ${data.user.username}
                        </h4>
                        <a href=""><i class="fa-solid fa-ellipsis"></i></a>
                    </li>
                    
                    <li class="pic-post">
                        <img class="post-img" src="${data.image_url}" />
                    </li>
                    <li class="icons-list">
                        <div class="interact-list">
                            ${checkHeart(data)}
                            <button class="fa-regular fa-comment"></button>
                            <button class="fa-regular fa-paper-plane"></button>
                        </div>
                        <div>
                            ${checkBookmark(data)}
                        </div>
                        
                    </li>
                    <li class="likes" >
                        <div id="likes_${data.id}">
                        <b>${data.likes.length} Likes</b>
                        </div>
                    </li>
                    <li class="post-des">
                        <div class="post-user"><a href=""><b>${data.user.username}</b></a></div>
                        <div class="description">
                        ${data.caption}
                        </div>
                        
                    </li>
                    <div class="post-date">
                    ${data.display_time}
                    </div>
                    <li id="comment_list_${data.id}" class="comments">
                        
                        ${checkComments(data)}


                    </li>
                    <li class="post-footer">
                        <div class="add-comment">
                            <input id="comment_${data.id}" placeholder="Add a comment..."/>
                        </div>
                        <button onclick="updateComment(id)" id="post_${data.id}" >Post</button>
                    </li>
                </ul>
                <div id="modal${data.id}" class="modal-bg hidden" aria-hidden="true" >
                        <div class="modal-post">
                        <button id="${data.id}" class="close-modal fa-solid fa-x"></button>
                            <img class="modal-img" src="${data.image_url}"/>

                            <div class="modal-text">
                                <div class="modal-des">
                                    <ul class="user-section">
                                        <li class="logged-img">
                                            <img class="user-pfp" src="${data.user.thumb_url}"/>
                                        </li>
                                        <li class="logged-user">
                                            <b><h2>${data.user.username}</h2></b>
                                        </li>
                                    
                                    </ul>
                                </div>
                                <div class="modal-comments">
                                    ${showModalComments(data)}
                                </div>
                            </div>
                        </div>
                    
                </div>
    `;
}


// Check Functions
const checkHeart = data =>{

    if(typeof data.current_user_like_id == 'undefined'){
        return `<button aria-label="Heart" aria-checked="false" id="heart_${data.id}" onclick="postHeart(id)" class="fa-regular fa-heart"></button>`;
    }
    else{
        return `<button aria-label="Heart" aria-label="true" id="heart_${data.id}_${data.current_user_like_id}" onclick="deleteHeart(id)" style="color:red;" class="fa-solid fa-heart"></button>`;
    }

}
const checkBookmark = data =>{
    if(typeof data.current_user_bookmark_id == 'undefined'){
        return `<button aria-label="Bookmark" aria-checked="false" id="bookmark_${data.id}" onclick="postBookmark(id)" class="fa-regular fa-bookmark"></button>`;
    }
    else{
        return `<button aria-label="Bookmark" aria-checked="true" id="bookmark_${data.id}_${data.current_user_bookmark_id}" onclick="deleteBookmark(id)" class="fa-solid fa-bookmark"></button>`;
    }
}
const checkComments = data =>{
    let tempHTML = ``;
    if(data.comments.length == 1){
        tempHTML += `
        <div class="comment-block">
        <div class="post-user"><a href=""><b>${data.comments[data.comments.length-1].user.username}</b></a></div>
        <div class="description">${data.comments[data.comments.length-1].text}</div>
        </div>
        <div class="post-date">
                    ${data.comments[data.comments.length-1].display_time}
        </div>
        `;
    }
    else if (data.comments.length > 1){
        tempHTML += `
        <button id="${data.id}" class ="show-all-comments">Show all ${data.comments.length} comments</button>
        <div class="comment-block">
        <div class="post-user"><a href=""><b>${data.comments[data.comments.length-1].user.username}</b></a></div>
        <div class="description">${data.comments[data.comments.length-1].text} </div>
        </div>
        <div class="post-date">
        ${data.comments[data.comments.length-1].display_time}
        </div>
        `;


    }
    return tempHTML;
}

const checkFollow = (data) =>{
    return `
    <button aria-label="Follow" aria-checked="false" id="follow_${data.id}" onclick="postFollow(id)">Follow</button>
    `
}

// post functions

window.postHeart = async (id) =>{
    console.log("Liking");

    const postID = id.split("_");

    const endpoint = `${rootURL}/api/posts/likes/`;
    const postData = {
        "post_id": postID[1]// replace with the actual post ID
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();


    redrawHeart(postID[1]);
}

window.postBookmark = async (id) =>{
        console.log("Bookmarking");

        const postID = id.split("_");

        const endpoint = `${rootURL}/api/bookmarks/`;
        const postData = {
        "post_id": postID[1] // replace with the actual post ID
        };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();

    redrawBookmark(postID[1])
}

window.postFollow = async (id) =>{
    console.log("Following");

    const followID = id.split("_");

    console.log("Following ID: ",followID[1]);

    const endpoint = `${rootURL}/api/following/`;
    const postData = {
        "user_id": followID[1] // replace with the actual post ID
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
    console.log("Redraw Data Follow: ",data);
    redrawFollow(id,data);
}

window.updateComment = async id =>{

    const post = document.getElementById(id);
    const comment = document.getElementById(`comment_${id.split("_")[1]}`).value;
    const postID = id.split("_")[1]


    const endpoint = `${rootURL}/api/comments/`;

    const postData = {
        "post_id": postID,
        "text": comment
    };
    
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();

    console.log(data);

    redrawComment(data);




} 



// delete functions

window.deleteHeart = async (id) =>{
    console.log("Deleting Like");


    const postID = id.split("_");

    const endpoint = `${rootURL}/api/posts/likes/${postID[2]}`;

    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        }
    })

    const data = await response.json();

    // console.log(id);

    redrawHeart(postID[1],postID[2],0);
}

window.deleteBookmark = async (id) =>{
    console.log("Deleting Bookmark");

    const postID = id.split("_");

    const endpoint = `${rootURL}/api/bookmarks/${postID[2]}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        }
    })

    const data = await response.json();
    redrawBookmark(postID[1],postID[2],1);
    
}

window.deleteFollow = async (id) =>{

    const orgID = id.split("_")[0]+"_"+id.split("_")[1]

    console.log("Unfollowing");

    console.log(id,orgID);

    const endpoint = `${rootURL}/api/following/${id.split("_")[2]}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        }
    });
    redrawUnfollow(orgID);

}

// redraw functions

const redrawHeart = async (id,heartID,del) =>{
    console.log("redrawing Heart");
    const endpoint = `${rootURL}/api/posts/${id}`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        }
    })
    const data = await response.json();
    const htmlString = checkHeart(data);

    // console.log(id,heartID,del);
    
    if(typeof del != 'undefined'){
        targetElementAndReplace(`heart_${id}_${heartID}`, htmlString);
    }
    else{
        targetElementAndReplace(`heart_${id}`, htmlString);
    }


    console.log("Likes: ",data.likes.length)

    const likesHTML = `
    <div id="likes_${id}">
    <b>${data.likes.length} Likes</b>
    </div>
    `;

    console.log("likesHTML: ",likesHTML);

    targetElementAndReplace(`likes_${id}`,likesHTML);
    


    

}

const redrawBookmark = async (id,bookmarkID,del) =>{
    console.log("Redrawing Bookmark");

    const endpoint = `${rootURL}/api/posts/${id}`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        }
    })
    const data = await response.json();
    const htmlString = checkBookmark(data);


    if(del){
        targetElementAndReplace(`bookmark_${id}_${bookmarkID}`, htmlString);
    }
    else{
        targetElementAndReplace(`bookmark_${id}`, htmlString);
    }
}

const redrawFollow =(id,data) =>{
    console.log("redrawing",id,data);

    document.getElementById("class_"+id).innerHTML = `
        <button class="unfollow" aria-label="Follow" aria-checked="true" id="${id+"_"+data.id}" onclick="deleteFollow(id)">unfollow</button>
    `;
}

const redrawUnfollow = (id) =>{
    console.log("redrawing follow: ", id);

    document.getElementById("class_"+id).innerHTML = `
        <button aria-label="Follow" aria-checked="false" id="${id}" onclick="postFollow(id)">follow</button>
    `;

}

const redrawComment = async datum =>{
    const endpoint = `${rootURL}/api/posts/${datum.post_id}`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + await getAccessToken(rootURL, 'noah', 'noah_password')
        }
    })
    const data = await response.json();
    const htmlString = postToHTML(data);

    targetElementAndReplace(`card_${data.id}`, htmlString);

    document.getElementById(`comment_${data.id}`).focus()

}

const targetElementAndReplace = (selector, newHTML) => { 
    console.log("Selector: ",selector);
	const div = document.createElement('div'); 
	div.innerHTML = newHTML;
    console.log("newHTML", newHTML);
    const newEl = div.firstElementChild;
    console.log("New Element: ", newEl);
    const oldEl = document.getElementById(selector);
    console.log("Old Element: ",oldEl);
    oldEl.parentElement.replaceChild(newEl, oldEl);
}






initPage();