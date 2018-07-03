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
                var zonedata="";
                var forwarddata="";

                var row="";
                for(var k in data.config_firewall){
                    if(k.indexOf("rule")!=-1){                        
                        row='<tr><td>'+data.config_firewall[k][0].name+'</td><td>'+'From '+"<span style=\"color:blue\">"+(typeof data.config_firewall[k][0].src_ip=="undefined"?"any":data.config_firewall[k][0].src_ip)+"</span>"+" in "+"<span style=\"color:blue\">"+data.config_firewall[k][0].src+"</span>"+'</td><td>'+"To "+"<span style=\"color:blue\">"+(typeof data.config_firewall[k][0].dest_ip=="undefined"?"any ":data.config_firewall[k][0].dest_ip)+(typeof data.config_firewall[k][0].dest_port=="undefined"?"":"at port "+data.config_firewall[k][0].dest_port)+"</span>"+ " in "+"<span style=\"color:blue\">"+(typeof data.config_firewall[k][0].dest=="undefined"?"this device":data.config_firewall[k][0].dest)+"</span>"+'</td><td>'+(typeof data.config_firewall[k][0].icmp_type=="undefined"?"No":("\'"+data.config_firewall[k][0].icmp_type)+"\'")+'</td><td>'+((typeof data.config_firewall[k][0].family=="undefined")?"all":data.config_firewall[k][0].family)+'</td><td>'+data.config_firewall[k][0].target+'</td></tr>';
                        tabledata+=row;
                    }
                    else if(k.indexOf("zone")!=-1){
                        row='<tr><td>'+data.config_firewall[k][0].name+'</td><td>'+data.config_firewall[k][0].input+'</td><td>'+data.config_firewall[k][0].output+'</td><td>'+data.config_firewall[k][0].forward+'</td><td>'+data.config_firewall[k][0].network+'</td></tr>';
                        zonedata+=row;
                        var forwarding="";
                        for(var l in data.config_firewall){

                            if(l.indexOf("forwarding")!=-1){
                                //alert(k+":"+data.config_firewall[k][0].name+"______"+l+":"+data.config_firewall[l][0].src);
                                if(data.config_firewall[l][0].src==data.config_firewall[k][0].name){
                                    forwarding=forwarding+ (data.config_firewall[l][0].dest + " ");
                                    //alert(forwarding);
                                }
                            }
                        }
                        var irow='<tr><td>'+data.config_firewall[k][0].name+'</td><td>'+forwarding+'</td></tr>';
                        forwarddata+=irow;
                    }
                }
                $("#rules-table tbody").html(tabledata);
                $("#zone-table tbody").html(zonedata);
                $("#forward-table tbody").html(forwarddata);

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