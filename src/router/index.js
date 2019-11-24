require('dotenv').config()
const { Router} = require('express');
const router = Router();
const Image = require('../database/schema');
const {unlink} = require('fs-extra');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
   cloud_name:process.env.CLOUDINARY_CLOAD_NAME,
   api_key:process.env.CLOUDINARY_API_KEY,
   api_secret:process.env.CLOUDINARY_API_SECRET
   
   
})

router.get('/',async (req,res)=>{
    try{
    const images = await Image.find();    
    //console.log(images.length);
    //console.log(req.app.locals.format(images[0].created_at))    

    res.render('index',{images})
    }
    catch{
        res.send("no hay imagenes agregadas")
    }
})

router.get('/upload',(req,res)=>{
    
    res.render('upload')
})

router.post('/upload',(req,res,next)=>{   
    if(req.file!==undefined)
    return next()    
    req.flash('message', 'File empty, insert a image please');
    return res.redirect('/upload')

},
async(req,res)=>{    
    
    
    const result = await cloudinary.uploader.upload(req.file.path,{
        folder:"test-cloudinary.app"
    })
//    console.log(result)
const {title,description}=req.body;    
const {filename,originalname,mimetype,size,path}=req.file;    

const newimage = new Image({
    title,
    description,
    filename,
    originalname,
    mimetype,
    size,
    path,
    url:result.url,
    public_id:result.public_id

});


    /*
    image.title=req.body.title;
    image.description=req.body.description;
    image.filename= req.file.filename;
    image.path='/img/uploads/' + req.file.filename;    
    image.originalname=req.file.originalname;
    image.mimetype=req.file.mimetype;
    image.size=req.file.size;
    image.url=result.url;
    image.public_id=result.public_id;        */
    console.log(
        newimage
    );    
    await newimage.save()
    .then(async()=>await unlink(newimage.path))
    
    req.flash('success', 'Image saved successfully');
    return res.redirect('/')
})
router.get('/image/:id',async(req,res)=>{
    const {id}= req.params;
    const image = await Image.findById(id);
    return res.render('profile',{image});
})
router.get('/image/:id/delete',async(req,res)=>{
    const {id}= req.params;
    const imageDeleted = await Image.findByIdAndDelete(id)
    //await unlink(imageDeleted.path)
    //await cloudinary.api.delete_resources(imageDeleted.public_id)
    .then(async()=>await Image.findByIdAndDelete(id))
    req.flash('message', 'Image Delete successfully');
    return res.redirect("/")
})
router.get('/galery',async(req,res)=>{
    try{
        const images = await Image.find();    
        //console.log(images.length);
        //console.log(req.app.locals.format(images[0].created_at))    
    
        res.render('galery',{images})
        }
        catch{
           res.send("no hay imagenes agregadas")
        }
})
module.exports=router;