import express from 'express';
import postgresclient from "../db.js";
import jwt from 'jsonwebtoken';
import { loginMiddleware } from "../middlewares/middlewares.js";
import {token} from "morgan";

const router = express.Router();

router.post("/signup",async (req,res)=>{
    try{
        const {user_no} = req.body;
        const checktext = 'SELECT * FROM first WHERE user_no =$1';
        const checkresult = await postgresclient.query(checktext,[user_no]);

        if (checkresult.rows.length > 0) {
           return res.status(409).json({message:"User already exist"});

        }

        const text = "INSERT INTO first (name,user_no,password) VALUES ($1,$2,crypt($3,gen_salt('bf'))) RETURNING *"
        const value = [req.body.name, req.body.user_no, req.body.password];
        const {rows} = await postgresclient.query(text, value);
        res.status(201).json({
            createdUser:rows[0],
            token:token

        });
    }catch(err){
        res.status(400).json({message:"User not posted"});
        console.log(err);
    }
})
router.post("/login",async (req,res)=>{
try{
    const text = "SELECT * FROM first WHERE name = $1 AND password = crypt($2,password)";
    const value = [req.body.name,req.body.password];
    const result = await postgresclient.query(text, value);

    if(result.rows.length === 0) {
       return res.status(400).json({message:"User not find"});
    }

    const user = result.rows[0];

    const token = jwt.sign(
        {
            id: user.id,
            name: user.name,
            user_no: user.user_no
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.status(200).json({
        message: "Login success",
        token,
        user
    });

}catch(err){
    console.log(err)
}

})


router.get('/profile', loginMiddleware,async (req,res)=>{
    res.json({
        message:"Profile",
        user:req.user.name
    })
})

export default router;


