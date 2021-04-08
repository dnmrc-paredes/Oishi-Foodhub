const mongoose = require(`mongoose`)

const registerSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, `Email must be valid`],
        unique: true,
    },
    password: String,
    isAdmin: Boolean,
    carts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'cartItem'
        }
    ]
    
})

// const autoPopulateLead = function(next) {
//     this.populate('carts');
//     next();
// };

// carts: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: `product`,
//         }
//     ]
  
// registerSchema.pre('findOne', autoPopulateLead)
// .pre('find', autoPopulateLead)

const newPerson = new mongoose.model(`user`, registerSchema)

module.exports = newPerson
