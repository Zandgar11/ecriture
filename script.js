document.getElementById('post-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const content = document.getElementById('content').value;
    if (content.trim()) {
        addPost(content);
        document.getElementById('content').value = '';
    }
});

function addPost(content) {
    const posts = getPosts();
    const newPost = { content: content };
    posts.push(newPost);
    savePosts(posts);
    renderPosts();
}

function getPosts() {
    const posts = localStorage.getItem('posts');
    return posts ? JSON.parse(posts) : [];
}

function savePosts(posts) {
    localStorage.setItem('posts', JSON.stringify(posts));
}

function renderPosts() {
    const posts = getPosts();
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `<p>${post.content}</p>`;
        postsContainer.appendChild(postElement);
    });
}

document.addEventListener('DOMContentLoaded', renderPosts);
