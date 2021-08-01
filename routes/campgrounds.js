const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware')
const campgrounds = require('../controllers/campgrounds')


router.route('/')
    .get(catchAsync(campgrounds.campHome))
    .post(isLoggedIn, validateCampground, catchAsync(campgrounds.campCreate))

router.get('/new', isLoggedIn, campgrounds.campNew)

router.route('/:id')
    .get(catchAsync(campgrounds.campDetails))
    .put(isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.campEdit))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.campDelete))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.campEditRender))

module.exports = router;






// router.get('/', catchAsync(campgrounds.campHome))                                                             //home
// router.get('/new', isLoggedIn, campgrounds.campNew)                                                                       //create new
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.campCreate))
// router.get('/:id', catchAsync(campgrounds.campDetails))                                                                   // details page
// router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.campEditRender))                                    //edit
// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds.campEdit));
// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.campDelete))                                          //delete
