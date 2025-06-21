import express from "express";
import connectDB from "./config/db.js";
import {config} from "dotenv";
import authRouter from "./routes/auth.js";
import vibeRouter from "./routes/vibes.js";
import commentRouter from "./routes/comments.js";

config();

const app = express();
app.use(express.json());

const PORT= process.env.PORT || 5050;
 
connectDB();
app.get('/',(req,res)=>{
    res.status(200).json({message:"OK"});
})
app.use(authRouter);
app.use(vibeRouter);
app.use(commentRouter);

app.listen(PORT, ()=>{
    console.log(`Server successfully running at <http://localhost:${PORT}>`)
})