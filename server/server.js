const express = require("express");
const cors = require('cors');
const app = express();
const pg = require("pg");

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Notedown",
    password: "swaps",
    port: 5432,
});

db.connect();

const port = 3000;

app.use(express.json());

app.use(cors());

app.options('/Notedown/add', cors());


app.get("/", function(req, res){
    // console.log(request);
    res.send("<h1>Notedown<h1>");
})

app.get("/Notedown/notes", async (req, res)=>{
    // console.log(request);
    try{
        const result = await db.query("SELECT * FROM note"); 
        res.json(result.rows);

    }
    catch(err){
        return console.error(err);
    }
});

app.delete('/Notedown/delete/:id',(req,res)=>{
    const id= req.params.id;
    db.query('DELETE FROM note WHERE id=$1',[id],(err,result)=>{
        if(err) console.log(err);
        res.status(200).send('Note deleted');
    });
});

app.post('/Notedown/add',async (req,res)=>{

   try{
    const {title, content} = req.body;
    await db.query('INSERT INTO note (title, ncontent) VALUES ($1, $2)',[title,content]);
    res.status(201).send(`Added a new note`);
   } 
   catch(err){
    console.log(err);
   }

})

app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  });

app.listen(port,()=>{
    console.log("server started at port: 3000");
});