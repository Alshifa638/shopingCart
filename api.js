let express=require("express");
let app=express();
app.use(express.json());
app.use(function (req,res,next){
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Orihgin, X-Requested-With, Content-Type, Accept"

    );
    next();
});
var port=process.env.PORT || 2410;
app.listen(port,()=>console.log(`Listening on port ${port}!`));


const {Client}=require("pg");
const client=new Client({
    user : "postgres",
    password : "Sameem@1231231",
    database : "postgres",
    port:5432,
    host : "db.itxplwceqtnpqyifanqm.supabase.co",
    ssl:{ rejectUnauthorized: false},
});
 client.connect(function(res, error){
        console.log(`Connected!!!`);
    });


app.get("/products/:category?",function(req,res,next){
  let category=req.params.category;
  let options="";
  let optionArr=[];
  if(category){
    options=`WHERE category=$1`;
    optionArr.push(`${category}`);
  }
  let sql=`SELECT * FROM shop ${options}`;
  client.query(sql,optionArr,function(err,result){
      if(err) {res.status(404).send(err);
      console.log(err)}
      else  {
          res.send(result.rows);
      }
  });
});

app.get("/product/:id",function(req,res,next){
    let id=+req.params.id;
    let sql=`SELECT * FROM shop WHERE id=${id}`;
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);}
        else if(result.length===0) { res.status(404).send("No data found");}
             else 
             {
                res.send(result.rows[0])
            };
    })
 });

 app.post("/products",function(req,res,next){
    let values=Object.values(req.body);
    let sql=`INSERT INTO shop (name,description,price,imgLink,category) VALUES($1,$2,$3,$4,$5)`;
    client.query(sql,values,function(err,result){
        if(err){ console.log(err)
            res.status(404).send(err);}
        else{
            res.send(`POST SUCCESS..NUM OF ROWS IS POST ${result.rowCount}`);
    }
    })
});

app.put("/product/:id", function(req,res,next){
    let id=+req.params.id;
    let values=Object.values(req.body);
    console.log(values)
    let sql=`UPDATE shop SET  id=$1,name=$2,description=$3,imgLink=$4,category=$5,price=$6 WHERE id=${id}`;
    client.query(sql,values,function(err,result){
        if(err) {
        res.status(404).send(err)
        console.log(err)}
         else{ res.send("Update success")}
    })
 })
 app.delete("/product/:id", function(req,res,next){
    let id=req.params.id;
   
    let sql=`DELETE FROM shop WHERE id=${id}`;
   
    client.query(sql,function(err,result){
        if(err) res.status(404).send("Error in deleting data");
        else if (result.affectedRows===0) res.status(404).send("No  delete happened");
         else res.send("delete success")
    })
 })

app.get("/orders",function(req,res,next){
    let sql=`SELECT * FROM orders`;
    client.query(sql,function(err,result){
        if(err) {res.status(404).send(err);}
             else 
             {
                res.send(result.rows)
            };
    })
 });

app.post("/orders",function(req,res,next){
    let values=Object.values(req.body);
    console.log(values)
    let sql=`INSERT INTO orders (name,address1,address2,city,email,totalPrice,items) VALUES($1,$2,$3,$4,$5,$6,$7)`;
    client.query(sql,values,function(err,result){
        if(err){ console.log(err)
            res.status(404).send(err);}
        else{
            res.send(`POST SUCCESS..NUM OF ROWS IS POST ${result.rowCount}`);
    }
    })
});
app.post("/login", function(req, res) {
    let values=Object.values(req.body);
    let sql=`SELECT * FROM users WHERE  email=$1 AND password=$2`;
    client.query(sql,values,function(err,result){
        if(err){ 
            res.status(404).send(err);
        }
       else if(result.rows.length===0) {  res.status(401).send("not found");}
        else{
            console.log(result)
            res.send(result.rows[0]);
    }
  })
});

app.post("/register",function(req,res,next){
    let values=Object.values(req.body);
   console.log(values)
    let sql=`INSERT INTO users(email,password) VALUES($1,$2)`;
    client.query(sql,values,function(err,result){
        if(err){ res.status(404).send(err);}
        else{
            console.log(result)
            res.send({email:req.body.email,password:req.body.password});
    }
    })
})