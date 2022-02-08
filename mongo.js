const mongoose = require('mongoose');
const PersonModel = require('./modules/personsModel');
require('dotenv').config()


if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
  }

if(process.argv.length ===3){
    console.log(PersonModel.find({}).then(person=>{
        console.log("Phonebook:")
        person.map(pers=> console.log(pers.name, pers.number))
        mongoose.connection.close()
    }))
}

  const password = process.argv[2]

  const url = process.env.MONGODB_URI
  
  mongoose.connect(url)

  const newPerson = new PersonModel({
      name: process.argv[3],
      number: process.argv[4]
  })

  if(process.argv.length>3){
      newPerson.save().then(result=>{
      console.log(`added ${result.name} number ${result.number} to phonebook`);
      mongoose.connection.close()
  })
}

