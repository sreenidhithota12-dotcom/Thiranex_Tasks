const express = require("express");
const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Authentication Middleware
function auth(req, res, next) {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Access denied. Please login."
            });
        }

        const token = header.split(" ")[1];

        req.user = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch (error) {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

// 1. Get all blogs
router.get("/", async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "name")
            .sort({ createdAt: -1 });

        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. Create blog
router.post("/", auth, async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required"
            });
        }

        const blog = await Blog.create({
            title,
            content,
            author: req.user.id
        });

        res.status(201).json({
            message: "Blog created successfully",
            blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Update blog
router.put("/:id", auth, async (req, res) => {
    try {
        const blog = await Blog.findOneAndUpdate(
            {
                _id: req.params.id,
                author: req.user.id
            },
            {
                title: req.body.title,
                content: req.body.content
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found or unauthorized"
            });
        }

        res.json({
            message: "Blog updated successfully",
            blog
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. Delete blog
router.delete("/:id", auth, async (req, res) => {
    try {
        const blog = await Blog.findOneAndDelete({
            _id: req.params.id,
            author: req.user.id
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found or unauthorized"
            });
        }

        res.json({
            message: "Blog deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;