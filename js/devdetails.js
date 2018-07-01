(function ($) {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    var object,serverLink='http://10.71.1.75:8080/user/distributor';

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
                $("#dmem-td").html(data.device.free_ram+"/"+data.device.total_ram);
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
                $.each(data.ssids, function(){
                    if(this.signal==null){
                        var tr = '<tr><td>' + this.interface + '</td><td>' + this.ssid + '</td><td>' + this.channel + '</td><td>' + this.signal + '</td><td>' + this.tx_power + '</td><td><span class="badge badge-danger">OFF</span></td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#ssid-modal">Edit</button></td></tr>';
                        $("#ssids-table tbody").append(tr);
                    }
                    else {
                        var tr = '<tr><td>' + this.interface + '</td><td>' + this.ssid + '</td><td>' + this.channel + '</td><td>' + this.signal + '</td><td>' + this.tx_power + '</td><td><span class="badge badge-success">ON</span></td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#ssid-modal">Edit</button></td></tr>';
                        $("#ssids-table tbody").append(tr);
                    }
                })
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
        console.log(dinterface);
        $.each(object.ssids,function(){
            if (this.interface==dinterface){
                $("#modal-title").html('Edit Interface '+this.interface);
                $("#interface").val(this.interface);
                $("#channel").val(this.channel);
                $("#ssid").val(this.ssid);

            }

        })

    })

    $("#modal-bod input").on('change', function(){
        $(this).addClass('changed');
    })

    $("#myform").on('submit', function(){
        alert("abc");
        $('input:not(.changed)').prop('disabled',true);
        $('#interface').prop('disabled',false);
    })

    $(document).ready(function(){
        var currentLocation=document.location.toString();
        var mac=currentLocation.split("?")[1];
        getDeviceDetails(mac);
        //$("#wireless").attr("href","devdetail.html?"+mac);

    })
}(jQuery))