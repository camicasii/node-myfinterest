 
require('dotenv').config()
const mongoose=  require('mongoose');


const url_mongo = process.env.DB_MONGO;
mongoose.Promise =global.Promise;
 const mongo = mongoose;
 module.exports = mongo.connect(url_mongo,{
    useUnifiedTopology: true ,
    useNewUrlParser: true ,
    useFindAndModify:false//con esta opcion activa podemos usar comodamente el metodo patch
})
.then(()=>console.log("db_connect"))
.catch(()=>console.log("db_Not_connect"))