(function ($) {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    var object,serverLink='http://10.71.1.75:8080/user/distributor';
    var currentLocation=document.location.toString();
    var mac=currentLocation.split("?")[1];
    var getDeviceDetails = function(devmac){
        $.ajax({
            url: serverLink+':'+devmac,
            data: {
                mac: devmac,
            },
            method: "GET",
            success: function(data){
                object=data;
                $("#device-name").html(data.device.machine_type);
                $("#dmac-td").html(data.device.mac);
                $("#dname-td").html(data.device.machine_type);
                $("#dfirm-td").html(data.device.firmware);
                $("#dmem-td").html(Math.floor(data.device.free_ram/1000)+" kB / "+Math.floor(data.device.total_ram/1000)+" kB");
                $("#dtx-td").html(data.device.tx_bytes+" Bytes");
                $("#drx-td").html(data.device.rx_bytes+" Bytes");
                $("#dload-td").html(data.device.load_1.toFixed(2)+", "+data.device.load_5.toFixed(2)+", "+data.device.load_15.toFixed(2));
                $("#ddevice-td").html(data.device.connected);
                var lasttime = new Date(1000*data.device.created_at);
                $("#dtime-td").html(lasttime.toLocaleString());
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
/*                $.each(data.ssids, function(){
                    if(this.signal==null){
                        var tr = '<tr><td>' + this.interface + '</td><td>' + this.ssid + '</td><td>' + this.channel + '</td><td>' + this.signal + '</td><td>' + this.tx_power + '</td><td><span class="badge badge-danger">OFF</span></td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#ssid-modal">Edit</button></td></tr>';
                        $("#ssids-table tbody").append(tr);
                    }
                    else {
                        var tr = '<tr><td>' + this.interface + '</td><td>' + this.ssid + '</td><td>' + this.channel + '</td><td>' + this.signal + '</td><td>' + this.tx_power + '</td><td><span class="badge badge-success">ON</span></td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#ssid-modal">Edit</button></td></tr>';
                        $("#ssids-table tbody").append(tr);
                    }
                })*/
                var ap_data ='';
                if(data.config_wireless.default_radio0[0].disabled=="1"){
                    var tr = '<tr><td>' + data.config_wireless.default_radio0[0].device + '</td><td>' + data.config_wireless.default_radio0[0].ssid + '</td><td>' + data.config_wireless.radio0[0].channel + '</td><td>' + data.config_wireless.radio0[0].hwmode + '</td><td>' +data.config_wireless.radio0[0].htmode + '</td><td><span class="badge badge-danger">OFF</span></td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#ssid-modal">Edit</button></td></tr>';
                    ap_data=ap_data+tr;
                    //$("#ssids-table tbody").append(tr);
                }
                else{
                    var tr = '<tr><td>' + data.config_wireless.default_radio0[0].device + '</td><td>' + data.config_wireless.default_radio0[0].ssid + '</td><td>' + data.config_wireless.radio0[0].channel + '</td><td>' + data.config_wireless.radio0[0].hwmode + '</td><td>' +data.config_wireless.radio0[0].htmode + '</td><td><span class="badge badge-success">ON</span></td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#ssid-modal">Edit</button></td></tr>';
                    ap_data=ap_data+tr;
                    //$("#ssids-table tbody").append(tr);
                }
                //alert(data.config_wireless.default_radio1[0].disabled);
                if(data.config_wireless.default_radio1[0].disabled=="1"){
                    var tr = '<tr><td>' + data.config_wireless.default_radio1[0].device + '</td><td>' + data.config_wireless.default_radio1[0].ssid + '</td><td>' + data.config_wireless.radio1[0].channel + '</td><td>' + data.config_wireless.radio1[0].hwmode + '</td><td>' +data.config_wireless.radio1[0].htmode + '</td><td><span class="badge badge-danger">OFF</span></td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#ssid-modal">Edit</button></td></tr>';
                    ap_data=ap_data+tr;
                    //$("#ssids-table tbody").append(tr);
                }
                else{
                    var tr = '<tr><td>' + data.config_wireless.default_radio1[0].device + '</td><td>' + data.config_wireless.default_radio1[0].ssid + '</td><td>' + data.config_wireless.radio1[0].channel + '</td><td>' + data.config_wireless.radio1[0].hwmode + '</td><td>' +data.config_wireless.radio1[0].htmode + '</td><td><span class="badge badge-success">ON</span></td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#ssid-modal">Edit</button></td></tr>';
                    ap_data=ap_data+tr;
                    //$("#ssids-table tbody").append(tr);
                }
                $("#ssids-table tbody").html(ap_data);
                var free = Math.floor(data.device.free_ram/1000);
                var used = Math.floor((data.device.total_ram-data.device.free_ram)/1000);
                var ctx = document.getElementById( "doughutChart" );
                ctx.height = 200;
                var myChart = new Chart( ctx, {
                    type: 'doughnut',
                    data: {
                        datasets: [ {
                            data: [ used, free],
                            backgroundColor: [
                                "rgba(217,83,79,0.7)",
                                "rgba(0, 123, 255,0.7)"
                            ],
                            hoverBackgroundColor: [
                                "rgba(217,83,79,0.7)",
                                "rgba(0, 123, 255,0.7)"

                            ]

                        } ],
                        labels: [
                            "Used Memory (kB)",
                            "Free Memory (kB)"
                        ]
                    },
                    options: {
                        responsive: true
                    }
                } );

            }
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
        //alert(dinterface);
        console.log(dinterface);
        if(dinterface=="radio0"){
            $("#modal-title").html('Edit Interface '+dinterface);
            $("#radio").val(dinterface);
            switch (object.config_wireless.default_radio0[0].encryption){
                case "wep":
                    $("#encryption").val("wep");
                    break;
                case "psk2":
                    $("#encryption").val("psk2");
                    break;
                case "psk-mixed":
                    $("#encryption").val("psk-mixed");
                    break;
            }
            $("#channel").val(object.config_wireless.radio0[0].channel);
            $("#ssid").val(object.config_wireless.default_radio0[0].ssid);
            $("#passwd").val(object.config_wireless.default_radio0[0].key);
        }
        if(dinterface=="radio1"){
            switch (object.config_wireless.default_radio1[0].encryption){
                case "psk":
                    $("#encryption").val("psk");
                    break;
                case "psk2":
                    $("#encryption").val("psk2");
                    break;
                case "psk-mixed":
                    $("#encryption").val("psk-mixed");
                    break;
            }
            $("#modal-title").html('Edit Interface '+dinterface);
            $("#radio").val(dinterface);
            $("#passwd").val(object.config_wireless.default_radio1[0].key);
            $("#channel").val(object.config_wireless.radio1[0].channel);
            $("#ssid").val(object.config_wireless.default_radio1[0].ssid);
        }
/*        $.each(object.config_wi,function(){
            if (this.interface==dinterface){
                $("#modal-title").html('Edit Interface '+this.interface);
                $("#interface").val(this.interface);
                $("#channel").val(this.channel);
                $("#ssid").val(this.ssid);

            }

        })*/

    })


    $("#myform").on('submit', function(){
        alert("abc");
        $("#mac").val(mac);
    })

    window.setInterval(function(){
        getDeviceDetails(mac);
    }, 15000);

    $(document).ready(function(){
        var currentLocation=document.location.toString();
        getDeviceDetails(mac);
        $("#dhcp").attr("href","dhcpdetail.html?"+mac);
        $("#general").attr("href","devdetail.html?"+mac);
        $("#firewall").attr("href","firewalldetail.html?"+mac);
    })
}(jQuery))