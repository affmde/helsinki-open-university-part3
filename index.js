const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const PersonModel = require('./models/persons')

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// eslint-disable-next-line no-unused-vars
morgan.token('body', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : null})

app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    tokens['body'](req, res)
  ].join(' ')
}))
app.use(errorHandler)

//Get all persons
app.get('/api/persons', (req, res) => {
  PersonModel.find({}).then(pers => {
    if(pers){
      console.log(pers)
      res.json(pers)
    }else{
      res.status(404).end()
    }
  }).catch(error => {
    console.log(error)
    res.status(400).send({ error: 'bad id' })
  })
})

//Get one person
app.get('/api/persons/:id', (req, res, next) => {
  PersonModel.findById(req.params.id).then(person => {
    if(person){
      console.log(person)
      res.json(person)
    }else{
      res.status(404).end()
    }
  }).catch(error => {
    next(error)
  })
})


app.get('/api/info', (req, res) => {
  PersonModel.find({}).then(response => {
    const info= `Phonebook has info for ${response.length} people`
    const time = new Date()
    res.send(`<p>${info}</p><p>${time}</p>`)
  })
})

//Delete a person:

app.delete('/api/persons/:id', (req, res, next) => {
  PersonModel.findByIdAndDelete(req.params.id).then(person => {
    console.log(person.id)
    res.json(person)
    res.status(204).end()
  }).catch(error => next(error))
})

//Create Person:

app.post('/api/persons', (req, res, next) => {
  const person = req.body
  const newPerson = new PersonModel({
    name: person.name,
    number: person.number,
  })

  if(!person.name || !person.number){
    return res.status(400).json({
      error: 'Both, name and number must be included'
    })
  }

  newPerson.save().then(pers => {
    res.json(pers.toJSON())
  }).catch(error => next(error))
})

//Update person:

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  const person = {
    name: body.name,
    number: body.number,
  }

  PersonModel.findByIdAndUpdate(req.params.id, person, { new: true })
    .then(updatedPerson => {
      res.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.use(errorHandler)


// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})