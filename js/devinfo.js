(function ($) {
    var currentURL = window.location.hostname;
    var object;
    var num = 1;
    var getDeviceList = function(){
        var i=1;
        var tabledata="";
        var maclist="";
        /*$("#bootstrap-data-table tbody").html("");*/
        $.ajax({
            url: "http://10.71.1.75:8080/user/distributor",
            method: "GET",
            success: function(data){
                $.each(data,function() {
                    var ts=new Date(1000*this.device.created_at);
                    var ts2=new Date(this.device.created_at);
                    var diff=Date.now();
                    diff=~~((diff-ts) /1000);
                    var datestring=ts.toLocaleString();
                    var machine_type=this.device.machine_type;
                    machine_type = machine_type.replace(/^\n|\n$/g, '');
                    var row;
                    if (diff<60){
                        row='<tr><td>'+i+'</td><td>'+machine_type+'</td><td>'+this.device.mac+'</td><td>'+this.device.wan_ip+'</td><td>'+datestring+'</td><td><span class="badge badge-success">Connected</span></td></tr>'
                    }
                    else{
                        row='<tr><td>'+i+'</td><td>'+machine_type+'</td><td>'+this.device.mac+'</td><td>'+this.device.wan_ip+'</td><td>'+datestring+'</td><td><span class="badge badge-danger">Disconnected</span></td></tr>'
                    }
                    /*$("#bootstrap-data-table tbody").append(row);*/

                    tabledata = tabledata + row;
                    $("#bootstrap-data-table tbody").html(tabledata);
                    var irow= '<option>'+this.device.mac+'</option>';
                    maclist+=irow;
                    i++;
                });
                if(num==1)
                    $("#mac-select").html(maclist);
                num=2;
            },
        });




    }

    window.setInterval(function(){
        getDeviceList();
    }, 5000);

    $(document).ready(function(){
        getDeviceList();
    })

    $("#send-multiple").on('click',function(){
        $("#command-area").val('');
    })

    $("#bootstrap-data-table tbody").on("click", "tr",function(){
        var mac_td=this.cells[2];
        var mac = $(mac_td).text();
        /*  getDeviceDetails(mac); */

        window.location = "devdetail.html?"+mac;
        //window.location = "google.com"
    });

    $("#myform").submit(function(e){
        var $inputs= $("#myform :input");
        $inputs.each(function(){
            if (this.value==""){
                e.preventDefault();
                return false;
            }
        })
    })
}(jQuery))