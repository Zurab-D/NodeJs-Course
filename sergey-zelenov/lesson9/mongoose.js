// mongoose 4.5

const AuthorSchema = new Schema({
  name: String
});

// Specifying a virtual with a `ref` property is how you enable virtual
// population
AuthorSchema.virtual('posts', {
  ref: 'BlogPost',
  localField: '_id',
  foreignField: 'author'
});

const BlogPostSchema = new Schema({
  title: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
  comments: [{
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    content: String
  }]
});

const Author = mongoose.model('Author', AuthorSchema);
const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

Author.findOne().populate('posts').then(author => {
  // `author.posts` is an array of `BlogPost` documents
});

BlogPost.findOne().populate('author').then(author => {
  // `author` now contains an 'Author' document
});

// UserSchema.pre('save', (next) => {
  // User.findById(id).count();
  // count === 0 ? true : false
// })

// post('save', (err, next) => { if(err === MongooError) })
// save((err) => {})

// 4.5

// post('save', (err, res, next) => {
//   if (err.name === 'MongooError') ...
// });
