$( document ).ready(function() {
    
     Metis.formGeneral();
     var windowUrl = window.location.href;
	    var query = windowUrl.split("?");
	    var email_id ={
	      "email_id" : query[1]
     };
     
    //alert(JSON.stringify(email_id)); 
   $.ajax({
    	    type: "POST",
    	    url: "/getGantterProjects",
    	    dataType: 'json',
    	    data : email_id,
    	    async: false,
    	    crossDomain : true,
    	    success: function(o){
    	    var stringjson=JSON.stringify(o);
    	    for(var i=0;i<o.length;i++)
    	    {
    	      var test=o[i].projects;
    	      console.log("test print"+JSON.stringify(test));
    	     
    	      console.log(test[0].project_name);
    	      var data='<div class="col-lg-4">'+
                	'<div class="box">'+
                  	'<header>'+
                    	'<h5>'+test[0].project_name+'</h5>'+
                    	'<div class="toolbar">'+
                    	'<button id='+test[0].project_name+' class="btn btn-xs btn-success" onclick="viewstatus(this.id);">Status</button>'+
                      '<button id='+test[0].project_name+' class="btn btn-xs btn-primary" onclick="viewproject(this.id);">View</button>'+
                    	'</div>'+
                  	'</header>'+
              	'</div>'
		         $("#displayProjects").append(data);  
    	    }
    	    
    	    },
    	     error: function(response,text,err){
    	    	 alert(err);
    	 	 }
    });
});


function newProjectSubmit(){
 var data=$("#newProject").serializeArray();
 var windowUrl = window.location.href;
	var query = windowUrl.split("?");
	var email_id ={
	 name:"email_id",
 value : query[1]
};
data.push(email_id);

 var o = {};
   $.each(data, function() {
       if (o[this.name] !== undefined) {
           if (!o[this.name].push) {
               o[this.name] = [o[this.name]];
           }
           o[this.name].push(this.value || '');
       } else {
           o[this.name] = this.value || '';
       }
});

 alert(JSON.stringify(o));
   $.ajax({
    	    type: "POST",
    	    url: "/createGantterTask",
    	    dataType: 'json',
    	    data : o,
    	    async: false,
    	    crossDomain : true,
    	    success: function(data){
        $("#closemodel").click();
			       console.log("User added successfully");
    	   location.reload();
    	    },
    	     error: function(response,text,err){
    	    	 alert(err);
    	 	 }
    	   });
     
       
       
	}
function viewproject(id){
	console.log("you clicked on view of  project="+id);
	var windowUrl = window.location.href;
	var query = windowUrl.split("?");
	    
	window.open("/taskGantter.html?" + query[1] + "?" + id, "_self");
	
	}
	function viewstatus(id){
	console.log("you clicked on status of project="+id);
	
	}
	
	function navigateToDashboard()
	{
	 var windowUrl = window.location.href;
	 var query = windowUrl.split("?");
	 window.open("/dashboardGantter.html?" + query[1], "_self");
	 
	}