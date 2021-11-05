const request=require("request");
const cheerio=require("cheerio");
const path=require("path");
const fs=require("fs");
const xlsx=require("xlsx");
// const url="https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard";
function processScorecard(url){
    request(url,cb);

}

function cb(err,response,html){
    if(err){
        console.log(err);
    }
    else{
        extractMatchDetails(html);

    }


}
function extractMatchDetails(html){
    //ipl ke andr team ka folder player file 
      //venue and date .match-header-info.match-info-MATCH .description
     let $=cheerio.load(html);
    //  let result=$(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span").text();
    //   console.log(result);
     let desc=$(" .match-header-info.match-info-MATCH .description").text();
    let stringArr= desc.split(",");
    let venue=stringArr[1].trim();
    let date=stringArr[2].trim();
    // console.log(venue);
    // console.log(date);
     let result=$(".match-info.match-info-MATCH.match-info-MATCH-half-width .status-text span").text();
    //  console.log(result);
     let innings=$(".card.content-block.match-scorecard-table>.Collapsible");
     let htmlString="";
     for(let i=0;i<=innings.length-1;i++){
        //   htmlString+=$(innings[i]).html();
        let teamName=$(innings[i]).find("h5").text();
        teamName=teamName.split("INNINGS")[0].trim();
        let opponentIndex=i==0?1:0;
        let opponentName=$(innings[opponentIndex]).find("h5").text();
        opponentName=opponentName.split("INNINGS")[0].trim();
         console.log(`${venue} ${date} ${teamName} ${opponentName} ${result}`)
       let cInning=$(innings[i]);
       let allRows=cInning.find(".table.batsman tbody tr ");
       for(let j=0;j<=allRows.length-1;j++){
           let allCols=$(allRows[j]).find("td");
           let isWorthy=$(allCols[0]).hasClass("batsman-cell");
           if(isWorthy==true){
               //if the player is worthy find the followings
               let playerName=$(allCols[0]).text().trim(); 
               let runs=$(allCols[2]).text().trim(); 
               let balls=$(allCols[3]).text().trim(); 
               let fours=$(allCols[5]).text().trim(); 
               let sixes=$(allCols[6]).text().trim(); 
               let sr=$(allCols[7]).text().trim(); 
               console.log(`${playerName} ${runs} ${balls} ${fours} ${sixes} ${sr}`);
                processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,result);

           }


       }
        
       }
       
}
    module.exports={
        ps:processScorecard
    }
function processPlayer(teamName,playerName,runs,balls,fours,sixes,sr,opponentName,venue,date,result){
   let teamPath=path.join(__dirname,"ipl",teamName);
   dirCreator(teamPath);
   let filePath=path.join(teamPath,playerName+".xlsx");
   let content=excelReader(filePath,playerName);
   let playerObj={
           teamName,
           playerName,
           runs,balls,fours,sixes,
           sr,
           opponentName,
           venue,date,
           result

   }
   content.push(playerObj);
   excelWriter(content,playerName,filePath);



}
function dirCreator(filePath){
    if(fs.existsSync(filePath)==false){
        fs.mkdirSync(filePath);
    }
}

function excelWriter(data,sheetName,filePath){
    //new workbook
 let newWb=xlsx.utils.book_new();
//json data to excel format
let newWS=xlsx.utils.json_to_sheet(data);
 //workbook ke andr worksheet add hogi ,sheet name
xlsx.utils.book_append_sheet(newWb,newWS,sheetName);
// //file path
xlsx.writeFile(newWb,filePath);
}


function excelReader(filePath,sheetName){
//workbook get
if(fs.existsSync(filePath)==false){
    return [];
}
let wb=xlsx.readFile(filePath);
//sheet get
let excelData=wb.Sheets[sheetName];
//sheet data get
let ans=xlsx.utils.sheet_to_json(excelData);
return ans;
}
