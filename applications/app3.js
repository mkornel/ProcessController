const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('App 3!'))

app.listen(3003, () => console.log('App 3 listening on port 3003!'))