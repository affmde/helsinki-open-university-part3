const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors')

app.use(express.json());
app.use(cors());
morgan.token('body', function (req, res) { return req.method === 'POST' ? JSON.stringify(req.body) : null})
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


let persons=[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//Get all persons
app.get("/api/persons", (req, res)=>{
    res.json(persons)
})

//Get one person
app.get("/api/persons/:id", (req, res)=>{
    const id= Number(req.params.id);
    const person = persons.find(pers=>pers.id===id)
    console.log(person)
    res.json(person)
})


app.get("/api/info", (req, res)=>{
    const info= `Phonebook has info for ${persons.length} people`
    const time = new Date()
    res.send(`<p>${info}</p><p>${time}</p>`)
})

//Delete a person:

app.delete("/api/persons/:id", (req, res)=>{
    const id= Number(req.params.id);
    persons = persons.filter(person=>person.id !== id)

    res.status(204).end()

})

//Create Person:

app.post("/api/persons", (req, res)=>{
    const person = req.body
    const newPerson = {
        id: Math.floor(Math.random()*999999999999),
        timeStamp: new Date(),
        name: person.name,
        number: person.number,
    }

    if(!person.name || !person.number){
        return res.status(400).json({
            error: "Both, name and number must be included"
        })
    }
    
    if(persons.find(pers=>pers.name===newPerson.name)){
        return res.status(400).json({
            error: "The name already exists"
        })
    }
    persons= persons.concat(newPerson)
    res.json(newPerson)
})





const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})