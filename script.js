var users = [];

$(document).ready(function(){
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

    function addRecord() {

        $( "#phoneTable tbody" ).append( "<tr>" +
          "<td>" + $( "#phone" ).val() + "</td>" +
          "<td>" + $( "#name" ).val() + "</td>" +
          "<td>" + $( "#place" ).val() + "</td>" +
          "<td>" + $( "#gender" ).val() + "</td>" +
          "<td>" + $( "#zodiac" ).val() + "</td>" +
        "</tr>" );
        user = {};
        
        user = localstorage.user;
        user.phone = $( "#phone" ).val();
        user.name = $( "#name" ).val();
        user.place = $( "#place" ).val();
        user.gender = $( "#gender" ).val();
        user.zodiac = $( "#zodiac" ).val();
        
        
        $(this).dialog( "close" );
      }////////////////////////////////////////////////////////
function clickCounter() {
    if (localStorage.clickcount) {
        localStorage.clickcount = Number(localStorage.clickcount) + 1;
    } else {
        localStorage.clickcount = 1;
    }
    document.getElementById("result").innerHTML = "You have clicked the button " +
            localStorage.clickcount + " time(s).";
}

});