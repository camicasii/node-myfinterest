const express = require('express');
const path = require('path');
const morgan = require('morgan');
const multer = require('multer');
const uuid = require('uuid/v4')
const {format} =  require('timeago.js')
const flash = require('connect-flash');
const cookieParser = require('cookie-parser')
const session = require('express-session')


require('./database/monoose');

const app = express();
//Settings

app.set("port",process.env.PORT||3000);
app.set('views',path.join(__dirname + "/views"));
app.set('view engine','ejs');


//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser('keyboard cat'));
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,  
    cookie: { maxAge: 60000 }}));
app.use(flash());
//app.use(express.raw());
const storage = multer.diskStorage({
    destination:path.join(__dirname+'/public/img/uploads'),
    filename:(req,file,cb,filename)=>{
        cb(null,uuid()+path.extname(file.originalname))
    }
})

app.use(multer({
    storage:storage
}).single("photo"))



//Globar Variables

app.use((req,res,next)=>{
    app.locals.format =format;
    app.locals.message =req.flash('message')
    app.locals.success =req.flash('success')    
    next()
})

//Routes

app.use(require('./router/index'));

//Static File

app.use(express.static(path.join(__dirname + '/public')))


//Start Server

app.listen(app.get("port"),
()=>console.log(`server on port ${app.get("port")}`))