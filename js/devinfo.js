const serverLink="http://localhost:8080/distributor";
var currentURL = window.location.hostname;
var object,i=1;

var HttpClient = function() {
    this.get = function(aUrl, aParams, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
        if (!aParams.localeCompare("NULL")){
            anHttpRequest.open( "GET", aUrl, true );  
        }
        else{
            anHttpRequest.open( "GET", aUrl+':'+aParams, true );  
        }
                  
        anHttpRequest.send( null );
    }
}

var getDeviceList = function(){
    var client = new HttpClient();
    client.get(serverLink, "NULL" ,function(data){        
        var obj=JSON.parse(data);
        object=obj;
        $.each(obj,function() {
            var machine_type=this.device.machine_type;
            machine_type = machine_type.replace(/^\n|\n$/g, '');
            var row='<tr><td>'+i+'</td><td>'+machine_type+'</td><td>'+this.device.mac+'</td><td>'+this.device.wan_ip+'</td><td>'+this.device.created_at+'</td></tr>';
            $("#device-list-table tbody").append(row);
            $("#mac-select").append('<option>'+this.device.mac+'</option>');
            i++;
        });
    });
}



$(document).ready(function(){
    getDeviceList();
})

$("#send-multiple").on('click',function(){
    $("#command-area").val('');
})

$("#device-list-table").on("click", "tr",function(){
    var mac_td=this.cells[2];
    var mac = $(mac_td).text();
   /*  getDeviceDetails(mac); */
   
   window.location = "/details.html?"+mac;
});


