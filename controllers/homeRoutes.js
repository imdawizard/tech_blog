const router = require('express').Router();
const { User, Blogpost } = require('../models');
// const Blogpost = require('../models/Blogpost');
// const User = require('../models/User');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    // Get all blogposts and JOIN with user data
    const blogpostData = await Blogpost.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogposts = blogpostData.map((blogpost) => blogpost.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogposts, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// router.get('/blogpost/:id', async (req, res) => {
//   try {
//     const blogpostData = await Blogpost.findByPk(req.params.id, {
//       include: [
//         {
//           model: User,
//           attributes: ['name'],
//         },
//       ],
//     });

router.get('/blogposts/:id', async (req, res) => {
  try {
    const postId = req.params.id;
    // Fetch the blog post data for the specified ID
    const blogpost = await Blogpost.findByPk(postId, {
      // include: [{ model: Comment, include: User }], // Include comments and their creators
    });
    if (!blogpost) {
      // Handle the case where the blog post is not found
      return res.status(404).render('error'); // You can create an error handle view
    }
    const blogpostData = blogpost.toJSON();
    // Render the "blogPostDetail" view and pass the blogpost data to it
    res.render('blogPostDetail', { blogpost });
    console.log(blogpost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blogpost }],
    });

    const user = userData.get({ plain: true });

    res.render('dashboard', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/newPost', withAuth, async (req, res) => {
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

// router.get('/updatePost/id', withAuth, async (req, res) => {
//   try {
//     // Find the logged in user based on the session ID
//     const userData = await User.findByPk(req.session.user_id, {
//       attributes: { exclude: ['password'] },
//       include: [{ model: Blogpost }],
//     });

//     const user = userData.get({ plain: true });

//     res.render('updatePost', {
//       ...user,
//       logged_in: true
//     });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login');
});

module.exports = router;
// module.exports = { Blogpost, User };