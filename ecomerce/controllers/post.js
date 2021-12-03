const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const Post = require('../models/post');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.create = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: 'Image could not be uploaded'
            });
        }
        // check for all fields
        const { title, desc, comments, likes } = fields;

        if (!title || !desc) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        let post = new Post(fields);

        // 1kb = 1000
        // 1mb = 1000000

        if (files.image) {
            // console.log("FILES PHOTO: ", files.photo);
            if (files.image.size > 1000000) {
                return res.status(400).json({
                    error: 'Image should be less than 1mb in size'
                });
            }
            post.image.data = fs.readFileSync(files.image.path);
            post.image.contentType = files.image.type;
        }

        post.save((err, result) => {
            if (err) {
                console.log('PRODUCT CREATE ERROR ', err);
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(result);
        });
    });
};

exports.list = (req, res) => {
    let order = req.query.order === 'asc' ? -1 : 1;
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    // let limit = req.query.limit ? parseInt(req.query.limit) : 6;
    console.log(order, sortBy, 'sortBy')
    Post.find()
        .sort([[sortBy, order]])
        .exec((err, products) => {
            if (err) {
                return res.status(400).json({
                    error: 'Products not found'
                });
            }
            res.json(products);
        });
};

exports.update = (req, res) => {
    const { title, desc, _id, image, comments, likes } = req.body;

    Post.findOne({ _id }, (err, post) => {
        if (err || !post) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        if (title) {
            post.title = title;
        } else {
            post.title = post.title;
        }

        if (desc) {
            post.desc = desc;
        } else {
            post.desc = post.desc;
        }

        if (comments) { 
            post.comments = post.comments?.concat(comments);
            post.comment = post.comments?.length;
        } else {
            post.comments = post.comments;
            post.comment = post.comments?.length;
        }
        if (likes) {
            post.likes = post?.likes?.concat(likes);
            post.like = post.likes?.length;
        } else {
            post.likes = post.likes;
            post.like = post.likes?.length;
        }
       console.log(post.comments)
        // res.json(post);

        post.save((err, updatedPost) => {
            if (err) {
                console.log('POST UPDATE ERROR', err);
                return res.status(400).json({
                    error: 'Post update failed'
                });
            }
            res.json(updatedPost);
        });
    });

};

