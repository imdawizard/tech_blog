const router = require('express').Router();
const { Comment } = require('../../models');
// const { Blogpost } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/blogpost/:id', async (req, res) => {
  try {
    const blogpost = await Blogpost.findByPk(req.params.id, {
      include: [{ model: Comment }],
    });

    // const userLoggedIn = !!req.session.user_id;
    // Render the template with the blogpost data, which now includes comments
    res.render('blogPostDetail', { 
      blogpost, 
      logged_in: req.session.logged_in 
    });
    // res.render('blogPostDetail', { blogpost, userLoggedIn });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Route to create a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      comment: req.body.comment,
      user_id: req.session.user_id, // The ID of the user who created the comment
      blogpost_id: req.body.blogpost_id, // The ID of the associated blog post
    });

    res.status(200).json(newComment);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;