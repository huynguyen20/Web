(function ($) {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    var object,serverLink='http://10.71.1.75:8080/user/distributor';
    var currentLocation=document.location.toString();
    var mac=currentLocation.split("?")[1];

    var getDHCP = function(devmac){
        $.ajax({
            url: serverLink+':'+devmac,
            data: {
                mac: devmac,
            },
            method: "GET",
            success: function(data){
                object=data;
                var options="";
                options+='<option value="lan">lan</option><option value="wlan">wlan</option>';
                $("#network").html(options);
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


    $("#dhcp-form").on('submit', function(){
        $("#mac").val(mac);

    })
    window.setInterval(function(){
        
        getDHCP(mac);
    }, 15000);
    $(document).ready(function(){
        var currentLocation=document.location.toString();
        var mac=currentLocation.split("?")[1];
        getDHCP(mac);
        $("#dhcp").attr("href","dhcpdetail.html?"+mac);
        $("#general").attr("href","devdetail.html?"+mac);
        $("#firewall").attr("href","firewalldetail.html?"+mac);

    })
    $("#network").on('change', function(){
        if (this.value=="wlan"){
            $("#dhcp-start").val(object.config_dhcp.wlan[0].start);
            $("#dhcp-limit").val(object.config_dhcp.wlan[0].limit);
            $("#dhcp-time").val(object.config_dhcp.wlan[0].leasetime);
            $("#dhcp-int").html(object.config_dhcp.wlan[0].interface);
        }
        if (this.value=="lan"){
            $("#dhcp-start").val(object.config_dhcp.lan[0].start);
            $("#dhcp-limit").val(object.config_dhcp.lan[0].limit);
            $("#dhcp-time").val(object.config_dhcp.lan[0].leasetime);
            $("#dhcp-int").html(object.config_dhcp.lan[0].interface);
        }
    })
}(jQuery))
