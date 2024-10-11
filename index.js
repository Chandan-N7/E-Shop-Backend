const express = require ('express');
const dotenv = require('dotenv')
const mongoose = require('mongoose');
const cookiesParser = require('cookie-parser')
const cors = require('cors');
const router = require('./Router/router');


dotenv.config();

const app = express();
const port = process.env.PORT || 3000 ;
const db = process.env.DB;

app.use(cors({
    origin: [process.env.CLIENTSIDE_URL],
    credentials:true
}));

app.use(cookiesParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); 

app.use('/api',router)


const server = app.listen(port,()=>{
    console.log(`Server running at http://localhost:${port}`)
})


mongoose.connect(db).then(()=>{
    console.log("DataBase Connection Successfull")
}).catch(err=>console.log(`Database Connection Error: ${err.message} ${ db}`))
