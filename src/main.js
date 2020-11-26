import API from './api.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

// This url may need to change depending on what port your backend is running
// on.
const api = new API('http://localhost:5000');

var token;
var loginUserFollow;
var p = 0, n = 5;
var loading = document.querySelector('.loading');

const feed = document.getElementById('feed');
const profile = document.getElementById('profile');
const myProfile = document.getElementById('my-profile');
const searchName = document.querySelector('.search-name');
const searchBtn = document.querySelector('.search-follow-btn');


// search and follow
searchName.onfocus = () => {
    searchName.style.width = '150px';
}
searchName.onblur = () => {
    searchName.style.width = '100px';
}
searchBtn.onclick = (event) => {
    event.preventDefault();
    const url = `user/follow?username=${searchName.value}`;
    api.put(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        }
    })
    .then((data) => {
        console.log(data);
        myProfile.style.display = 'none';
        profile.style.display = 'none';
        cleanFeed();
        feedPage(token);
    })
    .catch(err => {
        alert(err);
    })
}


// Fragment based URL routing
window.onhashchange = () => {
    if (token === undefined) {
        alert('Please login first!')
    } else {
        const newHash = location.hash;
        if (newHash === '#feed') {
            profile.style.display = 'none';
            myProfile.style.display = 'none';
            feedPage(token);
            feed.style.display = 'flex';
        } else {
            const person = newHash.replace(/#profile=/, '');
            if (person === 'me') {
                feed.style.display = 'none';
                profile.style.display = 'none';
                myProfilePage();
                myProfile.style.display = 'flex';
            } else {
                feed.style.display = 'none';
                myProfile.style.display = 'none';
                profilePage(person);
                profile.style.display = 'flex';
            }
        }
    }
}


// 2.1.1 Login Part
const loginForm = document.forms.loginForm;
const loginUser = loginForm.user;
const loginPwd = loginForm.pwd;
const loginBtn = loginForm.loginBtn;
const signUpBtn = loginForm.signUpBtn;


loginBtn.onclick = (event) => {
    event.preventDefault();

    api.post('auth/login', {
        body: JSON.stringify({
            "username": loginUser.value,
            "password": loginPwd.value,
        }),
        headers: {
            "Content-Type": "application/json"
        },
    })
    .then(data => {
        token = data['token'];
        loginForm.style.display = 'none';
        searchName.style.display = 'inline';
        searchBtn.style.display = 'inline';
        console.log(token);
        feedPage(token);
    })
    .catch(err => {
        alert(err);
    })
}



// 2.1.2 Registration
const regForm = document.forms.regForm;
const regUser = regForm.user;
const regPwd = regForm.pwd;
const confirmPwd = regForm.confirmPwd;
const email = regForm.email;
const name = regForm.name;
const regBtn = regForm.regBtn;
const returnLogin = regForm.loginBtn;

signUpBtn.onclick = (event) => {
    event.preventDefault();
    loginForm.style.display = 'none';
    regForm.style.display = 'block';
}


const successInfo = document.getElementById('success-info');

regBtn.onclick = (event) => {
    event.preventDefault();

    if (regPwd.value !== confirmPwd.value) {
        alert('Please enter the same password');
    } else {
        api.post('auth/signup', {
            body: JSON.stringify({
                "username": regUser.value,
                "password": regPwd.value,
                "email": email.value,
                "name": name.value,
            }),
            headers: {
                "Content-Type": "application/json"
            },
        })
        .then(data => {
            token = data['token'];
            regForm.style.display = 'none';
            successInfo.style.display = 'block';
        })
        .catch(err => {
            alert(err);
        })
    }
}

returnLogin.onclick = (event) => {
    event.preventDefault();
    regForm.style.display = 'none';
    loginForm.style.display = 'block';
}

successInfo.onclick = (event) => {
    event.preventDefault();
    loginForm.style.display = 'block';
    successInfo.style.display = 'none';
}


// addEventListener to different Pages. Use Event delegation

// Feed Page
feed.addEventListener('click', event => {

    // achieve the functionality of show the likes
    if (event.target.classList.contains('likes')) {
        showLikesOrNot(event);
    }
    // achieve the functionality of show the comments
    if (event.target.classList.contains('comments')) {
        showCommentsOrNot(event);
    }
    // achieve the functionality of "like a post"
    if (event.target.classList.contains('like-btn')) {
        likePost(event, 4);
    }
    // achieve the functionality of "unlike a post"
    if (event.target.classList.contains('unlike-btn')) {
        likePost(event, 4);
    }
    // achieve the functionality of showing the comment textarea or not
    if (event.target.classList.contains('comment-btn')) {
        showCommentTextareaOrNot(event);
    }
    // achieve the functionality of "follow or un-follow"
    if (event.target.classList.contains('follow-btn')) {
        followOrNot(event); 
    }
    // achieve click on user's name to the profile page
    if (event.target.classList.contains('post-author')) {
        const author = event.target.id.substring(4);
        feed.style.display = 'none';
        profilePage(author);
        profile.style.display = 'flex';
    }
    if (event.target.classList.contains('my-profile-btn')) {
        event.preventDefault();
        feed.style.display = 'none';
        // we can pass '' as the author name to present the login user
        myProfilePage();
        myProfile.style.display = 'flex';
    }
    // achieve the functionality of making a comment
    if (event.target.classList.contains('post-comment-btn')) {
        postComment(event, 4);
    }
})

// Profile Page
profile.addEventListener('click', event => {
    if (event.target.classList.contains('return-feed')) {
        returnToFeedPage(event);
    }
    if (event.target.classList.contains('likes')) {
        showLikesOrNot(event);
    }
    if (event.target.classList.contains('comments')) {
        showCommentsOrNot(event);
    }
    if (event.target.classList.contains('like-btn')) {
        likePost(event, 7);
    }
    if (event.target.classList.contains('unlike-btn')) {
        likePost(event, 7);
    } 
    if (event.target.classList.contains('comment-btn')) {
        showCommentTextareaOrNot(event);
    }
    if (event.target.classList.contains('following-div')) {
        showFollowsOrNot(event);
    }
    if (event.target.classList.contains('follow-btn')) {
        followOrNot(event);
    }
    if (event.target.classList.contains('post-comment-btn')) {
        postComment(event, 7);
    }
})

// My profile Page
myProfile.addEventListener('click', event => {
    // return to the Feed Page 
    if (event.target.classList.contains('return-feed')) {
        returnToFeedPage(event);
    }
    // follow or not
    if (event.target.classList.contains('follow-btn')) {
        followOrNot(event);
    }
    // show all the following
    if (event.target.classList.contains('following-div')) {
        showFollowsOrNotInMyProfile(event);
    }
    // show the update form
    if (event.target.id === 'my-update') {
        event.preventDefault();
        const updateForm = document.getElementById('update-form');
        updateForm.style.display = updateForm.style.display === 'none'? 'flex': 'none';
        updateForm.nextElementSibling.style.display = 'none';
        updateForm.nextElementSibling.nextElementSibling.style.display = 'none';
    }
    // show the post div
    if (event.target.id === 'my-make-post') {
        const makePost = document.getElementById('make-new-post');
        makePost.style.display = makePost.style.display === 'none'? 'flex': 'none';
        makePost.nextElementSibling.style.display = 'none';
        makePost.previousElementSibling.style.display = 'none';
    }
    // achieve update the profile
    if (event.target.id === 'submit-update-btn') {
        submitUpdate(event);
    }
    // submit the new post
    if (event.target.id === 'new-post-btn') {
        submitPost(event);
    }
    // show likes
    if (event.target.classList.contains('likes')) {
        showLikesOrNot(event);
    }
    // show comments
    if (event.target.classList.contains('comments')) {
        showCommentsOrNot(event);
    }
    // like the post
    if (event.target.classList.contains('like-btn')) {
        likePost(event, 7);
    }
    // unlike the post
    if (event.target.classList.contains('unlike-btn')) {
        likePost(event, 7);
    } 
    // show comment textarea and btn
    if (event.target.classList.contains('comment-btn')) {
        showCommentTextareaOrNot(event);
    }
    // post comment
    if (event.target.classList.contains('post-comment-btn')) {
        postComment(event, 7);
    }
    // show the edit textarea and btn
    if (event.target.classList.contains('edit-btn')) {
        const editText = event.target.parentNode.parentNode.getElementsByClassName('edit-text')[0];
        editText.style.display = editText.style.display === 'none'? 'flex': 'none';
    }
    // edit the post
    if (event.target.classList.contains('edit-text-btn')) {
        editPost(event, 7);
    }
    // delete the post
    if (event.target.classList.contains('delete-btn')) {
        deletePost(event, 7);
    }
})





function cleanFeed() {
    while (feed.children.length !== 0) {
        const child = feed.children[0];
        child.remove();
    }
    // reset p
    p = 0;
}



// achieve infinite scroll for Feed Page
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (clientHeight + scrollTop >= scrollHeight && feed.style.display === 'flex') {
        // console.log({scrollTop, scrollHeight, clientHeight});   
        // console.log('to the bottom');
        loading.style.display = 'flex';
        addPostToFeed();
    }
})


// Feed Page
function feedPage(token) {
    cleanFeed();
    feed.style.display = 'flex';

    // create myProfile Button
    const myProfileBtn = document.createElement('button');
    myProfileBtn.classList.add('my-profile-btn', 'btn', 'btn-outline-primary');
    myProfileBtn.textContent = 'My Profile';
    feed.appendChild(myProfileBtn);


    // to initialize the loginUserFollow list, the format is [id, ..., id]
    api.get('user/', {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        }
    })
    .then(data => {
        loginUserFollow = data['following'];
    })
    .catch(err => {
        alert(err);
    })

    // initialize the feed, I set minimal 5 posts here.
    addPostToFeed();

}


function addPostToFeed() {
    api.get(`user/feed?p=${p}&n=${n}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        }
    })
    .then(data => {
        p += 5;
        console.log(data);
        const posts = data['posts'];

        if (posts.length !== 0) {
            // console.log(posts);
            // show all posts, posts format is [{}, {}, ..., {}]
            showPostsInFeed(posts);
        }
    })
    .then(() => {
        loading.style.display = 'none';
    })
    .catch(err => {
        alert(err);
    })
}



function showPostsInFeed(posts) {

    posts.map((post, index) => {
        // crate a post div and set it with its id
        const displayPost = document.createElement('div');
        displayPost.classList.add('display-post', 'card');
        displayPost.id = `feed${post['id']}`;

        const detailsContainer = document.createElement('div');
        detailsContainer.classList.add('details-container', 'card-body');
        displayPost.appendChild(detailsContainer);


        // to fill with details container

        // Step1: put author name and follow btn in nameFollow container
        const authorFollow = document.createElement('div');
        authorFollow.classList.add('author-follow');
        const postAuthor = document.createElement('div');
        postAuthor.classList.add('post-author', 'card-title');
        const followBtn = document.createElement('div');
        followBtn.classList.add('follow-btn', 'btn', 'btn-outline-primary');

        const author = post['meta']['author'];
        postAuthor.textContent = author;
        followBtn.textContent = 'Unfollow';

        // give postAuthor with its corresponding id
        postAuthor.id = `feed${author}`;        

        authorFollow.appendChild(postAuthor);
        authorFollow.appendChild(followBtn);

        // Step2: create posted time, description text and imageSrc containers
        const postTime = document.createElement('div');
        postTime.classList.add('post-time', 'card-subtitle', 'mb-2', 'text-muted');
        const postText = document.createElement('div');
        postText.classList.add('post-text', 'card-text')
        const thumbnailImg = document.createElement('img');
        thumbnailImg.classList.add('thumbnail');

        const time = post['meta']['published'];
        const descriptionText = post['meta']['description_text'];
        const thumbnail = post['thumbnail'];

        postTime.textContent = getTime(time);
        postText.textContent = descriptionText;
        thumbnailImg.src = `data:image/png;base64, ${thumbnail}`;


        // Step3: create likeUnlikeBtn containers which includes like, unlike and comment btn
        const likeUnlikeCommentBtn = document.createElement('div');
        likeUnlikeCommentBtn.classList.add('like-unlike-comment-btn');
        const likeBtn = document.createElement('button');
        likeBtn.classList.add('like-btn', 'btn', 'btn-outline-danger');
        const unlikeBtn = document.createElement('button');
        unlikeBtn.classList.add('unlike-btn', 'btn', 'btn-outline-secondary');
        const commentBtn = document.createElement('button');
        commentBtn.classList.add('comment-btn', 'btn', 'btn-outline-info')

        likeBtn.textContent = 'Like';
        unlikeBtn.textContent = 'Unlike';
        commentBtn.textContent = 'Comment';
        likeUnlikeCommentBtn.appendChild(likeBtn);
        likeUnlikeCommentBtn.appendChild(unlikeBtn);
        likeUnlikeCommentBtn.appendChild(commentBtn);

        // Step4: create likesComments container which includes likes and comments div 
        const likesComments = document.createElement('div');
        likesComments.classList.add('likes-comments');
        const likes = document.createElement('div');
        likes.classList.add('likes', 'btn', 'btn-light');
        const comments = document.createElement('div');
        comments.classList.add('comments', 'btn', 'btn-light');
        
        const likesNo = post['meta']['likes'].length;
        const commentsNo = post['comments'].length;

        likes.textContent = `${likesNo} Likes`;
        comments.textContent = `${commentsNo} Comments`;
        likesComments.appendChild(likes);
        likesComments.appendChild(comments);

        // Step5: create show-likes container
        const showLikes = document.createElement('div');
        showLikes.classList.add('show-likes');
        const likeList = post['meta']['likes'];

        likeList.map(like => {
            // use id in the like list to get the username
            findLikeUserName(showLikes, like);
        })

        // Step6: create show-comments container
        const showComments = document.createElement('div');
        showComments.classList.add('show-comments');
        const commentList = post['comments'];

        commentList.map(comment => {
            // create a comment div
            const eachComment = document.createElement('div');
            eachComment.classList.add('each-comment');

            // put the author and content in the same div
            const authorComment = document.createElement('div');
            authorComment.classList.add('author-content');

            const author = document.createElement('div');
            author.classList.add('comment-author', 'card-title');
            const content = document.createElement('div');
            content.classList.add('comment-content', 'card-text');
            const time = document.createElement('div');
            time.classList.add('comment-time', 'card-subtitle', 'mb-2', 'text-muted');

            author.textContent = `${comment['author']}:  `;
            content.textContent = comment['comment'];
            time.textContent = getTime(comment['published']);

            authorComment.appendChild(author);
            authorComment.appendChild(content);

            eachComment.appendChild(authorComment);
            eachComment.appendChild(time);

            showComments.appendChild(eachComment);
        })

        showLikes.style.display = 'none';
        showComments.style.display = 'none';

        // Step7: create a comment container to post a new comment
        const makeComment = document.createElement('div');
        makeComment.classList.add('make-comment');
        const commentTextarea = document.createElement('textarea');
        commentTextarea.classList.add('comment-textarea');
        const postCommentBtn = document.createElement('button');
        postCommentBtn.classList.add('post-comment-btn', 'btn', 'btn-outline-primary');

        commentTextarea.placeholder = 'Comment here...';
        commentTextarea.rows = '5';
        postCommentBtn.textContent = 'Post';

        makeComment.appendChild(commentTextarea);
        makeComment.appendChild(postCommentBtn);

        makeComment.style.display = 'none';


        // Add all Steps containers to the detailsContainer
        detailsContainer.appendChild(authorFollow);
        detailsContainer.appendChild(postTime);
        detailsContainer.appendChild(postText);
        detailsContainer.appendChild(thumbnailImg);
        detailsContainer.appendChild(likeUnlikeCommentBtn);
        detailsContainer.appendChild(likesComments);
        detailsContainer.appendChild(showLikes);
        detailsContainer.appendChild(showComments);
        detailsContainer.appendChild(makeComment);

        // add the post container to the feed container
        feed.appendChild(displayPost);
    })
}

function getTime(time) {
    var date = new Date(1970);
    date.setSeconds(time)
    const res = date.toString().substring(0, 25);
    return res;
}

function showLikesOrNot(event) {
    // Use "likes" two-level parentNode to find the "show-likes" container
    const showLikes = event.target.parentNode.parentNode.getElementsByClassName('show-likes')[0];
    // achieve toggle op
    showLikes.style.display = showLikes.style.display === 'none'? 'flex': 'none';
}

function showCommentsOrNot(event) {
    const showComments = event.target.parentNode.parentNode.getElementsByClassName('show-comments')[0];
    showComments.style.display = showComments.style.display === 'none'? 'flex': 'none';
}

function showFollowsOrNot(event) {
    event.preventDefault();
    const showFollows = event.target.parentNode.parentNode.parentNode.getElementsByClassName('following-list')[0];
    if (showFollows.style.display === 'none') {
        showFollows.style.display = 'flex';
    } else {
        showFollows.style.display = 'none';
    }
}

function followOrNot(event) {

    var followUsername;
    var url;
    const parent = event.target.parentNode;
    if (parent.getElementsByClassName('post-author').length === 0) {
        followUsername = parent.getElementsByClassName('follow-username')[0].textContent;
    } else {
        followUsername = parent.getElementsByClassName('post-author')[0].textContent;
    }

    // toggle follow button
    if (event.target.textContent === 'Follow') {
        event.target.textContent = 'Unfollow';
        url = `user/follow?username=${followUsername}`;
    } else {
        event.target.textContent = 'Follow';
        url = `user/unfollow?username=${followUsername}`;
    }

    api.put(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        }
    })
    .then(data => console.log(data))
    .catch(err => {
        alert(err);
    })
}

function likePost(event, idStart) {

    event.preventDefault();
    const currentPost = event.target.parentNode.parentNode.parentNode
    const postId = currentPost.id.substring(idStart);
    const likes = currentPost.getElementsByClassName('likes')[0];
    const showLikes = currentPost.getElementsByClassName('show-likes')[0];
    // judge like or unlike
    const url = event.target.classList.contains('like-btn')? `post/like?id=${postId}`: `post/unlike?id=${postId}`
    api.put(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        }
    })
    .then(data => {
        console.log(data);
        // live update the likes and show-likes 
        api.get(`post/?id=${postId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`
            }
        })
        .then(post => {
            const newLikes = post['meta']['likes'];
            likes.textContent = `${newLikes.length} Likes`;

            showLikes.textContent = '';
            newLikes.map(like => {
                // use id in the like list to get the username
                findLikeUserName(showLikes, like);
            })
        })
        .catch(err => {
            alert(err);
        })
    })
    .catch(err => {
        alert(err);
    })

}

function showCommentTextareaOrNot(event) {
    const commentBtn = event.target;
    commentBtn.onclick = (e) => {
        e.preventDefault();
        const commentTextarea = event.target.parentNode.parentNode.getElementsByClassName('make-comment')[0];
        commentTextarea.style.display = commentTextarea.style.display === 'none'? 'flex': 'none';
    }
}

function findLikeUserName(showLikes, uid) {
    const url = `user/?id=${uid}`;
    api.get(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        }
    })
    .then(data => {
        // console.log(data);
        const likeName = document.createElement('div');
        likeName.classList.add('like-name');
        likeName.textContent = data['username'];
        showLikes.appendChild(likeName);
    })
    .catch(err => {
        alert(err);
    })
}

function postComment(event, idStart) {
    
    event.preventDefault();
    const currentPost = event.target.parentNode.parentNode.parentNode;
    const postId = currentPost.id.substring(idStart);
    const textarea = event.target.parentNode.getElementsByClassName('comment-textarea')[0];
    const comments = currentPost.getElementsByClassName('comments')[0];
    const showComments = currentPost.getElementsByClassName('show-comments')[0];
    const url = `post/comment?id=${postId}`;
    api.put(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        },
        body: JSON.stringify({
            "comment": textarea.value
        })
    })
    .then((data) => {
        // console.log(data);

        // live update comments and show-comments
        api.get(`post/?id=${postId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`
            }
        })
        .then(post => {
            const newComments = post['comments'];
            comments.textContent = `${newComments.length} Comments`;
            // remove previous comments
            while (showComments.children.length !== 0) {
                const child = showComments.children[0];
                child.remove();
            }
            // reload comments
            newComments.map(comment => {
                const eachComment = document.createElement('div');
                eachComment.classList.add('each-comment');
    
                const authorComment = document.createElement('div');
                authorComment.classList.add('author-content');
    
                const author = document.createElement('div');
                author.classList.add('comment-author');
                const content = document.createElement('div');
                content.classList.add('comment-content');
                const time = document.createElement('div');
                time.classList.add('comment-time');
    
                author.textContent = `${comment['author']}:  `;
                content.textContent = comment['comment'];
                time.textContent = getTime(comment['published']);
    
                authorComment.appendChild(author);
                authorComment.appendChild(content);
    
                eachComment.appendChild(authorComment);
                eachComment.appendChild(time);
    
                showComments.appendChild(eachComment);
            })
            alert('Comment Successfully!')
        })
        .catch(err => {
            alert(err);
        })
    })
    .catch(err => {
        alert(err);
    })
}




function cleanProfilePage() {
    while (profile.children.length !== 2) {
        const child = profile.children[2];
        // console.log(child);
        child.remove();
    }
}

// Profile Page
function profilePage(author) {

    cleanProfilePage();
    const url = `user/?username=${author}`;
    
    api.get(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        }
    })
    .then(data => {
        console.log(data);

        showUserBarInProfilePage(data);
        showListOfFollowsInProfilePage(data);
        showPostsInProfilePage(data);

    })
    .catch(err => {
        alert(err);
    })
}

function showUserBarInProfilePage(data) {
    // assign value to each div
    const id = document.getElementById('profile-id');
    const username = document.getElementById('profile-username');
    const name = document.getElementById('profile-name');
    const email = document.getElementById('profile-email');
    const posts = document.getElementById('profile-posts');
    const following = document.getElementById('profile-following');
    const followers = document.getElementById('profile-followers');

    id.textContent = `Id: ${data['id']}`;
    username.textContent = `Username: ${data['username']}`;
    name.textContent = `Name: ${data['name']}`;
    email.textContent = `Email: ${data['email']}`;
    posts.textContent = `${data['posts'].length} Posts`;
    following.textContent = 'Following';
    followers.textContent = `${data['followed_num']} Followers`;
}

// create follows container
function showListOfFollowsInProfilePage(data) {

    const following = data['following']
    const followingList = document.createElement('div');
    followingList.classList.add('following-list');
    followingList.style.display = 'none';

    profile.appendChild(followingList);

    following.map(uid => {
        const url = `user/?id=${uid}`;
        api.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`
            }
        })
        .then(data => {
            const usernameFollowContainer = document.createElement('div');
            usernameFollowContainer.classList.add('username-follow-container');
            const followUsername = document.createElement('div');
            followUsername.classList.add('follow-username', 'btn');
            const followBtn = document.createElement('div');
            followBtn.classList.add('follow-btn', 'btn', 'btn-outline-primary');

            const username = data['username'];
            followUsername.textContent = username;
            const userId = data['id'];
            followBtn.textContent = loginUserFollow.includes(userId)? 'Unfollow': 'Follow';
            
            usernameFollowContainer.appendChild(followUsername);
            usernameFollowContainer.appendChild(followBtn);

            followingList.appendChild(usernameFollowContainer);
        })
        .catch(err => {
            alert(err);
        })
    })
    
}


function showPostsInProfilePage(data) {

    // create a post container to show all posts
    const profilePosts = document.createElement('div');
    profilePosts.classList.add('profile-posts');
    // here, the posts format is [postId, ..., postId]
    const posts = data['posts']

    profile.appendChild(profilePosts);

    posts.map(postId => {
        const url = `post/?id=${postId}`;
        api.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`
            }
        })
        .then(
            post => {
                const displayPost = document.createElement('div');
                displayPost.classList.add('display-post', 'card');
                displayPost.id = `profile${post['id']}`;

                const detailsContainer = document.createElement('div');
                detailsContainer.classList.add('details-container', 'card-body');
                displayPost.appendChild(detailsContainer);

                // to fill with details container

                // Step1: put author name and follow btn in nameFollow container
                const authorFollow = document.createElement('div');
                authorFollow.classList.add('author-follow');
                const postAuthor = document.createElement('div');
                postAuthor.classList.add('post-author', 'card-title');
                const followBtn = document.createElement('div');
                followBtn.classList.add('follow-btn', 'btn', 'btn-outline-primary');
        
                const author = post['meta']['author'];
                postAuthor.textContent = author;
                followBtn.textContent = 'Unfollow';

                // give postAuthor with its corresponding id
                postAuthor.id = `profile${author}`;        

                authorFollow.appendChild(postAuthor);
                authorFollow.appendChild(followBtn);

                // Step2: create posted time, description text and imageSrc containers
                const postTime = document.createElement('div');
                postTime.classList.add('post-time', 'card-subtitle', 'mb-2', 'text-muted');
                const postText = document.createElement('div');
                postText.classList.add('post-text', 'card-text')
                const thumbnailImg = document.createElement('img');
                thumbnailImg.classList.add('thumbnail');

                const time = post['meta']['published'];
                const descriptionText = post['meta']['description_text'];
                const thumbnail = post['thumbnail'];

                postTime.textContent = getTime(time);
                postText.textContent = descriptionText;
                thumbnailImg.src = `data:image/png;base64, ${thumbnail}`;

                // Step3: create likeUnlikeBtn containers which includes like, unlike and comment btn
                const likeUnlikeCommentBtn = document.createElement('div');
                likeUnlikeCommentBtn.classList.add('like-unlike-comment-btn');
                const likeBtn = document.createElement('button');
                likeBtn.classList.add('like-btn', 'btn', 'btn-outline-danger');
                const unlikeBtn = document.createElement('button');
                unlikeBtn.classList.add('unlike-btn', 'btn', 'btn-outline-secondary');
                const commentBtn = document.createElement('button');
                commentBtn.classList.add('comment-btn', 'btn', 'btn-outline-info')
        
                likeBtn.textContent = 'Like';
                unlikeBtn.textContent = 'Unlike';
                commentBtn.textContent = 'Comment';
                likeUnlikeCommentBtn.appendChild(likeBtn);
                likeUnlikeCommentBtn.appendChild(unlikeBtn);
                likeUnlikeCommentBtn.appendChild(commentBtn);

                // Step4: create likesComments container which includes likes and comments div 
                const likesComments = document.createElement('div');
                likesComments.classList.add('likes-comments');
                const likes = document.createElement('div');
                likes.classList.add('likes', 'btn', 'btn-light');
                const comments = document.createElement('div');
                comments.classList.add('comments', 'btn', 'btn-light');
                
                const likesNo = post['meta']['likes'].length;
                const commentsNo = post['comments'].length;
        
                likes.textContent = `${likesNo} Likes`;
                comments.textContent = `${commentsNo} Comments`;
                likesComments.appendChild(likes);
                likesComments.appendChild(comments);

                // Step5: create show-likes container
                const showLikes = document.createElement('div');
                showLikes.classList.add('show-likes');
                const likeList = post['meta']['likes'];

                likeList.map(like => {
                    // use id in the like list to get the username
                    findLikeUserName(showLikes, like);
                })

                // Step6: create show-comments container
                const showComments = document.createElement('div');
                showComments.classList.add('show-comments');
                const commentList = post['comments'];

                commentList.map(comment => {
                    // create a comment div
                    const eachComment = document.createElement('div');
                    eachComment.classList.add('each-comment');
        
                    // put the author and content in the same div
                    const authorComment = document.createElement('div');
                    authorComment.classList.add('author-content');
        
                    const author = document.createElement('div');
                    author.classList.add('comment-author', 'card-title');
                    const content = document.createElement('div');
                    content.classList.add('comment-content', 'card-text');
                    const time = document.createElement('div');
                    time.classList.add('comment-time', 'card-subtitle', 'mb-2', 'text-muted');
        
                    author.textContent = `${comment['author']}:  `;
                    content.textContent = comment['comment'];
                    time.textContent = getTime(comment['published']);
        
                    authorComment.appendChild(author);
                    authorComment.appendChild(content);
        
                    eachComment.appendChild(authorComment);
                    eachComment.appendChild(time);
        
                    showComments.appendChild(eachComment);
                })

                showLikes.style.display = 'none';
                showComments.style.display = 'none';

                // Step7: create a comment container to post a new comment
                const makeComment = document.createElement('div');
                makeComment.classList.add('make-comment');
                const commentTextarea = document.createElement('textarea');
                commentTextarea.classList.add('comment-textarea');
                const postCommentBtn = document.createElement('button');
                postCommentBtn.classList.add('post-comment-btn', 'btn', 'btn-outline-primary');
        
                commentTextarea.placeholder = 'Comment here...';
                commentTextarea.rows = '5';
                postCommentBtn.textContent = 'Post';
        
                makeComment.appendChild(commentTextarea);
                makeComment.appendChild(postCommentBtn);

                makeComment.style.display = 'none';


                // Add all Steps containers to the detailsContainer
                detailsContainer.appendChild(authorFollow);
                detailsContainer.appendChild(postTime);
                detailsContainer.appendChild(postText);
                detailsContainer.appendChild(thumbnailImg);
                detailsContainer.appendChild(likeUnlikeCommentBtn);
                detailsContainer.appendChild(likesComments);
                detailsContainer.appendChild(showLikes);
                detailsContainer.appendChild(showComments);
                detailsContainer.appendChild(makeComment);

                profilePosts.appendChild(displayPost);
            }
        )
    })
}






function cleanMyProfilePage() {
    while (myProfile.children.length !== 4) {
        const child = myProfile.children[4];
        child.remove();
    }
}

// My Profile Page
function myProfilePage() {

    cleanMyProfilePage();
    api.get('user/', {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        }
    })
    .then(data => {
        console.log(data);

        assignInfoContainer(data);
        followingInMyProfilePage(data);
        showPostsInMyProfilePage(data);

    })
    .catch(err => {
        alert(err);
    })
}


function assignInfoContainer(data) {
    // assign value to each div
    const id = document.getElementById('my-id');
    const username = document.getElementById('my-username');
    const name = document.getElementById('my-name');
    const email = document.getElementById('my-email');
    const posts = document.getElementById('my-posts');
    const following = document.getElementById('my-following');
    const followers = document.getElementById('my-followers');

    id.textContent = `Id: ${data['id']}`;
    username.textContent = `Username: ${data['username']}`;
    name.textContent = `Name: ${data['name']}`;
    email.textContent = `Email: ${data['email']}`;
    posts.textContent = `${data['posts'].length} Posts`;
    following.textContent = 'Following';
    followers.textContent = `${data['followed_num']} Followers`;
}


function followingInMyProfilePage(data) {

    const following = data['following']
    const followingList = document.createElement('div');
    followingList.classList.add('following-list');
    followingList.style.display = 'none';

    myProfile.appendChild(followingList);

    following.map(uid => {
        const url = `user/?id=${uid}`;
        api.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`
            }
        })
        .then(data => {
            const usernameFollowContainer = document.createElement('div');
            usernameFollowContainer.classList.add('username-follow-container');
            const followUsername = document.createElement('div');
            followUsername.classList.add('follow-username', 'btn');
            const followBtn = document.createElement('div');
            followBtn.classList.add('follow-btn', 'btn', 'btn-outline-primary');

            const username = data['username'];
            followUsername.textContent = username;
            const userId = data['id'];
            followBtn.textContent = loginUserFollow.includes(userId)? 'Unfollow': 'Follow';
            
            usernameFollowContainer.appendChild(followUsername);
            usernameFollowContainer.appendChild(followBtn);

            followingList.appendChild(usernameFollowContainer);
        })
        .catch(err => {
            alert(err);
        })
    })
    
}

function returnToFeedPage(event) {
    event.preventDefault();
    if (event.target.parentNode.id === 'my-profile') {
        myProfile.style.display = 'none';
    } else {
        profile.style.display = 'none';
    }
    feedPage(token);
}


function showFollowsOrNotInMyProfile(event) {
    const showFollows = event.target.parentNode.parentNode.parentNode.getElementsByClassName('following-list')[0];
    if (showFollows.style.display === 'none') {
        showFollows.style.display = 'flex';
    } else {
        showFollows.style.display = 'none';
    }
    showFollows.previousElementSibling.style.display = 'none';
    showFollows.previousElementSibling.previousElementSibling.style.display = 'none';
}

function submitUpdate(event) {
    event.preventDefault();

    const updateForm = event.target.parentNode;
    const name = updateForm.name.value;
    const pwd = updateForm.pwd.value;
    const confirmPwd = updateForm.confirmPwd.value;
    const email = updateForm.email.value;
    const required = {};
    
    // if the input is empty, don't pass it to the required, 
    // and make sure at least one of the name, pwd, email is provided
    if (email !== '') {
        required['email'] = email;
    }
    if (name !== '') {
        required['name'] = name;
    }
    if (pwd !== '') {
        required['password'] = pwd;
    }
    // console.log(required);
    if (JSON.stringify(required) === '{}') {
        alert("Please input something!");
    } else {
        if (pwd !== confirmPwd) {
            alert('Please enter the same password');
        } else {
            api.put('user/', {
                body: JSON.stringify(required),
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                },
            })
            .then(() => {
                // live update
                api.get('user/', {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Token ${token}`
                    }
                })
                .then(data => {
                    assignInfoContainer(data);
                })
                alert('Update Successfully!');
                // console.log(data);
            })
            .catch(err => {
                alert(err);
            })
        }
    }
}

function submitPost(event) {
    event.preventDefault();
    const textarea = document.getElementById('new-post-textarea');
    const imgFile = document.getElementById('postSrc');
    if (textarea.value !== '' && imgFile.value !== '') {

        fileToDataUrl(imgFile.files[0])
        .then(data => {
            const imgSrc = data.replace(/^data:image\/\w+;base64,/, '');
            return imgSrc;
        })
        .then(imgSrc => {
            api.post('post/', {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`
                },
                body: JSON.stringify({
                    "description_text": textarea.value,
                    "src": imgSrc,
                }),
            })
            .then(data => {
                console.log(data);
                textarea.value = '';
                imgFile.value = '';
                alert('Successfully post!');
                myProfilePage();
            })
            .catch(err => {
                alert(err);
            })
        })
    } else {
        alert('Both a description and image must be supplied.');
    }
}

function editPost(event, idStart) {
    
    event.preventDefault();
    const postId = event.target.parentNode.parentNode.parentNode.id.substring(idStart);
    const textarea = event.target.parentNode.getElementsByClassName('edit-textarea')[0];
    const url = `post/?id=${postId}`;
    if (textarea.value === '') {
        alert('Please input something');
    } else {
        api.put(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`
            },
            body: JSON.stringify({
                "description_text": textarea.value
            })
        })
        .then(data => {
            alert('Edit Successfully!');
            myProfilePage();
        })
        .catch(err => {
            alert(err);
        })
    }
}

function deletePost(event, idStart) {
    event.preventDefault();
    const postId = event.target.parentNode.parentNode.parentNode.id.substring(idStart);
    const url = `post/?id=${postId}`;
    api.delete(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`
        }
    })
    .then(data => {
        alert('Delete Successfully!')
        myProfilePage();
    })
    .catch(err => {
        alert(err);
    })
}



function showPostsInMyProfilePage(data) {

    // create a post container to show all posts
    const profilePosts = document.createElement('div');
    profilePosts.classList.add('profile-posts');
    // here, the posts format is [postId, ..., postId]
    const posts = data['posts']

    myProfile.appendChild(profilePosts);

    posts.map(postId => {
        const url = `post/?id=${postId}`;
        api.get(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Token ${token}`
            }
        })
        .then(
            post => {
                const displayPost = document.createElement('div');
                displayPost.classList.add('display-post', 'card');
                displayPost.id = `profile${post['id']}`;

                const detailsContainer = document.createElement('div');
                detailsContainer.classList.add('details-container', 'card-body');
                displayPost.appendChild(detailsContainer);

                // to fill with details container

                // Step1: put author name, edit btn and delete btn in authorEditDelete container
                const authorEditDelete = document.createElement('div');
                authorEditDelete.classList.add('author-edit-delete');
                const postAuthor = document.createElement('div');
                postAuthor.classList.add('post-author', 'card-title');
                const editBtn = document.createElement('button');
                editBtn.classList.add('edit-btn', 'btn', 'btn-outline-primary');
                const deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete-btn', 'btn', 'btn-outline-primary');

                const author = post['meta']['author'];
                postAuthor.textContent = author;
                editBtn.textContent = 'Edit';
                deleteBtn.textContent = 'Delete';

                // give postAuthor with its corresponding id
                postAuthor.id = `profile${author}`;        

                authorEditDelete.appendChild(postAuthor);
                authorEditDelete.appendChild(deleteBtn);
                authorEditDelete.appendChild(editBtn);

                // Step2: create posted time, description text and thumbnail containers
                const postTime = document.createElement('div');
                postTime.classList.add('post-time', 'card-subtitle', 'mb-2', 'text-muted');
                const postText = document.createElement('div');
                postText.classList.add('post-text', 'card-text')
                const thumbnailImg = document.createElement('img');
                thumbnailImg.classList.add('thumbnail');
        
                const time = post['meta']['published'];
                const descriptionText = post['meta']['description_text'];
                const thumbnail = post['thumbnail'];
        
                postTime.textContent = getTime(time);
                postText.textContent = descriptionText;
                thumbnailImg.src = `data:image/png;base64, ${thumbnail}`;

                // Step3: create likeUnlikeBtn containers which includes like, unlike and comment btn
                const likeUnlikeCommentBtn = document.createElement('div');
                likeUnlikeCommentBtn.classList.add('like-unlike-comment-btn');
                const likeBtn = document.createElement('button');
                likeBtn.classList.add('like-btn', 'btn', 'btn-outline-danger');
                const unlikeBtn = document.createElement('button');
                unlikeBtn.classList.add('unlike-btn', 'btn', 'btn-outline-secondary');
                const commentBtn = document.createElement('button');
                commentBtn.classList.add('comment-btn', 'btn', 'btn-outline-info')
        
                likeBtn.textContent = 'Like';
                unlikeBtn.textContent = 'Unlike';
                commentBtn.textContent = 'Comment';
                likeUnlikeCommentBtn.appendChild(likeBtn);
                likeUnlikeCommentBtn.appendChild(unlikeBtn);
                likeUnlikeCommentBtn.appendChild(commentBtn);

                // Step4: create likesComments container which includes likes and comments div 
                const likesComments = document.createElement('div');
                likesComments.classList.add('likes-comments');
                const likes = document.createElement('div');
                likes.classList.add('likes', 'btn', 'btn-light');
                const comments = document.createElement('div');
                comments.classList.add('comments', 'btn', 'btn-light');
                
                const likesNo = post['meta']['likes'].length;
                const commentsNo = post['comments'].length;
        
                likes.textContent = `${likesNo} Likes`;
                comments.textContent = `${commentsNo} Comments`;
                likesComments.appendChild(likes);
                likesComments.appendChild(comments);

                // Step5: create show-likes container
                const showLikes = document.createElement('div');
                showLikes.classList.add('show-likes');
                const likeList = post['meta']['likes'];

                likeList.map(like => {
                    // use id in the like list to get the username
                    findLikeUserName(showLikes, like);
                })

                // Step6: create show-comments container
                const showComments = document.createElement('div');
                showComments.classList.add('show-comments');
                const commentList = post['comments'];

                commentList.map(comment => {
                    // create a comment div
                    const eachComment = document.createElement('div');
                    eachComment.classList.add('each-comment');

                    // put the author and content in the same div
                    const authorComment = document.createElement('div');
                    authorComment.classList.add('author-content');

                    const author = document.createElement('div');
                    author.classList.add('comment-author', 'card-title');
                    const content = document.createElement('div');
                    content.classList.add('comment-content', 'card-text');
                    const time = document.createElement('div');
                    time.classList.add('comment-time', 'card-subtitle', 'mb-2', 'text-muted');

                    author.textContent = `${comment['author']}:  `;
                    content.textContent = comment['comment'];
                    time.textContent = getTime(comment['published']);

                    authorComment.appendChild(author);
                    authorComment.appendChild(content);

                    eachComment.appendChild(authorComment);
                    eachComment.appendChild(time);

                    showComments.appendChild(eachComment);
                })

                showLikes.style.display = 'none';
                showComments.style.display = 'none';

                // Step7: create a comment container to post a new comment
                const makeComment = document.createElement('div');
                makeComment.classList.add('make-comment');
                const commentTextarea = document.createElement('textarea');
                commentTextarea.classList.add('comment-textarea');
                const postCommentBtn = document.createElement('button');
                postCommentBtn.classList.add('post-comment-btn', 'btn', 'btn-outline-primary');
        
                commentTextarea.placeholder = 'Comment here...';
                commentTextarea.rows = '5';
                postCommentBtn.textContent = 'Post';

                makeComment.appendChild(commentTextarea);
                makeComment.appendChild(postCommentBtn);

                makeComment.style.display = 'none';

                // Step8: create an edit textarea and btn
                const editText = document.createElement('div');
                editText.classList.add('edit-text');
                const editTextarea = document.createElement('textarea');
                editTextarea.classList.add('edit-textarea');
                const editTextBtn = document.createElement('button');
                editTextBtn.classList.add('edit-text-btn', 'btn', 'btn-outline-primary');

                editTextarea.value = post['meta']['description_text'];
                editTextBtn.textContent = 'Edit';

                editText.appendChild(editTextarea);
                editText.appendChild(editTextBtn);

                editText.style.display = 'none';

                // Add all Steps containers to the detailsContainer
                detailsContainer.appendChild(authorEditDelete);
                detailsContainer.appendChild(postTime);
                detailsContainer.appendChild(postText);
                detailsContainer.appendChild(thumbnailImg);
                detailsContainer.appendChild(editText);
                detailsContainer.appendChild(likeUnlikeCommentBtn);
                detailsContainer.appendChild(likesComments);
                detailsContainer.appendChild(showLikes);
                detailsContainer.appendChild(showComments);
                detailsContainer.appendChild(makeComment);

                profilePosts.appendChild(displayPost);
            }
        )
    })
}