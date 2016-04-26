$(document).ready(function () {
    function addRecord() {
        var thisUser = {};
        var test = thisUser.phone = $("#phone").val();
        thisUser.name = $("#name").val();
        thisUser.place = $("#place").val();
        thisUser.gender = $("#gender").val();
        thisUser.zodiac = $("#zodiac").val();
        thisUser.note = $("#note").val();
        var potrebiteli = JSON.parse(localStorage.getItem("users"));
        if (potrebiteli) {
            potrebiteli[test] = thisUser;
            localStorage.setItem("users", JSON.stringify(potrebiteli));
        } else {
            var potrebiteli = {};
            potrebiteli[test] = thisUser;
            localStorage.setItem("users", JSON.stringify(potrebiteli));
        }
        $("#phoneTable tbody").append("<tr class='row' id='" + test + "'>" +
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
    }
    ;

    function listRecords() {
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        if (restoredUsers) {
            var userrr = {};
            for (userrr in restoredUsers) {
                var telefon = userrr[phone];
                $("#phoneTable tbody").append("<tr class='row' id='" + restoredUsers[userrr].phone + "'>" +
                        "<td>" + restoredUsers[userrr].phone + "</td>" +
                        "<td>" + restoredUsers[userrr].name + "</td>" +
                        "<td>" + restoredUsers[userrr].place + "</td>" +
                        "<td>" + restoredUsers[userrr].gender + "</td>" +
                        "<td>" + restoredUsers[userrr].zodiac + "</td>" +
                        "<td><img onclick='getElementById(\"demo\").innerHTML=Date()' class='"   + restoredUsers[userrr].phone +  "' src='images/trash.png' width='25' height='25' alt='' /></td>" +
                        "</tr>");
               $("img").on("click", function(){
    $(this).parentsUntil("tbody").hide();
});
            }
        }
        ;
    }
    ;

    function removeRec(id) {
        $("#" + id + "").remove();
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        localStorage.removeItem(restoredUsers[id]);
        localStorage.setItem("users", JSON.stringify(restoredUsers));
    }

    $("#dialog").dialog({autoOpen: false});

    $("#addRec").click(function () {
        $("#dialog").dialog("open");
    });

    $("#clearLS").click(function () {
        localStorage.clear();
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
    listRecords();
});