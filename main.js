const request=require("request");
const cheerio=require("cheerio");
const allMatchObject=require("./allmatch")
const fs=require("fs");
const path=require("path");
const iplPath=path.join(__dirname,"ipl");
dirCreator(iplPath);

const url="https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url,cb);
function cb(err,response,html){
    if(err){
        console.log(err);
    }
    else{
        extractLink(html);

    }


}
function extractLink(html){
    let $=cheerio.load(html);
    let anchorElem=$("a[data-hover='View All Results']");
    let link=anchorElem.attr("href");
    let fulllink="https://www.espncricinfo.com/"+link;
    //  console.log(fulllink);
     allMatchObject.gAlmatches(fulllink);
}
function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}
