var db = require('./db');

//get requests
this.getProjects = function(req, res, next) {
   var res_array=[];
   var projects = [];
   var super_array = [];
   var project ;
   var resUJson=[];
   var i=0;
	var email_id= req.body.email_id;
	var Tasks_JSON_array= JSON.stringify(" ");
	db.dmlQry('select user_id, tenant_id from Users where email_id = ?',email_id, function(error,result){
	    if(error){
	        console.log("Error" + error);
	        res.writeHead(500, {'Content-Type': "application/json"});
	        res.end(JSON.stringify({response:error}));
	    }
	    user_id=result[0].user_id;
	    tenant_id = result[0].tenant_id;
	    
	    db.dmlQry('select distinct(project_name) from Data_table where user_id = ?',user_id, function(error,result){
		    if(error){
		        console.log("Error" + error);
		        res.writeHead(500, {'Content-Type': "application/json"});
		        res.end(JSON.stringify({response:error}));
		    }
		   
		    for(var j=0;j<result.length;j++){
		    	projects[j]=result[j].project_name;
	    		console.log(projects[j]);
		    }
		    
		    for(var j=0;j<projects.length;j++)
	    	{
		    	//var kanban_query = "select task_id, task_name, start_date, end_date, r.record_id,extension_name, GROUP_CONCAT(if(r.extension_id = 7005, value, NULL)) AS 'Desc', GROUP_CONCAT(if(r.extension_id = 7006, value, NULL)) AS 'Task_Type', GROUP_CONCAT(if(r.extension_id = 7007, value, NULL)) AS 'Assignee', GROUP_CONCAT(if(r.extension_id = 7008, value, NULL)) AS 'Status', GROUP_CONCAT(if(r.extension_id = 7009, value, NULL)) AS 'Priority' from Data_table d join record r ON d.record_id = r.record_id join Meta_data md ON md.extension_id = r.extension_id where project_name = ? group by task_id";
		    	k=0;
		    	project=projects[j];
		    	console.log("project + "+project);
		    	var count =0;
		    	db.dmlQry('select project_name,task_id, task_name, start_date, end_date, GROUP_CONCAT(if(r.extension_id = 7005, value, NULL)) AS "Desc", GROUP_CONCAT(if(r.extension_id = 7006, value, NULL)) AS "Task_Type", GROUP_CONCAT(if(r.extension_id = 7007, value, NULL)) AS "Assignee", GROUP_CONCAT(if(r.extension_id = 7008, value, NULL)) AS "Status", GROUP_CONCAT(if(r.extension_id = 7009, value, NULL)) AS "Priority" from Data_table d join record r ON d.record_id = r.record_id join Meta_data md ON md.extension_id = r.extension_id where project_name = ? group by task_id',project, function(error,result){
		 		    count++;
		    		if(error){
		 		        console.log("Error" + error);
		 		        res.writeHead(500, {'Content-Type': "application/json"});
		 		        res.end(JSON.stringify({response:error}));
		 		    }
		 		    
		 		    else{
			 		    console.log("What is the result of Query");
			 		    
			 		    console.log(result);   
			 		    var tempProjects = {};
			 		    tempProjects[result[0].project_name]=  result; 
			 		    resUJson.push(tempProjects);
			 		    if(count==projects.length){
			 			    console.log("Final Output Json");
			 			    console.log();
			 			    var finalJson =JSON.stringify(resUJson); 
			 			    res.writeHead(200, {'Content-Type': "application/json"});
						    res.end(finalJson);
				  
			 		    }
		 		    }
		 		    
		 		});
	    	}
		    
	});
	   });
 }



 
//put

this.editTask = function(req, res, next) {
    db.dmlQry('insert into registration set ?',registration, function(error,result){
    if(error){
        console.log("Error" + error);
        res.writeHead(500, {'Content-Type': "application/json"});
        res.end(JSON.stringify({response:error}));
    }
    else{
         res.writeHead(200, {'Content-Type': "application/json"});
         res.end(JSON.stringify({response:'Saved to MySQL'}));
    }  

    return res.render('userProfile',{'firstName':user.firstName,'lastName': user.lastName,'EmailAddress': user._id,'WhatILike': user.whatilike,'Distance':user.Distance});
        
	});

 }

 //post

this.createTask = function(req, res, next) {
   var email_id= req.body.email_id;
   var user_id;
   var tenant_id;
   var record_id;
   console.log(email_id);
  db.dmlQry('select user_id, tenant_id from Users where email_id = ?',email_id, function(error,result){
    if(error){
        console.log("Error" + error);
        res.writeHead(500, {'Content-Type': "application/json"});
        res.end(JSON.stringify({response:error}));
    }
    user_id=result[0].user_id;
    tenant_id = result[0].tenant_id;
    var task_id= Math.floor(Math.random() * (100000 - 1) + 1);
    console.log(task_id);
    
     var record_id;
    var desc_extid=-1;
    var tasktype_extid=-1;
    var status_extid=-1;
    var pri_extid=-1;
    var assignee_extid=-1;
    var Data_Table_Object={
    	    "tenant_id": tenant_id,
    	    "user_id":user_id,
    	    "project_name":req.body.project_name,
    	    "task_id":task_id,
    	    "task_name":req.body.task_name,
    	    "start_date": req.body.start_date,
    	    "end_date":req.body.end_date
    	    }
    
    db.dmlQry('insert into Data_Table set ?',Data_Table_Object, function(error,result){
    if(error){
        console.log("Error" + error);
        res.writeHead(500, {'Content-Type': "application/json"});
        res.end(JSON.stringify({response:error}));
    }
    else{
         res.writeHead(200, {'Content-Type': "application/json"});
         res.end(JSON.stringify({response:'Saved to MySQL'}));
    }   
    db.dmlQry('select record_id from Data_Table where task_id = ?',task_id, function(error,result){
        if(error){
            console.log("Error" + error);
            res.writeHead(500, {'Content-Type': "application/json"});
            res.end(JSON.stringify({response:error}));
        }
        console.log(result[0].record_id); // print record_id
        record_id= result[0].record_id;
        console.log("record_id   "+record_id)
    });
    
    for(var key in req.body){
    	if(req.body.hasOwnProperty(key)){
    		if(key=="Desc")
    			{
    			console.log("Desc log query");
    			db.dmlQry('select extension_id from meta_data where extension_name =?',key, function(error,result){
    			    if(error){
    			        console.log("Error" + error);
    			        res.writeHead(500, {'Content-Type': "application/json"});
    			        res.end(JSON.stringify({response:error}));
    			    }
    			desc_extid= result[0].extension_id;
    			console.log(desc_extid); 
    			if(desc_extid!=-1){
    				var desc_JSON = {
    						"record_id": record_id,
    						"extension_id":desc_extid,
    						"value":req.body.Desc
    				}
    				console.log(desc_JSON);
    				
    				db.dmlQry('insert into record set ? ', desc_JSON, function(error, result) {
    					if(error){
    				        console.log("Error" + error);
    				        res.writeHead(500, {'Content-Type': "application/json"});
    				        res.end(JSON.stringify({response:error}));
    				    }
    				    
    				});
    			}
    			});
    	}
    		if(key=="Task_Type")
			{
    			db.dmlQry('select extension_id from meta_data where extension_name =?',key, function(error,result){
    			    if(error){
    			        console.log("Error" + error);
    			        res.writeHead(500, {'Content-Type': "application/json"});
    			        res.end(JSON.stringify({response:error}));
    			    }
    			tasktype_extid= result[0].extension_id;
    			console.log(tasktype_extid); 
    			
    			if(tasktype_extid!=-1){
    				var task_type_JSON = {
    						"record_id": record_id,
    						"extension_id":tasktype_extid,
    						"value":req.body.Task_Type
    				}
    				console.log(task_type_JSON);
    				
    				db.dmlQry('insert into record set ? ', task_type_JSON, function(error, result) {
    					if(error){
    				        console.log("Error" + error);
    				        res.writeHead(500, {'Content-Type': "application/json"});
    				        res.end(JSON.stringify({response:error}));
    				    }
    				    
    				});
    			}
    			});
    					
			
			}
    		if(key=="Status")
			{
    			console.log("status log query");
    			db.dmlQry('select extension_id from meta_data where extension_name =?',key, function(error,result){
    			    if(error){
    			        console.log("Error" + error);
    			        res.writeHead(500, {'Content-Type': "application/json"});
    			        res.end(JSON.stringify({response:error}));
    			    }
    			status_extid= result[0].extension_id;
    			console.log(status_extid); 
    			
    			if(status_extid!=-1){
    				var status_JSON = {
    						"record_id": record_id,
    						"extension_id":status_extid,
    						"value":req.body.Status
    				}
    				console.log(status_JSON);
    				
    				db.dmlQry('insert into record set ? ', status_JSON, function(error, result) {
    					if(error){
    				        console.log("Error" + error);
    				        res.writeHead(500, {'Content-Type': "application/json"});
    				        res.end(JSON.stringify({response:error}));
    				    }
    				    
    				});
    			}
    			});
    			
    			
			}
    		if(key=="Assignee")
			{
    			console.log("Assignee log query");
    			db.dmlQry('select extension_id from meta_data where extension_name =?',key, function(error,result){
    			    if(error){
    			        console.log("Error" + error);
    			        res.writeHead(500, {'Content-Type': "application/json"});
    			        res.end(JSON.stringify({response:error}));
    			    }
    			assignee_extid= result[0].extension_id;
    			console.log(assignee_extid); 
    			
    			if(assignee_extid!=-1){
    				var assignee_JSON = {
    						"record_id": record_id,
    						"extension_id":assignee_extid,
    						"value":req.body.Assignee
    				}
    				console.log(assignee_JSON);
    				
    				db.dmlQry('insert into record set ? ', assignee_JSON, function(error, result) {
    					if(error){
    				        console.log("Error" + error);
    				        res.writeHead(500, {'Content-Type': "application/json"});
    				        res.end(JSON.stringify({response:error}));
    				    }
    				    
    				});
    			}
    			});
    			
    			
			}
    		if(key=="Priority")
			{
    			console.log("Priority log query");
    			db.dmlQry('select extension_id from meta_data where extension_name =?',key, function(error,result){
    			    if(error){
    			        console.log("Error" + error);
    			        res.writeHead(500, {'Content-Type': "application/json"});
    			        res.end(JSON.stringify({response:error}));
    			    }
    			pri_extid= result[0].extension_id;
    			console.log(pri_extid); 
    			
    			if(pri_extid!=-1){
    				var pri_JSON = {
    						"record_id": record_id,
    						"extension_id":pri_extid,
    						"value":req.body.Priority
    				}
    				console.log(pri_JSON);
    				
    				db.dmlQry('insert into record set ? ', pri_JSON, function(error, result) {
    					if(error){
    				        console.log("Error" + error);
    				        res.writeHead(500, {'Content-Type': "application/json"});
    				        res.end(JSON.stringify({response:error}));
    				    }
    				    
    				});
    			}
    			});
    			
			}
    		
    	}
    }
    
  });
    });
       
 }

  this.createProject = function(req, res) {

    console.log("Hi");
    /*db.dmlQry('insert into registration set ?',registration, function(error,result){
    if(error){
        console.log("Error" + error);
        res.writeHead(500, {'Content-Type': "application/json"});
        res.end(JSON.stringify({response:error}));
    }
    else{
         res.writeHead(200, {'Content-Type': "application/json"});
         res.end(JSON.stringify({response:'Saved to MySQL'}));
    }  

    return res.render('userProfile',{'firstName':user.firstName,'lastName': user.lastName,'EmailAddress': user._id,'WhatILike': user.whatilike,'Distance':user.Distance});
        
    });*/
    console.log("Request"+ req.body);



 }
    