const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const {storage} = require('../cloudinary')
const multer = require('multer');
const upload = multer({storage});

router.route('/')
    .get(catchAsync(campgrounds.campHome))
    .post(isLoggedIn, upload.array('image'), validateCampground,  catchAsync(campgrounds.campCreate))

router.get('/new', isLoggedIn, campgrounds.campNew)

router.route('/:id')
    .get(catchAsync(campgrounds.campDetails))
    .put(isLoggedIn, isAuthor,upload.array('image'), validateCampground, catchAsync(campgrounds.campEdit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.campDelete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.campEditRender))

module.exports = router;


