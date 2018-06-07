const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json())
app.use(express.static('public'))

app.post('/save', (req, res) => {
  if (req.body && req.body.value) {
    const { value } = req.body
    console.log(`Received value: ${value}`)
    res.sendStatus(200)
  } else {
    res.sendStatus(500)
  }
})

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Server is listening on ${port} port`)
})
