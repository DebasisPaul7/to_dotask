let express = require("express")

let { MongoClient, ObjectId } = require('mongodb')
let ourapp = express()
let db

let port = process.env.PORT
if (port == null || port == "") {
    port=1337
}
ourapp.use(express.static('public')) // comment this line out


async function go() {
    let client = new MongoClient('mongodb+srv://debasispaul7:Debasis@cluster0.miadi.mongodb.net/Tododata?retryWrites=true&w=majority')
    await client.connect()
    db = client.db()
    ourapp.listen(port)
}

go()

ourapp.use(express.json())
let bodyParser = require('body-parser');
ourapp.use(bodyParser.urlencoded({ extended: false }));

function passwordprotected(req, res, next) {
    res.set('WWW-Authenticate', 'Basic realm="Simple To-Do app"')
    if (req.headers.authorization == "Basic VG9kb2FwcDpEZWJhc2lzNw==") {
        next()
    } else {
        res.status(401).send("Authentication Required")
    }
}

ourapp.use(passwordprotected)

ourapp.get('/', function (req, res) {
    db.collection('Lsit').find().toArray((error, items) => {
        //res.sendFile(__dirname + "/indexer.html")
        res.send(`<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Simple To-Do App</title>
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
</head>
<body>
    <div class="container">
        <h1 class="display-4 text-center py-1">To-Do App</h1>

        <div class="jumbotron p-3 shadow-sm">
            <form action="/create" method="post">
                <div class="d-flex align-items-center">
                    <input name="inp_value" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
                    <button class="btn btn-primary">Add New Item</button>
                </div>
            </form>
        </div>

        <ul class="list-group pb-5">
            ${items.map(function (data) {
            return ` <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                <span class="item-text">${data.text}</span>
                <div>
                    <button data-id="${data._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
                    <button data-id="${data._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
                </div>
            </li>`
        }).join("")
            }
        </ul>

    </div>
</body>
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
<script src="/browser.js"></script>
<script>
   
</script>

</html>`)
    })

})

ourapp.post('/create', function (req, res) {
    db.collection('Lsit').insertOne({ text: req.body.inp_value }, function () {
        res.redirect('/')
    })
})

ourapp.post('/update', function (req, res) {
    db.collection('Lsit').findOneAndUpdate({ _id: new ObjectId(req.body.id) }, { $set: { text: req.body.text } }, function () {
        res.redirect('/')
    })
})

ourapp.post('/delete', function (req, res) {
    db.collection('Lsit').deleteOne({ _id: new ObjectId(req.body.id) }, function () {
        res.send("Success")

        //res.redirect('/')
    })
})