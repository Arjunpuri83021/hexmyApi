const mongoose=require('mongoose')

const mongoSchema=mongoose.Schema({
    starurl:String,
    starName:String,
    likes:String,
    starImgUrl:String
})


module.exports = mongoose.model('Stars',mongoSchema)