user = {
  name: '123',
  email: '1@1.1',

  friends: [
    {type: ObjectId, ref: 'User'}
  ]
}

User.find({email: '1@1.1'});

// {name: '', email: '', friends: [ObjectId, ObjectId]}

User.find({email: '1@1.1'}).populate('friends');

// {name: '', email: '', friends: [{email: '2@2.2'}, {email: '3@3.3'}]}

User.find({friends: '3@3.3'});

// {name: '', email: '', friends: [{email: '2@2.2'}, {email: '3@3.3'}]}
