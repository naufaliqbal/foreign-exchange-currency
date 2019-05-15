const express = require('express')

const app = express()

app.use(express.static(__dirname + '/public'))
app.engine('html', require('ejs').renderFile)
app.set('views', __dirname + '/public/html')

app.get('/', (req, res) => {
    res.render('index.html')
})

app.listen(process.env.PORT || 5000, function() {
    console.log('Server listening on port ' + (process.env.PORT || 5000))
})