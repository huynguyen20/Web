(function ($) {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    var object,serverLink='http://10.71.1.75:8080/user/distributor';

    var getDHCP = function(devmac){
        $.ajax({
            url: serverLink+':'+devmac,
            data: {
                mac: devmac,
            },
            method: "GET",
            success: function(data){
                object=data;
                $("#device-name").html(data.device.machine_type);
                $("#dhcp-start").val(data.config_dhcp.lan[0].start);
                $("#dhcp-limit").val(data.config_dhcp.lan[0].limit);
                $("#dhcp-time").val(data.config_dhcp.lan[0].leasetime);
                $("#dhcp-int").html(data.config_dhcp.lan[0].interface);
                var dhcpdata="";
                $.each(data.dhcp,function(){
                    var tr = '<tr><td>' + this.ip + '</td><td>' + this.mac + '</td><td>' + this.name + '</td></tr>';
                    dhcpdata=dhcpdata+tr;
                    $("#dhcp-table tbody").html(dhcpdata);
                })
                $.each(data.splash,function(){
                    if(this.auth_state=="pass"){
                        $("#splash-panel").append('<button class="collapse">'+ this.ip+'</button><div class="content"><p>MAC: '+this.mac+'</p></div>');
                    }
                })
            }
        })
    }



    $("#modal-bod input").on('change', function(){
        $(this).addClass('changed');
    })

    $("#myform").on('submit', function(){
        alert("abc");
        $('input:not(.changed)').prop('disabled',true);
        $('#interface').prop('disabled',false);
    })
    window.setInterval(function(){
        var currentLocation=document.location.toString();
        var mac=currentLocation.split("?")[1];
        getDHCP(mac);
    }, 15000);
    $(document).ready(function(){
        var currentLocation=document.location.toString();
        var mac=currentLocation.split("?")[1];
        getDHCP(mac);
        $("#wireless").attr("href","devdetail.html?"+mac);

    })
}(jQuery))