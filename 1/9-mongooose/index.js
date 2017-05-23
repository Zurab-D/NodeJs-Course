const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mychat');

/*let fooSchema = new mongoose.Schema({foo: String});
let fooModel = mongoose.model('document', fooSchema);
fooModel.find({foo: "bar"}).exec((err, foo) => {
    console.log(foo);
    mongoose.disconnect();
});*/

let aSchema = new mongoose.Schema({a: Number});
let aModel = mongoose.model('document', aSchema);
/*
aModel.remove({a: 1}).exec((err, a) => {
    //console.log(a.result.ok);
    if (err) {
        console.log(err.message);
    } else {
        console.log(a);
    };
    mongoose.disconnect();
});
*/
aModel.find({}).exec((err, a) => {
    if (err) {
        console.log(err.message);
        mongoose.disconnect();
    } else {
        console.log(a);
        aModel.remove({a: 1}).exec((err, a) => {
            if (err) {
                console.log(err.message);
                mongoose.disconnect();
            } else {
                console.log(a.result.n);
                aModel.find({}).exec((err, a) => {
                    if (err) {
                        console.log(err.message);
                        mongoose.disconnect();
                    } else {
                        console.log(a);
                    };
                    mongoose.disconnect();
                });
            };
        });
    };
});
