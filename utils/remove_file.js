
const  fs = require('fs');
const path = require('path');
function removeFile(fileName){
    const paths = path.join(__dirname, '../public/'+ fileName);
    fs.unlink(paths,function(err){
             if(err) return console.log(err);
             console.log('file deleted successfully');
    });  
   
}

module.exports = removeFile;