const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 4000;
const mongoose = require('mongoose');
let Blog = require('./blog.model');
const blogRoutes = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use('/blogs', blogRoutes);

mongoose.connect('mongodb://127.0.0.1:27017/blogs', { useNewUrlParser: true})
const connection = mongoose.connection;

connection.once('open', () => {
  console.log("Mongo is connected")
})

// To retrieve all the blog posts
blogRoutes.route('/').get((req, res) => {
  Blog.find((err, blogs) => {
    if(err) {
      console.log(err);
    }
    else {
      res.json(blogs);
    } 
  });
});

// To retrieve a single blog post
blogRoutes.route('/:id').get((req, res) => {
  let id = req.params.id;
  Blog.findById(id, (err, blog) => {
    res.json(blog);
  });
});


// To create a new blog post
blogRoutes.route('/create').post((req, res) => {
  let blog = new Blog(req.body);
  blog.save()
      .then(blog => {
        res.status(200).json({'Blog': 'Blog addded successfully'});
      })
      .catch(err => {
        res.status(400).send("Adding new blog failed");
      })
});

// To delete a blogpost
blogRoutes.route('/delete/:id').delete((req, res) => {
  Blog.findByIdAndRemove(req.params.id, (err, blog) => {
    if (err) 
      return res.status(400).send("Failed to delete");
    else {
      return res.status(200).send("Successfully deleted the post");
    }  
  });
});


// To update the blog post
blogRoutes.route('/edit/:id').post((req, res) => {
  let id = req.params.id;
  Blog.findById(id, (err, blog) => {
    if(!blog) {
      res.status(404).send('Data is not found');
    }
    else {
      blog.title = req.body.title;
      blog.intro = req.body.intro;
      blog.description = req.body.description;
      blog.save()
          .then(blog => {
            res.status(200).send('Blog updated successfully');
          })
          .catch(err => {
            res.status(400).send('Update not possible');
          })
    }
  })

})

app.listen(PORT, () => {
  console.log("The sever is running on port" + PORT);
})