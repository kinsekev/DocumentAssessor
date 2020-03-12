const express    = require('express'),
      path       = require('path'),
      bodyParser = require('body-parser'),
      mongoose   = require('mongoose'),
      app        = express();

// DATABASE CONNECTION
mongoose.connect('mongodb://localhost/assessments', {useNewUrlParser: true, useUnifiedTopology: true});

// APP CONFIG
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: true}));

const assessmentSchema = new mongoose.Schema({
    title: String,
    description: String,
    quantity: Number
});
const Assessment = mongoose.model('Assessment', assessmentSchema);

// RESTFUL ROUTES

// INDEX
app.get('/', (req, res) => {
    res.redirect('/assessments');
});

app.get('/assessments', (req, res) => {
    res.render('index');
});

// NEW
app.get('/assessments/new', (req, res) => {
    res.render('new');
});

// CREATE
app.post('/assessments', (req, res) => {
    /*
    Adds title, description and quantity to assessment db
    Need to add other requirements on top of these
    */
    var total = {};
    var title = req.body.title;
    var description = req.body.title;
    var quantity = req.body.quantity;
    var assessment = {
        title: title, 
        description: description,
        quantity: quantity
    };
    Assessment.create(assessment, (err, createdAssessment) => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('assessments');
        }
    });
});

// SERVER
app.listen(3000, function() {
    console.log('SERVER IS RUNNING ON PORT 3000!');
});