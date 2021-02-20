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
                ref: `product`,
            }
        ]
})

const autoPopulateLead = function(next) {
    this.populate('carts');
    next();
  };
  
registerSchema.pre('findOne', autoPopulateLead)
.pre('find', autoPopulateLead)

const newPerson = new mongoose.model(`user`, registerSchema)

module.exports = newPerson
