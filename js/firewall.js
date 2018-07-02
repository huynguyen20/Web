(function ($){
    var object,serverLink='http://10.71.1.75:8080/user/distributor';
    var currentLocation=document.location.toString();
    var mac=currentLocation.split("?")[1];

    var getFirewallDetails = function(devmac){
        $.ajax({
            url: serverLink+':'+devmac,
            data: {
                mac: devmac,
            },
            method: "GET",
            success: function(data){
                $("#device-name").html(data.device.machine_type);
                var tabledata="";
                var row="";
                for(var k in data.config_firewall){
                    if(k.indexOf("rule")!=-1){                        
                        row='<tr><td>'+data.config_firewall[k][0].name+'</td><td>'+data.config_firewall[k][0].src+'</td><td>'+data.config_firewall[k][0].dest_ip+':'+data.config_firewall[k][0].dest_port+'</td><td>'+data.config_firewall[k][0].icmp_type+'</td><td>'+data.config_firewall[k][0].family+'</td><td>'+data.config_firewall[k][0].target+'</td></tr>';
                        tabledata+=row;
                        console.log(data.config_firewall[k]);
                    }
                    
                }
                $("#rules-table tbody").html(tabledata);
            }
        })
    }

    $(document).ready(function(){
        $("#dhcp").attr("href","dhcpdetail.html?"+mac);
        $("#general").attr("href","devdetail.html?"+mac);
        $("#firewall").attr("href","firewalldetail.html?"+mac);
        getFirewallDetails(mac);
       
    })
}(jQuery))