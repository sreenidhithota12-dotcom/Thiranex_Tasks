const API = "http://localhost:5000/api";

let token = localStorage.getItem("token");
let editingBlogId = null;

// DOM elements
const authSection = document.getElementById("authSection");
const blogSection = document.getElementById("blogSection");
const welcome = document.getElementById("welcome");

// API helper
async function request(url, options = {}) {
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers
    };

    const response = await fetch(url, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
    }

    return data;
}

// Show correct section
function updateUI() {
    authSection.hidden = !!token;
    blogSection.hidden = !token;
    document.getElementById("logoutBtn").hidden = !token;

    welcome.textContent = token
        ? `Welcome, ${localStorage.getItem("name")}`
        : "";

    if (token) loadBlogs();
}

function showMessage(id, message, success = false) {
    const element = document.getElementById(id);
    element.textContent = message;
    element.className = success ? "text-success mt-2" : "text-danger mt-2";
}

// REGISTER
document.getElementById("registerBtn").addEventListener("click", async () => {
    try {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (!name || !email || !password) {
            throw new Error("Please fill all fields");
        }

        const data = await request(`${API}/auth/register`, {
            method: "POST",
            body: JSON.stringify({ name, email, password })
        });

        showMessage("authMessage", data.message, true);

    } catch (error) {
        showMessage("authMessage", error.message);
    }
});

// LOGIN
document.getElementById("loginBtn").addEventListener("click", async () => {
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const data = await request(`${API}/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password })
        });

        token = data.token;

        localStorage.setItem("token", token);
        localStorage.setItem("name", data.name);

        updateUI();

    } catch (error) {
        showMessage("authMessage", error.message);
    }
});

// LOGOUT
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    token = null;
    editingBlogId = null;
    updateUI();
});

// CREATE OR UPDATE BLOG
document.getElementById("publishBtn").addEventListener("click", async () => {
    try {
        const title = document.getElementById("title").value.trim();
        const content = document.getElementById("content").value.trim();

        if (!title || !content) {
            throw new Error("Enter title and content");
        }

        const isEditing = !!editingBlogId;

        const url = isEditing
            ? `${API}/blogs/${editingBlogId}`
            : `${API}/blogs`;

        await request(url, {
            method: isEditing ? "PUT" : "POST",
            body: JSON.stringify({ title, content })
        });

        resetForm();
        showMessage("blogMessage",
            isEditing ? "Blog updated!" : "Blog published!", true);

        loadBlogs();

    } catch (error) {
        showMessage("blogMessage", error.message);
    }
});

// RESET FORM
function resetForm() {
    editingBlogId = null;

    document.getElementById("title").value = "";
    document.getElementById("content").value = "";

    document.getElementById("formHeading").textContent = "Create a New Blog";
    document.getElementById("publishBtn").textContent = "Publish Blog";
    document.getElementById("cancelEditBtn").hidden = true;
}

// CANCEL EDIT
document.getElementById("cancelEditBtn").addEventListener("click", resetForm);

// LOAD BLOGS
async function loadBlogs() {
    try {
        const blogs = await request(`${API}/blogs`);
        const container = document.getElementById("blogs");

        container.replaceChildren();

        if (!blogs.length) {
            container.textContent = "No blogs available.";
            return;
        }

        blogs.forEach(blog => {
            const column = document.createElement("div");
            column.className = "col-md-6";

            const card = document.createElement("div");
            card.className = "blog-card";

            const heading = document.createElement("h4");
            heading.textContent = blog.title;

            const content = document.createElement("p");
            content.className = "blog-content";
            content.textContent = blog.content;

            const author = document.createElement("small");
            author.className = "text-muted";
            author.textContent = `By ${blog.author?.name || "Unknown"}`;

            card.append(heading, content, author);

            const actions = document.createElement("div");
            actions.className = "blog-actions";

            // Edit and Delete buttons
            if (blog.author?._id === getUserId()) {
                const edit = createButton("Edit", "btn-warning", () => {
                    editingBlogId = blog._id;

                    document.getElementById("title").value = blog.title;
                    document.getElementById("content").value = blog.content;

                    document.getElementById("formHeading").textContent = "Edit Blog";
                    document.getElementById("publishBtn").textContent = "Update Blog";
                    document.getElementById("cancelEditBtn").hidden = false;

                    window.scrollTo({ top: 0, behavior: "smooth" });
                });

                const remove = createButton("Delete", "btn-danger", async () => {
                    if (!confirm("Delete this blog?")) return;

                    try {
                        await request(`${API}/blogs/${blog._id}`, {
                            method: "DELETE"
                        });

                        loadBlogs();
                    } catch (error) {
                        alert(error.message);
                    }
                });

                actions.append(edit, remove);
                card.appendChild(actions);
            }

            // Comment section
            const commentInput = document.createElement("input");
            commentInput.className = "form-control mt-3";
            commentInput.placeholder = "Write a comment";

            const commentButton = createButton(
                "Add Comment", "btn-success", async () => {
                    try {
                        await request(`${API}/comments/${blog._id}`, {
                            method: "POST",
                            body: JSON.stringify({
                                text: commentInput.value
                            })
                        });

                        commentInput.value = "";
                        loadComments(blog._id);
                    } catch (error) {
                        alert(error.message);
                    }
                }
            );

            const viewButton = createButton(
                "View Comments", "btn-secondary", () => {
                    loadComments(blog._id);
                }
            );

            const comments = document.createElement("div");
            comments.id = `comments-${blog._id}`;

            card.append(
                commentInput,
                commentButton,
                viewButton,
                comments
            );

            column.appendChild(card);
            container.appendChild(column);
        });

    } catch (error) {
        document.getElementById("blogs").textContent = error.message;
    }
}

// CREATE BUTTON HELPER
function createButton(text, color, callback) {
    const button = document.createElement("button");
    button.textContent = text;
    button.className = `btn ${color} btn-sm me-2 mt-2`;
    button.addEventListener("click", callback);
    return button;
}

// LOAD COMMENTS
async function loadComments(blogId) {
    try {
        const comments = await request(`${API}/comments/${blogId}`);
        const container = document.getElementById(`comments-${blogId}`);

        container.replaceChildren();

        comments.forEach(comment => {
            const item = document.createElement("div");
            item.className = "comment-box";

            const name = document.createElement("strong");
            name.textContent = comment.user?.name || "User";

            const text = document.createElement("p");
            text.textContent = comment.text;

            item.append(name, text);
            container.appendChild(item);
        });

    } catch (error) {
        alert(error.message);
    }
}

// Get current user ID from JWT payload
function getUserId() {
    if (!token) return null;

    try {
        const payload = JSON.parse(
            atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
        );

        return payload.id;
    } catch {
        return null;
    }
}

// INITIALIZE
updateUI();
