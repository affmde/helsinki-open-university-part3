const mongoose= require('mongoose');

const url = process.env.MONGODB_URI

mongoose.connect(url).then(res=>{
    console.log("Connected to mongoose")
}).catch(err=>{
    consolelog("An error as occured", err.message)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [3, "Name must have at least 3 characters"],
        unique: [true, "Name already exist"]
    },
    number:{
        type: String,
        minlength: 8,
        validate: {
            validator: function(v) {
              return /\d{2}-\d{7}/.test(v) || /\d{3}-\d{8}/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
        required: [true, 'User phone number required']
        
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })


  const PersonModel = mongoose.model('person', personSchema);
  module.exports= PersonModel