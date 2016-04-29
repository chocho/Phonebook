$(document).ready(function () {
    function addRecord() {
        var valid = true;
        var thisUser = {};
        var userId = thisUser.phone = $("#phone").val();
        var name = $("#name");
        var phone = $("#phone");
        thisUser.name = $("#name").val();
        thisUser.place = $("#place").val();
        thisUser.gender = $("#gender").val();
        thisUser.zodiac = $("#zodiac").val();
        thisUser.note = $("#note").val();
        valid = valid && checkLength(phone, "phone number", 5, 12);
        valid = valid && checkRegexp(phone, /[0-9]/, "Phone number may consist of +, 0-9");
        valid = valid && checkLength(name, "името", 5, 12);
        valid = valid && checkRegexp(name, /^[a-z]([0-9a-z_\s])+$/i, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
        var userrr = {};
        var potrebiteli = JSON.parse(localStorage.getItem("users"));
        if (valid && potrebiteli) {
            for (userrr in potrebiteli) {
                var currentPhone = potrebiteli[userrr].phone;
                var currentName = potrebiteli[userrr].name;
                if (currentPhone === thisUser.phone) {
                    tips.text("weche go ima телефона");
                    valid = false;
                } else if (currentName === thisUser.name) {
                    tips.text("weche go ima това име");
                    valid = false;
                }
            }

            potrebiteli[userId] = thisUser;
            //localStorage.setItem("users", JSON.stringify(potrebiteli));
        } else {
            var potrebiteli = {};
            potrebiteli[userId] = thisUser;
            //localStorage.setItem("users", JSON.stringify(potrebiteli));
        }
        if (valid) {
            $("#phoneTable tbody").append("<tr class='row' id='" + userId + "'>" +
                    "<td>" + $("#phone").val() + "</td>" +
                    "<td>" + $("#name").val() + "</td>" +
                    "<td>" + $("#place").val() + "</td>" +
                    "<td>" + $("#gender").val() + "</td>" +
                    "<td>" + $("#zodiac").val() + "</td>" +
                    "<td><img  class='view' src='images/view.png' width='25' height='25' alt='' />" +
                    "<img  class='edit' src='images/edit.png' width='25' height='25' alt='' />" +
                    "<img  class='trash' src='images/trash.png' width='25' height='25' alt='' /></td>" +
                    "</tr>");
            $(this).dialog("close");
            localStorage.setItem("users", JSON.stringify(potrebiteli));

        }
        return valid;
        $(".trash").click(function () {
            $("#" + userId + "").remove();
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
                        "<td><img class='view' onclick='getElementById(\"demo\").innerHTML=Date()' id='" + restoredUsers[userrr].phone + "' src='images/view.png' width='25' height='25' alt='' />" +
                        "<img class='edit' onclick='getElementById(\"demo\").innerHTML=Date()' id='" + restoredUsers[userrr].phone + "' src='images/edit.png' width='25' height='25' alt='' />\n\
" +
                        "<img class='trash' onclick='getElementById(\"demo\").innerHTML=Date()' id='" + restoredUsers[userrr].phone + "' src='images/trash.png' width='25' height='25' alt='' /></td>" +
                        "</tr>");
                $(".trash").on("click", function () {
                    var id = $(this).attr("id");
                    $(this).parentsUntil("tbody").remove();
                    removeRec(id);
                });
                $(".view").on("click", function () {
                    var id = $(this).attr("id");
                    $("#dialog").dialog("open");
                    //$(this).parentsUntil("tbody").remove();
                    viewRec(id);
                });
                $(".edit").on("click", function () {
                    var id = $(this).attr("id");
                    $("#dialog").dialog("open");
                    //$(this).parentsUntil("tbody").remove();
                    editRec(id);
                });
            }
        }
        ;
    }
    ;
    function viewRec(id) {
        $("#dialog input").attr("disabled", "disabled");
        $("#dialog td").css("background-color", "#000");
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        var phone = restoredUsers[id].phone;
        $("#dialog #phone").val(phone);
        var name = restoredUsers[id].name;
        $("#dialog #name").val(name);
        var place = restoredUsers[id].place;
        $("#dialog #place").val(place);
        var gender = restoredUsers[id].gender;
        $("#dialog #gender").val(gender);
        var zodiac = restoredUsers[id].zodiac;
        $("#dialog #zodiac").val(zodiac);
        var note = restoredUsers[id].note;
        $("#dialog #note").val(note);
    }

    function editRec(id) {
        $("#dialog input").removeAttr("disabled");
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        var phone = restoredUsers[id].phone;
        $("#dialog #phone").val(phone);
        var name = restoredUsers[id].name;
        $("#dialog #name").val(name);
        var place = restoredUsers[id].place;
        $("#dialog #place").val(place);
        var gender = restoredUsers[id].gender;
        $("#dialog #gender").val(gender);
        var zodiac = restoredUsers[id].zodiac;
        $("#dialog #zodiac").val(zodiac);
        var note = restoredUsers[id].note;
        $("#dialog #note").val(note);
    }
    function removeRec(id) {
        var idd = id;
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        delete restoredUsers[id];
        //localStorage.removeItem(restoredUsers[id]);
        localStorage.setItem("users", JSON.stringify(restoredUsers));
    }

    $("#dialog").dialog({autoOpen: false});

    $("#addRec").click(function () {
        $("#dialog").dialog("open");
    });
    $("#importRec").click(function () {
        $("#dialog2").dialog("open");
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
                text: "Запиши",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: addRecord

                        // Uncommenting the following line would hide the text,
                        // resulting in the label being used as a tooltip
            },
            {
                text: "Отмени",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });
    $("#dialog2").dialog({
        autoOpen: false,
        height: 500,
        width: 350,
        modal: true,
        buttons: [
            {
                text: "Update Record",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: addRecord
            },
            {
                text: "Ok",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    $(this).dialog("close");
                }
            }
        ]
    });

    function updateTips(t) {
        tips
                .text(t)
                .addClass("ui-state-highlight");
        setTimeout(function () {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max) {
        if (o.val().length > max || o.val().length < min) {
            o.addClass("ui-state-error");
            updateTips("Length of " + n + " must be between " +
                    min + " and " + max + ".");
            return false;
        } else {
            return true;
        }
    }

    function checkRegexp(o, regexp, n) {
        if (!(regexp.test(o.val()))) {
            o.addClass("ui-state-error");
            updateTips(n);
            return false;
        } else {
            return true;
        }
    }
    var dialog, form,
            // From http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-%28type=email%29
            emailRegex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
            //name = $("#name"),
            //email = $("#email"),
            password = $("#password"),
            //allFields = $([]).add(name).add(email).add(password),
            tips = $(".validateTips");

    function updateTips(t) {
        tips
                .text(t)
                .addClass("ui-state-highlight");
        setTimeout(function () {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }
    listRecords();
});