(function ($) {
    var splashlink='http://10.71.1.75:8080/splash/getuser'
    var splashcounter=1,buffer;

    var getUserList = function(){
        var row='';
        $.ajax({
            url: splashlink,
            success: function(result){
                buffer=result;
                $.each(result,function(){
                    var name=this.username;
                    $.ajax({
                        url: splashlink+':'+name,
                        success: function(details){
                            row='<tr><td>'+splashcounter+'</td><td>'+name+'</td><td>'+details.Expiration+'</td><td>'+details.LoginTime+'</td><td>'+details.MaxDailySession+'</td><td>'+details.MaxMonthlySession+'</td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-edit-user">Edit</button></td></tr>';
                            $('#user-list-table tbody').append(row);
                            splashcounter++;
                        }
                    })               
                    
                })
            }
        })

    }

    $(document).ready(function(){
        getUserList();
    })

    $("#user-list-table tbody").on('click','button',function(){
        var userno,username,expiration,maxdailysession,logintime,maxmonthlysession;
        userno = $(this).parent().siblings("td").html();
        username = $(this).parent().siblings("td").next().html();
        expiration = $(this).parent().siblings("td").next().next().html();
        logintime = $(this).parent().siblings("td").next().next().next().html();
        console.log(logintime);
        maxdailysession = $(this).parent().siblings("td").next().next().next().next().html();
        maxmonthlysession = $(this).parent().siblings("td").next().next().next().next().next().html();
        $("#edit-user-name-lab").html(username);
        $("#edit-user-name").val(username);
        if(expiration.localeCompare('undefined')==-1){
            $("#edit-expiration").val(expiration);
        }
        if(maxdailysession.localeCompare('undefined')==-1){
            $("#edit-max-daily-session").val(maxdailysession);
        }
        $("#edit-login-time").val(logintime);
        if(maxmonthlysession.localeCompare('undefined')==-1){
            $("#edit-max-monthly-session").val(maxmonthlysession);
        }
            
    
    })

    $("#add-user-form").on('submit', function(){
        var logintime="";
        var logindate=$("#logintime-date").val();
        var loginfrom=("0"+$("#logintime-from").val().toString()).slice(-2);
        var loginto=("0"+$("#logintime-to").val().toString()).slice(-2);
        switch (logindate){
            case "all":
                logintime+="Al"+loginfrom+"00-"+loginto+"00";
                break;
            case "wkday":
                logintime+="Wk"+loginfrom+"00-"+loginto+"00";
                break;
            case "wknd":
                logintime+="Sa,Su"+loginfrom+"00-"+loginto+"00"
        }
        
        $("#logintime-full").val(logintime);
    })

    $("#enable-max-dailysession-checkbox").change(function(){
        if(this.checked){
            $("#maxdailysession").prop('disabled',false);
        }
        else{
            $("#maxdailysession").prop('disabled',true);
        }
    })
    $("#enable-max-monthlysession-checkbox").change(function(){
        if(this.checked){
            $("#maxmonthlysession").prop('disabled',false);
        }
        else{
            $("#maxmonthlysession").prop('disabled',true);
        }
    })
}(jQuery))
