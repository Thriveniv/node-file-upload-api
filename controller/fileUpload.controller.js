const upload = require("../middleware/fileUpload");
const coverimg = require("../middleware/coverUpload");

const URL = "http://localhost:8888/get-cfiles/";
const fs = require("fs");
const crypto = require("crypto");

var MarkdownIt = require('markdown-it');
var md = new MarkdownIt();
const json2md = require("json2md")
let posts=[];


const uploadFile = async (req, res) => {
  try {
    await upload(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }

    res.status(200).send({
      message: "File uploaded successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};
//to upload Cover image
const coverImage = async (req, res) => {
  try {
    await coverimg(req, res);

    if (req.file == undefined) {
      return res.status(400).send({ message: "Choose a file to upload" });
    }

    res.status(200).send({
      message: "File uploaded successfully: " + req.file.originalname,
    });
  } catch (err) {
    console.log(err);

    if (err.code == "LIMIT_FILE_SIZE") {
      return res.status(500).send({
        message: "File size should be less than 5MB",
      });
    }

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};
//
const createMd = async (req, res) => {
  try {
   // await createblog(req, res);
   const id = crypto.randomBytes(16).toString("hex");
   const path = __basedir + "/public/Uploads/"+id+"_"+req.query.username+".md";
  // const filetxt = req.body;
 // console.log(filetxt);
fs.writeFile(path, req.body, function writeJSON(err) {
  if (err) return console.log(err);
  console.log('writing to ' + path);
});
    res.status(200).send(
      {
        "fileuploaded":path,
        "post_id":id
      }
       );
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};
const updatePost = async (req, res) => {
  try {
   const fileid=req.query.id;
   const author=req.query.name;
   const path = __basedir + "/public/"+"blogs.json";
   const file = require(path);
   var found=false;

   for (let index in file.blogs) {
    if (file.blogs[index].post_id==fileid) {
      found=true;
      if(file.blogs[index].author_name == author ){
        file.blogs.splice(index,1)
        file.blogs.push(req.body);
      }
      else
      {
        res.status(501).send({
          "error":"un authorised access"
        })
      }
      
    }
   
  }
  if(!found){
    res.status(501).send({
      "error":"post is missing"
    })
  }
  

    if (req.body.post_id == null) {
      return res.status(400).send({ message: "blog is not formatted properly, ID is missing" });
    }
fs.writeFile(path, JSON.stringify(file,null,4), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(file.blogs.length);
  console.log('writing to ' + path);
});
    res.status(200).send(
      req.body
       );
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};
const createPost = async (req, res) => {
  try {
   // await createblog(req, res);
   const path = __basedir + "/public/"+"blogs.json";
   const file = require(path);
   file.blogs.push(req.body);
  console.log("base  directory is" + __basedir);

    if (req.body.post_id == null) {
      return res.status(400).send({ message: "blog is not formatted properly, ID is missing" });
    }
fs.writeFile(path, JSON.stringify(file,null,4), function writeJSON(err) {
  if (err) return console.log(err);
  console.log(file.blogs.length);
  console.log('writing to ' + path);
});
    res.status(200).send(
      req.body
       );
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: `Error occured: ${err}`,
    });
  }
};
const getFilesList = (req, res) => {
  const path = __basedir + "/public/uploads/";

  fs.readdir(path, function (err, files) {
    if (err) {
      res.status(500).send({
        message: "Files not found.",
      });
    }

    let filesList = [];

    files.forEach((file) => {
      filesList.push({
        name: file,
        url: URL + file,
      });
    });

    res.status(200).send(filesList);
  });
};

const downloadFiles = (req, res) => {
    const fileName = req.params.name;
    const path = __basedir + "/public/uploads/";
  
    res.download(path + fileName, (err) => {
      if (err) {
        res.status(500).send({
          message: "File can not be downloaded: " + err,
        });
      }
    });
};
const getPostContent = (req, res) => {
  const fileid = req.query.id;
  const path = __basedir + "/public/"+"blogs.json";
  const file = require(path);
  var postcontent;
 try{
  for (let index in file.blogs) {
    if (file.blogs[index].post_id==fileid) {
      postcontent = file.blogs[index]
    }
  }
 }
 catch(error){
res.status(400).send(
 {
  "id":"post not found"
 }
)
 }
 //console.log(postcontent);
 res.status(200).send(postcontent);

};
const getblogs = (req,res) =>{
  const author = req.query.name;
  const path = __basedir + "/public/blogs.json";
  const file = require(path);
  var postcontent=[];
  //var temp =JSON.parse(data);
  for (let index in file.blogs) {
    if (file.blogs[index].author_name==author) {
     // console.log(file.blogs[index].author_name)
      postcontent.push(file.blogs[index]);
    }
  }
    res.status(200).send(postcontent);

};

const deletePost = (req,res) =>{
  const path = __basedir + "/public/"+"blogs.json";
  const file = require(path);
  

var index = -1;

var filteredRes = file.blogs.find(function(item, i){
 if(item.post_id === req.query.id){
 index = i;
 return i;
 }
});

try{
if(index==-1)
{
res.send("failed to find the blog");
}
else{
  if(file.blogs[index].author_name == req.query.name )
 { file.blogs.splice(index,1)
  fs.writeFile(path, JSON.stringify(file,null,4), function writeJSON(err) {
    if (err) return console.log(err);
    console.log(file.blogs.length);
    console.log('writing to ' + path);
  });}
  else
  res.status(501).send({
    "erro":"un authorised access "
  })
  res.send({
    "id":"post deletd"
  });
}

}
catch(err){
console.log(err)
}

}
module.exports = { uploadFile, downloadFiles, getFilesList,coverImage,getPostContent,createPost,getblogs,deletePost,createMd,updatePost };
