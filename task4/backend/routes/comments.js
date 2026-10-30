const express = require("express");
const Comment = require("../models/Comment");
const Blog = require("../models/Blog");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Authentication Middleware
function auth(req, res, next) {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Please login first"
            });
        }

        const token = header.split(" ")[1];
        req.user = jwt.verify(token, process.env.JWT_SECRET);

        next();
    } catch {
        res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

// Add Comment
router.post("/:blogId", auth, async (req, res) => {
    try {
        const { text } = req.body;

        if (!text || !text.trim()) {
            return res.status(400).json({
                message: "Comment cannot be empty"
            });
        }

        const blog = await Blog.findById(req.params.blogId);

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        const comment = await Comment.create({
            blog: req.params.blogId,
            user: req.user.id,
            text: text.trim()
        });

        res.status(201).json({
            message: "Comment added successfully",
            comment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// View Comments
router.get("/:blogId", async (req, res) => {
    try {
        const comments = await Comment.find({
            blog: req.params.blogId
        })
        .populate("user", "name")
        .sort({ createdAt: -1 });

        res.json(comments);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;