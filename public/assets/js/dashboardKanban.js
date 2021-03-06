$( document ).ready(function() {
     $("#divLoading").addClass('show');
     Metis.formGeneral();
     var windowUrl = window.location.href;
	    var query = windowUrl.split("?");
	    var email_id ={
	      "email_id" : query[1]
     };
     
    //alert(JSON.stringify(email_id)); 
    //console.log(o);
    
    $.ajax({
    	    type: "POST",
    	    url: "/getProjects",
    	    dataType: 'json',
    	    data : email_id,
    	    async: false,
    	    crossDomain : true,
    	    success: function(o){
    	    var stringjson=JSON.stringify(o);
    	    console.log("JSON-"+stringjson);
    	    for(var i=0;i<o.length;i++)
    	    {
    	     var test=o[i].projects;
    	     console.log("test print"+JSON.stringify(test));
    	    // alert("id" + test[0].project_name);
    		 var id = "displayStatus_"+test[0].project_name;
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
                  	 '<div id='+id + ' class="" style="display:none">'+
               			'<div id='+"test"+test[0].project_name+' class="col-md-5">'+
              			'</div>'+
              			'<div id='+"canvas-holder"+test[0].project_name+' class="col-md-7">'+
              				'<canvas id='+"chart-area"+test[0].project_name+' width="120" height="100"/>'+
              			'</div>'+
              		'</div>'+
              		'</div>'
              	'</div>'
		             $("#displayProjects").append(data);  
    	    }
    	    setTimeout( "$('#divLoading').removeClass('show');",1000 );
    	    
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
  // o["email_id"].push(query[1]);
  // var a = this.serializeArray();
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
   
   $.ajax({
    	    type: "POST",
    	    url: "/createTaskKanban",
    	    dataType: 'json',
    	    data : o,
    	    async: false,
    	    crossDomain : true,
    	    success: function(data){
    	    
		
            $("#closemodel").click();
			       console.log("User task successfully");
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
	  //  alert(id);
	window.open("/taskKanban.html?" + query[1] + "?" + id, "_self");
	
	
	}
	
function viewstatus(id){
	
    console.log("you clicked on status of project="+id);
    var windowUrl = window.location.href;
	var query = windowUrl.split("?");
    ///getQueue
    var reqData = {
        "email_id" : query[1],
        "project_name" : id
    };
    $.ajax({
	    type: "POST",
	    url: "/getQueue",
	    dataType: 'json',
	    data : reqData,
	    async: false,
	    crossDomain : true,
	    success: function(data){
	    	document.getElementById("displayStatus_" +id).style.display = "block";
	    	//alert("test"+id+" ul");
		    //$("test"+id).innerHTML('');
		    document.getElementById("test"+id).innerHTML = "";
		    var doneid = document.getElementById("test"+id );
		    console.log(JSON.stringify(data));
		      var pieData = [];
		      var color = 1;
		    for(var j=0;j<data.length;j++)
		    {
		    	var status = data[j].status;
		    	var data1 = '<h4> ' +status+ ' </h4>' + '<ul>';
		    	var taskArray = data[j].task_name;
		    	for(var i=0;i<taskArray.length;i++)
		    	{
		    			data1 += '<li>' + taskArray[i] + '</li>';
		    	}
		    	 data1+='</ul>';
			    
				$(doneid).append(data1);
				var b = color*60;
				pieData.push(	{
					value: taskArray.length,
					color:"hsla("+b+",100%,60%,0.75)",
					highlight: "hsla("+b+",100%,60%,0.5)",
					label: status
				});
				color ++;
		    }
	   		var chartid = "chart-area"+id;
			var ctx = document.getElementById(chartid).getContext("2d");
			window.myPie = new Chart(ctx).Pie(pieData);
	    
	    },
	     error: function(response,text,err){
	    	 alert(err);
	 	 }
	   });
	   
	   //$("#hiddenDiv").click();
	}
	
	function navigateToDashboard()
	{
	    var windowUrl = window.location.href;
	    var query = windowUrl.split("?");
	    window.open("/dashboardKanban.html?" + query[1], "_self");
	}