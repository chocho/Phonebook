$(document).ready(function () {
           localStorage.users = {};

    function addRecord() {
        var test = + $("#phone").val();
            localStorage.users = {};

             localStorage.phone = $("#phone").val();
        //localStorage.users[test]['name'] = $("#name").val();
        //localStorage.users[test]['place'] = $("#place").val();
        //localStorage.users[test]['gender'] = $("#gender").val();
        //localStorage.users[test]['zodiac'] = $("#zodiac").val();
        //localStorage.users[test]['note'] = $("#note").val();
        var proba = 555;   
        
        
        $("#phoneTable tbody").append("<tr class='row' id='"+ test +"'>" +
                "<td>" + $("#phone").val() + "</td>" +
                "<td>" + $("#name").val() + "</td>" +
                "<td>" + $("#place").val() + "</td>" +
                "<td>" + $("#gender").val() + "</td>" +
                "<td>" + $("#zodiac").val() + "</td>" +
                "<td><img  src='images/trash.png' width='25' height='25' alt='' /></td>" +
                "</tr>");
        $(this).dialog("close");

        $("img").click(function () {
            $("#" + test + "").remove();
            ;
        });        
    };

    function listRecords(){
      if (localStorage.users.length > 0) {
          for(c in localStorage.users){
                $("#phoneTable tbody").append("<tr class='row' id='"+ localStorage.users[c][phone] +"'>" +
                "<td>" + localStorage.users[c][phone] + "</td>" +
                "<td>" + localStorage.users[c][name] + "</td>" +
                "<td>" + localStorage.users[c][place] + "</td>" +
                "<td>" + localStorage.users[c][gender] + "</td>" +
                "<td>" + localStorage.users[c][zodiac] + "</td>" +
                "<td><img  src='images/trash.png' width='25' height='25' alt='' /></td>" +
                "</tr>");
          }
    };  
    };
    
    $("#dialog").dialog({autoOpen: false});

    $("#addRec").click(function () {
        $("#dialog").dialog("open");
    });
    $("#dialog").dialog({
        autoOpen: false,
        height: 500,
        width: 350,
        modal: true,
        buttons: [
            {
                text: "Create Record",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: addRecord
            },
            {
                text: "Cancel",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
//listRecords();
});
































//////////////////////////////////////////////////////////////////////////////////////////////////////////
function clickCounter() {
    if (localStorage.clickcount) {
        localStorage.clickcount = Number(localStorage.clickcount) + 1;
    } else {
        localStorage.clickcount = 1;
    }
    document.getElementById("result").innerHTML = "You have clicked the button " +
            localStorage.clickcount + " time(s).";
}




