const mongoose=require('mongoose')

const mongoSchema=mongoose.Schema({
    webName:String,
    webLink:String,
    webDesc:String,
})



module.exports = mongoose.model('websites',mongoSchema)


