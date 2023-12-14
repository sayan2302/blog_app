import mongoose from "mongoose";

const Schema = mongoose.Schema({
    fullname:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
})

const user = mongoose.model('user', Schema)

export default user