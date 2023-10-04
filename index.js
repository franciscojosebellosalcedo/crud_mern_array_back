import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
dotenv.config();

const users = [];

const app = express();
app.use(express.json());

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({ message: "Mi API con express" });
});

const clearSpacesWhiteProperties=(data)=>{
  const keys=Object.keys(data);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if(typeof data[key]==="string"){
      data[key]=data[key].trim();
    }
  }
}

app.post("/create-user",(req,res)=>{
  try {
    const data=req.body;
    clearSpacesWhiteProperties(data);
    if(!data){
      return res.status(400).json({
        code:400,
        response:false,
        message:"Datos vacios"
      });
    }
    const {name,identity,phone}=data;
    if(name=== "" || identity=== "" || phone=== ""){
      return res.status(400).json({
        code:400,
        response:false,
        message:"Datos vacios"
      });
    }
    if(users.find((item)=>item.identity===data.identity)){
      return res.status(400).json({
        code:400,
        response:false,
        message:"Usuario ya existente"
      });
    }
    const afterLength=users.length;
    users.unshift(data);
    if(users.length > afterLength){
      return res.status(201).json({
        code:201,
        response:true,
        message:"Usuario creado"
      });
    }
    return res.status(201).json({
      code:201,
      response:false,
      message:"No se pudo crear el usuario"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      response: false,
      message: "Se produjo un error",
    });
  }
});

app.get("/get-all-users", (req, res) => {
  try {
    return res.status(200).json({
      code: 200,
      response: true,
      message:"Lista de usuarios",
      data: users,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code: 400,
      response: false,
      message: "Se produjo un error",
    });
  }
});

app.delete("/delete/:identity",(req,res)=>{
  try {
    const currentLength=users.length;
    const indexUser=users.indexOf(users.find((user)=>user.identity===req.params.identity));
    if(indexUser===-1){
      return res.status(404).json({
        code : 404 ,
        message:"Usuario no existente",
        response:false
      })
    }
    users.splice(indexUser,1);
    if(users.length > currentLength){
      return res.status(400).json({
        code:400,
        response : false,
        message :"Error al eliminar usuario"
      });
    }
    return res.status(200).json({
      code:200,
      response : true,
      message :"Usuario eliminado",
      index:indexUser
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      code:400,
      response : false,
      message :"Error al eliminar usuario"
    });
  }
});

app.put("/edit/:identity",(req,res)=>{
  try {
    const identityUser=req.params.identity;
    const userDataEdit = req.body;
    const {name,identity,phone}=userDataEdit;
    if(name=== "" || identity=== "" || phone=== ""){
      return res.status(400).json({
        code:400,
        response:false,
        message:"Datos vacios"
      });
    }
    const userIndex=users.findIndex((user)=>user.identity === identityUser );
    if (userIndex===-1) {
      return res.status(404).json({
        code:404,
        message:"Usuario no encontrado",
        response:false
      })
    }
    console.log(userIndex);
    users[userIndex].name=userDataEdit.name;
    users[userIndex].phone=userDataEdit.phone;
    return res.status(200).json({
      code:200,
      message:"Usuario editado",
      response:true
    })
  } catch (error) {
    console.log(error);
    return res.status().json({
      code:400,
      message:"Error al editar el usuario",
      response:false
    })
  }
});


app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
