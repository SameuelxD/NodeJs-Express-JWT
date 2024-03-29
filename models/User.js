const mongoose=require('mongoose');
const userSchema=mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 6,
        max: 15
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    date: {
        type: Date,
        default: Date.now
    }

})
module.exports=mongoose.model('User',userSchema);