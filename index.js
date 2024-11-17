import express from "express";
import bodyParser from "body-parser";
import pg from "pg"

const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"todo",
  password:"Pratham@9532"
})

db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
async function everyItem() {
  const all=await db.query("select * from items");
  return all.rows;
}

app.get("/",async (req, res) => {
  const allItem=await everyItem();
  res.render("index.ejs", {
    listTitle: "To-Do List",
    listItems: allItem,
  });
});

app.post("/add",async (req, res) => {
  const item = req.body.newItem;
 await db.query("insert into items (title) values($1)",[item]);
 const allItems=await everyItem();
 console.log(allItems);
 res.redirect("/");
  // res.render("index.ejs",{listTitle:"Today",listItems:});
});

app.post("/edit", (req, res) => {

  const idOfTodo=req.body.updatedItemId;
  const editedTask=req.body.updatedItemTitle;
  db.query("update items set title=$1 where id=$2",[editedTask,idOfTodo]);
  res.redirect("/");

});

app.post("/delete", (req, res) => {

  const deleteItemId=req.body.deleteItemId;
  db.query("delete from items where id=$1",[deleteItemId]);
  // const indextoDelete=items.findIndex(index=>index.id==deleteItemId);
  // if(indextoDelete!==-1) 
  // {
  //     items.splice(indextoDelete,1);    
  // }
  
  // console.log(deleteItemId);
  // db.query("delete from items where id=$1",[deleteItemId])
res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
