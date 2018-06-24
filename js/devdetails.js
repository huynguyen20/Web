var coll = document.getElementsByClassName("collapsible");
var i;
var object;
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




var getDeviceDetails = function(mac){
    var client = new HttpClient();
    client.get(serverLink,mac,function(data){
        var obj=JSON.parse(data);
        object=obj;
        console.log(obj);
        $("#dmac-td").html(obj.device.mac);
        $("#dname-td").html(obj.device.machine_type);
        $("#dfirm-td").html(obj.device.firmware);
        $("#dmem-td").html(obj.device.free_ram+"/"+obj.device.total_ram);
        $.each(obj.dhcp,function(){
            $("#dhcp-panel").append('<button class="collapsible">'+ this.ip+'</button><div class="content"><p>MAC: '+this.mac+'</p><p>Name: '+this.name+'</p></div>');
        })
        $.each(obj.splash,function(){
            if(this.auth_state=="pass"){
                $("#splash-panel").append('<button class="collapsible">'+ this.ip+'</button><div class="content"><p>MAC: '+this.mac+'</p></div>');
            }            
        })
        $.each(obj.stations, function(){
            var tr='<tr><td>'+this.interface+'</td><td>'+this.ssid+'</td><td>'+this.mac+'</td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#myModal">Edit</button></td></tr>';
            $("#stations-table tbody").append(tr);
        }) 

    })

}
$(document).on('click', ".collapsible", function(){
    this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
});

$("#stations-table tbody").on('click','button',function(){
  //  $("#modal-bod").empty();
    var col,txt;
    mac = $(this).parent().siblings("td").next().next().html();
    $.each(object.stations,function(){
        if (this.mac==mac){
            $("#modal-if").val(this.interface);
            $("#modal-if").prop("readonly",true);
            $("#modal-ssid").val(this.ssid);
            $("#modal-mac").val(this.mac);
            $("#modal-mac").prop("readonly",true);
            $("#modal-rx-pkt").html(this.rx_packets);
            $("#modal-tx-pkt").html(this.tx_packets);
            $("#modal-rx-bytes").html(this.rx_bytes);
            $("#modal-tx-bytes").html(this.tx_bytes);


        }
    })

})


$(document).ready(function(){
    var currentLocation=document.location.toString();
    var mac=currentLocation.split("?")[1];
    getDeviceDetails(mac);
})