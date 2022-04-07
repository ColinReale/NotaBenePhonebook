const { response } = require('express')
const express = require('express')
const app = express()
const morgan = require('morgan');
// const Moment = require('moment');
// const {}

app.use(express.json())

let persons = 
[
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

// #7 setting up morgan

app.use(morgan(':method :url :status :body :res[content-length] - :response-time ms'));
morgan.token('body', function (req, res) { return JSON.stringify(req.body)});

// getting basically html from the website to the browser that a human can read
app.get('/', (request, response) => {
    response.send('<h1>Goodbye Cruel World</h1>')
})
// getting info from the website in JSON form
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
// getting info from the website that a human can read
app.get('/info', (request, response) => {
    const currentDate = new Date();
response.send('<p>Phonebook has info for '+ persons.length + ' people</p>' + currentDate)
})
// getting info from the website in JSON form
app.get('/api/persons/:id', (request, response) => {
    // converting the url into a number form so that the function I wrote can find the id number
    const id = Number(request.params.id)
    // using the find function which is a JS function for searching data for a specific thing.
    // this one is looking through elements, looking at their id, and seeing if it matches the input id
    const person = persons.find(person => {
        // helping me debug a problem
    console.log(person.id, typeof person.id, id, typeof id, person.id === id)
    return person.id === id
})
if (person) {
    response.json(person)
} else {
    response.status(404).end()
}
})

// deleting  
app.delete('/api/persons/5', (request, response) => {
    const id = Number(request.params.id)
    const persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  }) 

//   #5 and #6
app.post("/api/persons", (request, response) => {
    const body = request.body;
    // defining a variable (ubicado) that will search the phonebook for names that already exist
    const ubicado = persons.find((person) => person.name === body.name);
    // if argument that will return an error message if ubicado finds that a new entry has the same name as an existing entry
    if (ubicado) {
        return response.status(500).json({error: "Cannot have the same name as a previous entry"});
    }
    // if statement that will return an error if no name is entered (altohugh if you put 'noname' like the rapper that will work)
    if (body.name === '') {
        return response.status(500).json({error: "Must enter a name"});
    } else if(body.number === '') {
        return response.status(500).json({error: "Must enter a number"});
    }
    // using a math funciton native to JS that will generate a new id for the phonebook
    
    const person = {
        name: body.name,
        number: body.number,
        id: (Math.random() * 521).toFixed(0)
    }
persons.push(person);
response.json(persons);

});


// listening on port 3021 (the website's "channel") for changes to the website and logging them in my console
const PORT = 3021
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

