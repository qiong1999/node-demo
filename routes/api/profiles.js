const express = require('express');
const router = express.Router();
const passport = require('passport');
const Profile = require('../../models/Profile');

const profile = require('../../models/Profile');

router.get('/test', (req, res) => {
  res.json({ msg: 'profile works' });
});

router.post(
  '/add',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const profileFields = {};
    Object.assign(profileFields, req.body)

    new Profile(profileFields).save().then((profile) => {
      res.json(profile);
    });
  }
);

router.post(
  '/edit/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const profileFields = {};
    Object.assign(profileFields, req.body)

    Profile.findOneAndUpdate(
      { _id: req.params.id },
      { $set: profileFields },
      { new: true }
    ).then((profile) => res.json(profile));
  }
);

router.get(
  '/remove/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.params.id);
    Profile.findOneAndRemove({ _id: req.params.id })
      .then((profile) => {
        res.json(profile)
      })
      .catch((err) => {
        console.log('err', err);
        res.status(404).json('删除失败');
      });
  }
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.find()
      .then((profile) => {
        if (!profile) {
          return res.status(404).json('没有内容');
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ _id: req.params.id })
      .then((profile) => {
        if (!profile) {
          return res.status(404).json('没有任何内容');
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

module.exports = router;
