const mongoose = require('mongoose')
const connectionString = process.env.MONGODB_URI


mongoose.connect(connectionString).then(res=>{
    console.log("database conncted successfully");
    
}).catch(error=>{
    console.log("connection faild");
    console.log(error);
    
    
})