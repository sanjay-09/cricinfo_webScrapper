const request=require("request");
const cheerio=require("cheerio");
const Scoreob=require("./scorecard.js")
function getAllMatchesLink(fulllink){
    request(fulllink,function(err,response,html){
        if(err){
            console.log(err);

        }
        else{
            extractAllLink(html);
        }
    })
}
function extractAllLink(html){
    let $=cheerio.load(html);
    let scorecardElems=$("a[data-hover='Scorecard']");
    for(let i=0;i<=scorecardElems.length-1;i++){
             let link= $(scorecardElems[i]).attr("href");
             let fulllink="https://www.espncricinfo.com/"+link;
             Scoreob.ps(fulllink);
    }

}
module.exports={
    gAlmatches:getAllMatchesLink
}