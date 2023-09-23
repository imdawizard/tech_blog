const router = require('express').Router();
const { Blogpost } = require('../../models');
const withAuth = require('../../utils/auth');

//create new blogpost
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Blogpost.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    //redirect user to dashboard
    res.redirect('/dashboard');
    // res.status(200).json(newPost);
  } catch (err) {
    console.error(err);
    console.log(req.body);
    res.status(400).json(err);
  }
});

router.get('/', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blogpost }],
    });

    const user = userData.get({ plain: true });

    res.render('newPost', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


//update a blogpost by id
router.put('/:id', withAuth, async (req, res) => {
  try {
    const updatedPost = await Blogpost.update(
      {
        title: req.body.title,
        content: req.body.content,
      },
      {
        where: {
          id: req.params.id,
          user_id: req.session.user_id,
        },
      }
    );

    if (updatedPost[0] === 0) {
      res.status(404).json({ message: 'No blog post found with this id!' });
      return;
    }

    res.status(200).json({ message: 'Blog post updated successfully' });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', withAuth, async (req, res) => {
  try {
    const postData = await Blogpost.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (!postdata) {
      res.status(404).json({ message: 'No blogpost found with this id!' });
      return;
    }

    res.status(200).json(postData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
