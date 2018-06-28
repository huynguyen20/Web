
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
                        row='<tr><td>'+splashcounter+'</td><td>'+name+'</td><td>'+details.Expiration+'</td><td>'+details.LoginTime+'</td><td>'+details.MaxDailySession+'</td><td><button id="edit-btn" type="button" class="btn btn-info" data-toggle="modal" data-target="#modal-edit-user">Edit</button></td></tr>';
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
    var userno,username,expiration,maxdailysession,logintime;
    userno = $(this).parent().siblings("td").html();
    username = $(this).parent().siblings("td").next().html();
    expiration = $(this).parent().siblings("td").next().next().html();
    console.log(expiration);
    logintime = $(this).parent().siblings("td").next().next().next().html();
    maxdailysession = $(this).parent().siblings("td").next().next().next().next().html();
    console.log(username);
    $("#modal-username").html(username);
    $("#modal-username-input").val(username);
    if(expiration.localeCompare('undefined')==-1){
        $("#modal-expiration").val(expiration);
    }
    if(maxdailysession.localeCompare('undefined')==-1){
        $("#modal-maxdailysession").val(maxdailysession);
    }
    if(logintime.localeCompare('undefined')==-1){
        $("#modal-logintime").val(logintime);
    }

           
  
  })

$("#modal-bod input").on('change', function(){
    $(this).addClass('changed');
})

$("#myform").on('submit', function(){
    $('input:not(.changed)').prop('disabled',true);
    $("#modal-username-input").prop('disabled',false);
})
