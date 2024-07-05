const gistId = 'https://gist.github.com/Zandgar11/619e8deca7823c78006cd14efe68dfd5#file-posts-json';  // Remplace par l'ID de ton Gist
const gistToken = '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';  // Remplace par ton jeton GitHub

const gistUrl = `https://api.github.com/gists/${gistId}`;
const postsUrl = `https://api.github.com/gists/${gistId}/files/posts.json`;

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
});

document.getElementById('post-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const content = document.getElementById('content').value;
    if (content.trim()) {
        await addPost(content);
        document.getElementById('content').value = '';
        loadPosts();
    }
});

async function loadPosts() {
    const response = await fetch(postsUrl);
    const posts = await response.json();
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `<p>${post.content}</p>`;
        postsContainer.appendChild(postElement);
    });
}

async function addPost(content) {
    const response = await fetch(gistUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${gistToken}`
        },
        body: JSON.stringify({
            files: {
                'posts.json': {
                    content: JSON.stringify([...await (await fetch(postsUrl)).json(), { content }])
                }
            }
        })
    });

    if (!response.ok) {
        throw new Error(`Failed to add post: ${response.statusText}`);
    }
}
// Toggle admin mode
document.getElementById('admin-toggle').addEventListener('click', () => {
    document.body.classList.toggle('admin-mode');
    document.getElementById('admin-form-section').style.display = document.body.classList.contains('admin-mode') ? 'block' : 'none';
    document.getElementById('admin-toggle').textContent = document.body.classList.contains('admin-mode') ? 'Désactiver le Mode Admin' : 'Activer le Mode Admin';
});

document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    
    // Supprimer un post
    document.getElementById('delete-form').addEventListener('submit', async (event) => {
        event.preventDefault();
        const postId = document.getElementById('post-id').value;
        if (postId.trim()) {
            await deletePost(postId);
            document.getElementById('post-id').value = '';
            loadPosts();
        }
    });
});

async function loadPosts() {
    const response = await fetch(postsUrl);
    const posts = await response.json();
    const postsContainer = document.getElementById('posts-container');
    postsContainer.innerHTML = '';
    Object.values(posts).forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `<p>${post.content}</p>`;
        postsContainer.appendChild(postElement);
    });
}

async function deletePost(postId) {
    // Fetch current posts
    const response = await fetch(postsUrl);
    const posts = await response.json();
    
    // Find the post to delete
    const updatedPosts = Object.entries(posts).filter(([id]) => id !== postId);
    
    // Create the new content
    const newContent = {};
    updatedPosts.forEach(([id, post]) => {
        newContent[id] = post;
    });
    
    // Update the Gist
    await fetch(gistUrl, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `token ${gistToken}`
        },
        body: JSON.stringify({
            files: {
                'posts.json': {
                    content: JSON.stringify(newContent)
                }
            }
        })
    });
}
