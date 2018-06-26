var coll = document.getElementsByClassName("collapsible");
var i;
var object;

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
        $.each(obj.ssids, function(){
            var tr='<tr><td>'+this.interface+'</td><td>'+this.ssid+'</td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#ssid-modal">Edit</button></td></tr>';
            $("#ssids-table tbody").append(tr);
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

$("#ssids-table tbody").on('click','button',function(){
  //  $("#modal-bod").empty();
    var col,txt;
    dinterface = $(this).parent().siblings("td").html();
    console.log(dinterface);
    $.each(object.ssids,function(){
        if (this.interface==dinterface){
            $("#modal-interface").val(this.interface);
            $("#modal-channel").val(this.channel);
            $("#modal-ssid").val(this.ssid);
            if(this.bssid){
                $("#modal-bssid").val(this.bssid);
            }
        }
        
    })

})

$("#modal-bod input").on('change', function(){
    console.log("Changed");
    $(this).addClass('changed');
})

$("#myform").on('submit', function(){
    $('input:not(.changed)').prop('disabled',true);
    $('#modal-interface').prop('disabled',false);
})

$(document).ready(function(){
    var currentLocation=document.location.toString();
    var mac=currentLocation.split("?")[1];
    getDeviceDetails(mac);
})