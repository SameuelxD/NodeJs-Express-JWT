const router = require('express').Router();
const User = require('../models/User.js');
const bcrypt=require('bcrypt');
const Joi=require('@hapi/joi');
const jwt=require('jsonwebtoken');

const { schema } = require('@hapi/joi/lib/compile.js');
const schemaRegister=Joi.object({
    name: Joi.string().min(6).max(15).required(),
    email: Joi.string().min(6).max(30).required().email(),
    password: Joi.string().min(6).max(255).required()
})
const schemaLogin=Joi.object({
    email: Joi.string().min(6).max(30).required().email(),
    password: Joi.string().min(6).max(255).required()
})
router.post('/login', async(req,res) => {
    // validaciones
    const { error } = schemaLogin.validate(req.body);
    if(error) return res.status(400).json({error: error.details[0].message})

    const user= await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).json({ error: 'Usuario no encontrado '});

    const validPassword=await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(400).json({error: 'Contraseña Invalida'})
    
    // create token
    const token=jwt.sign({
        name: user.name,
        id: user._id,
    }, process.env.TOKEN_SECRET)
    
    res.header('auth-token', token).json({
        error: null,
        data: {token}
    })
    
    // res.json({
    //     error:null,
    //     data: 'Acceso Exitoso',
    //     token: token
    // })
})

router.post('/register', async (req, res) => {
    // validacion de usuario
    const {error}=schemaRegister.validate(req.body)
    if(error){
        return res.status(400).json({
            error: error.details[0].message
        })
    }
    const validarEmail=await User.findOne({email:req.body.email});
    if(validarEmail) return res.status(400).json({error: true,message: 'Email ya Registrado'});

    const saltos=await bcrypt.genSalt(10);
    const password=await bcrypt.hash(req.body.password,saltos);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    })
    try {
        const userDB = await user.save();
        res.json({
            error: null,
            data: userDB
        })
    } catch (error) {
        res.status(400).json(error);
    }
})

module.exports = router;