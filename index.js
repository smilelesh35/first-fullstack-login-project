import express from "express";
import postgresclient from "./db.js";
import userRouter from "./routers/userRouter.js";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', (userRouter))


const port = process.env.PORT || 3000;
async function startServer(){
    try{
       await postgresclient.connect()
        console.log("Database connection started "+port );
         app.listen(port, () => {
             console.log("Server started on port "+port);
         })
    }catch(err){
        console.log(err);
    }
}
startServer();