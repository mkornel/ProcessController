const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('App 1!'))

app.listen(3001, () => console.log('App 1 listening on port 3001!'))