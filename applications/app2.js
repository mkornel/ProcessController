const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('App 2!'))

app.listen(3002, () => console.log('App 2 listening on port 3002!'))