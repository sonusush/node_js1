var MongoClient=require('mongodb').MongoClient;
var url="mongodb://127.0.0.1:27017/";
var http=require("http");
var qs=require("querystring");

http.createServer(function(req,res){
    if(req.method=="GET")
    {
        res.end(` <!DOCTYPE html>
        <html>
        <head>
        <title>Employee Details</title>
        </head>
        <body>
        <form action="/" method="post">
        <label>EmployeeId</label>
        <input type="text" id="Eid" name="_id" required/>
        <label>EmployeeName</label>
        <input type="text" id="Name" name="Ename" required/>
        <label>BasicPay</label>
        <input type="text" id="Pay" name="BasicPay" required/>
        <label>NetPay</label>
        <input type="text" id="NPay" name="NetPay" readonly/>
        <button>Send</button>

</form>
 </body>  
</html>`)
    }
    else if(req.method=="POST")
    {
        var body="";
         req.on("data",function(chunk){
            body+=chunk;
            console.log("data");
        });
        req.on("end",function(){
      var obj=qs.parse(body);
     // console.log(obj);
      EmployeeId=obj._id;
      Ename=obj.Ename.toString();

      BasicPay=parseFloat(obj.BasicPay);
      GrossPay=calculateGrossPay(BasicPay);
      NetPay=calculateNetPay(GrossPay);
     // res.end("NetPay="+NetPay.toString());

      
     
     // var objString=JSON.stringify(obj);
      res.writeHead(200,{"Content-Type":"text/html"});
       res.end(`
               <!DOCTYPE html>
               <html>
               <head>
               <title>Form Results</title>
               </head>
               <body>
                <h1>EmployeeDetails</h1>
                <form action="/" method="post">
                <label>EmployeeId</label>
               <input type="text" id="Eid" name="_id" 
                placeholder=${EmployeeId} required/>
                <label>EmployeeName</label>
                <input type="text" id="Name" name="Ename"
                placeholder=${Ename} required />
                <label>BaiscPay</label>
                <input type="text" id="Pay" name="BasicPay"
                placeholder=${BasicPay} required />
                <label>NetPay</label>
                <input type="text" id="Npay" name="NetPay"
                placeholder=${NetPay} required readonly />
                <button>Send</button>
                
                </body>
                </html>
                `);
                MongoClient.connect(url, function(err, db){
                  if (err) throw err;
                  var dbo = db.db("sample");
                  var a={_id:EmployeeId, EmployeeName:Ename,BasicPay:BasicPay,NetPay:NetPay};
                  dbo.collection("employeeDetails").insert(a, function(err) {
                      if (err) throw err;
                      console.log(" record inserted");
                      
                      db.close();
                  })
                  });
              
                  });
                  
                }
                  }).listen(3000);
              console.log("form server listening on port 3000");

function calculateGrossPay(num)
{
    if(num>50000)
    HRA=((40/100)*num);
    else
    HRA=((30/100)*num);
    return num+HRA;
}

function calculateNetPay(num1)
{ 
   var deduction=1000;

    return( num1-deduction);
} 