const express = require("express");
const router = express.Router();
const db = require("../data/db");

router.post("/api/posts", (req, res) => {
  const newPost = req.body;
  if (newPost.title && newPost.contents) {
    db.insert(newPost)
      .then(post => {
        res.status(201).json(post);
      })
      .catch(error => {
        res.status(500).json({
          error: "There was an error while saving the post to the database"
        });
      });
  } else {
    res.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  }
});

router.post("/api/posts/:id/comments", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        if (req.body.text) {
          const newComment = { ...req.body, post_id: req.params.id };
          db.insertComment(newComment)
            .then(comment => {
              res.status(201).json({
                success: "Successfully created comment",
                comment
              });
            })
            .catch(error => {
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database"
              });
            });
        } else {
          res.status(400).json({
            errorMessage: "Please provide text for the comment."
          });
        }
      }
    })
    .catch(error => {
      res.status(500).json({
        error: "There was an error while saving the comment to the database"
      });
    });
});

router.get("/api/posts", (req, res) => {
  db.find()
    .then(posts => {
      if (posts.length === 0) {
        res.status(200).json({ message: "There are no posts at this time" });
      } else {
        res.status(200).json(posts);
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

router.get("/api/posts/:id", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json(post);
      }
    })

    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.get("/api/posts/:id/comments", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        db.findPostComments(req.params.id)
          .then(comments => {
            if (comments.length === 0) {
              res.status(404).json({
                message:
                  "The post with the specified ID currently has no comments."
              });
            } else {
              res.status(200).json(comments);
            }
          })

          .catch(error => {
            res.status(500).json({
              error: "The comments information could not be retrieved."
            });
          });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.delete("/api/posts/:id", (req, res) => {
  db.remove(req.params.id)
    .then(post => {
      if (post === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        res.status(200).json("Post deleted from database");
      }
    })

    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

router.put("/api/posts/:id", (req, res) => {
  db.findById(req.params.id)
    .then(post => {
      if (post.length === 0) {
        res
          .status(404)
          .json({ message: "The post with the specified ID does not exist." });
      } else {
        db.update(req.params.id, req.body)
          .then(updated => {
            if (!req.body.title || !req.body.contents) {
              res.status(400).json({
                errorMessage: "Please provide title and contents for the post."
              });
            } else {
              res.status(202).json("This post has now been updated");
            }
          })
          .catch(error => {
            res
              .status(500)
              .json({ error: "The post information could not be modified." });
          });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({ error: "The post information could not be retrieved." });
    });
});

module.exports = router; 
