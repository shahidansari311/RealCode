import express from 'express'
import {createServer} from 'http'
import { Server } from 'socket.io'
import {YSocketIO} from 'y-socket.io/dist/server'

const app=express();
const httpServer=createServer(app);
const PORT=process.env.PORT || 4000;

// IO setup for real time fetch 
const io=new Server(httpServer,{
    cors:{
        origin:"*",
        methods:["GET","POST"]
    }
})

// YJS setup for CRDT 
const ySocketIO=new YSocketIO(io);
ySocketIO.initialize();


// default route 
app.get('/',(req,res)=>{
    res.status(200).json({
        message:"Hello World",
        success:true
    })
})


// Health check route 
app.get('/health',(req,res)=>{
    res.status(200).json({
        message:"ok",
        success:true
    })
})

// Server running status 
httpServer.listen(prompt, ()=>{
    console.log(`Server running on port ${PORT}`);
})