$(document).ready(function () {
    function clickCounter() {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.userId) {
                localStorage.userId = Number(localStorage.userId) + 1;
            } else {
                localStorage.userId = 1;
            }
            return localStorage.userId;
        }
    }

    function htmlEscape(str) {
        return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
    }

// I needed the opposite function today, so adding here too:
    function htmlUnescape(value) {
        return String(value)
                .replace(/&quot;/g, '"')
                .replace(/&#39;/g, "'")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&amp;/g, '&');
    }

    function viewEvent() {
        $(".view").click(function () {
            var id = $(this).parents("tr").attr("id");
            $("#dialog2").dialog("open");
            viewRec(id);
        });
    }

    function editEvent() {
        $(".edit").click(function () {
            //var id = $(this).attr("id");
            var id = $(this).parents("tr").attr("id");
            $("#dialog").dialog("open");
            editRec(id);
        });
    }

    function trashEvent() {
        $(".trash").click(function () {
            var id = $(this).parents("tr").attr("id");
            $("#" + id + "").remove();
            removeRec(id);
        });
    }

    function addRecord() {

        var valid = true;
        var thisUser = {};
        thisUser.phone = htmlEscape($("#phone").val());
        thisUser.name = htmlEscape($("#name").val());
        thisUser.place = htmlEscape($("#place").val());
        thisUser.gender = htmlEscape($("#gender").val());
        thisUser.zodiac = htmlEscape($("#zodiac").val());
        thisUser.note = htmlEscape($("#note").val());
        var char = "";
        for (char in thisUser) {
            if (char === undefined) {
                char = "";
            }
        }
        valid = valid && checkLength(thisUser.phone, "phone number", 5, 12);
        valid = valid && checkRegexp(thisUser.phone, /[0+]\d+/, "Phone number may begin with + or 0, followed by 0-9");
        valid = valid && checkLength(thisUser.name, "името", 1, 30);
        valid = valid && checkLength(thisUser.place, "населено място", 0, 30);
        valid = valid && checkRegexp(thisUser.gender, /[мж]{1}/, "Моля, изберете пол.");
        valid = valid && checkLength(thisUser.note, "населено място", 0, 500);
        //valid = valid && checkRegexp(name, /.+/, "Username may consist of a-z, 0-9, underscores, spaces and must begin with a letter.");
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
        } else {
            var potrebiteli = {};
        }
        if (valid) {
            var locid = clickCounter();
            potrebiteli[localStorage.userId] = thisUser;
            $("#phoneTable tbody").append("<tr class='row' id='" + localStorage.userId + "'>" +
                    "<td>" + thisUser.phone + "</td>" +
                    "<td>" + thisUser.name + "</td>" +
                    "<td>" + thisUser.place + "</td>" +
                    "<td>" + thisUser.gender + "</td>" +
                    "<td>" + thisUser.zodiac + "</td>" +
                    "<td><img  class='view' src='images/view.png' width='25' height='25' alt='' />" +
                    "<img  class='edit' src='images/edit.png' width='25' height='25' alt='' />" +
                    "<img  class='trash' src='images/trash.png' width='25' height='25' alt='' /></td>" +
                    "</tr>");
            $(this).dialog("close");
            viewEvent();
            editEvent();
            trashEvent();
            localStorage.setItem("users", JSON.stringify(potrebiteli));
        }
        //return valid;
        //location.reload();

    }
    ;

    function listRecords() {
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        if (restoredUsers) {
            var userrr = {};
            for (userrr in restoredUsers) {
                $("#phoneTable tbody").append("<tr class='row' id='" + userrr + "'>" +
                        "<td>" + restoredUsers[userrr].phone + "</td>" +
                        "<td>" + restoredUsers[userrr].name + "</td>" +
                        "<td>" + restoredUsers[userrr].place + "</td>" +
                        "<td>" + restoredUsers[userrr].gender + "</td>" +
                        "<td>" + restoredUsers[userrr].zodiac + "</td>" +
                        "<td><img class='view' onclick='getElementById(\"demo\").innerHTML=Date()' id='" + userrr + "' src='images/view.png' width='25' height='25' alt='' />" +
                        "<img class='edit' onclick='getElementById(\"demo\").innerHTML=Date()' id='" + userrr + "' src='images/edit.png' width='25' height='25' alt='' />\n\
" +
                        "<img class='trash' onclick='getElementById(\"demo\").innerHTML=Date()' id='" + userrr + "' src='images/trash.png' width='25' height='25' alt='' /></td>" +
                        "</tr>");

                viewEvent();
                editEvent();
                trashEvent();
            }
        }
        ;
    }
    ;
    function viewRec(id) {
        $("#dialog2 p").css("background-color", "#000");
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        localStorage.currentId = id;
        var phone = restoredUsers[id].phone;
        $("#dialog2 #phone").text(phone);
        var name = restoredUsers[id].name;
        $("#dialog2 #name").text(name);
        var place = restoredUsers[id].place;
        $("#dialog2 #place").text(place);
        var gender = restoredUsers[id].gender;
        $("#dialog2 #gender").text(gender);
        var zodiac = restoredUsers[id].zodiac;
        $("#dialog2 #zodiac").text(zodiac);
        var note = restoredUsers[id].note;
        $("#dialog2 #note").text(note);
    }

    function editRec(id) {
        var allUsers = JSON.parse(localStorage.getItem("users"));
        localStorage.currentId = id;
        var phone = allUsers[id].phone;
        $("#dialog #phone").val(phone);
        var name = htmlUnescape(allUsers[id].name);
        $("#dialog #name").val(name);
        var place = allUsers[id].place;
        $("#dialog #place").val(place);
        var gender = allUsers[id].gender;
        $("#dialog #gender").val(gender);
        var zodiac = allUsers[id].zodiac;
        $("#dialog #zodiac").val(zodiac);
        var note = allUsers[id].note;
        $("#dialog #note").val(note);
    }
    function updateRec(id) {
        var thisUser = {};
        thisUser.phone = htmlEscape($("#dialog #phone").val());
        thisUser.name = htmlEscape($("#dialog #name").val());
        thisUser.place = htmlEscape($("#dialog #place").val());
        thisUser.gender = htmlEscape($("#dialog #gender").val());
        thisUser.zodiac = htmlEscape($("#dialog #zodiac").val());
        thisUser.note = htmlEscape($("#dialog #note").val());

        var valid = true;
        valid = valid && checkLength(thisUser.phone, "phone number", 5, 12);
        valid = valid && checkRegexp(thisUser.phone, /[0+]\d+/, "Phone number may begin with + or 0, followed by 0-9");
        valid = valid && checkLength(thisUser.name, "името", 1, 30);
        valid = valid && checkLength(thisUser.place, "населено място", 0, 30);
        valid = valid && checkRegexp(thisUser.gender, /[мж]{1}/, "Моля, изберете пол.");
        valid = valid && checkLength(thisUser.note, "населено място", 0, 500);

        var userrr = {};
        var allUsers = JSON.parse(localStorage.getItem("users"));
        if (valid && allUsers) {
            for (userrr in allUsers) {
                if (userrr === id) {
                    continue;
                }
                var currentPhone = allUsers[userrr].phone;
                var currentName = allUsers[userrr].name;
                if (currentPhone === thisUser.phone) {
                    tips.text("Телефонът вече съществува");
                    valid = false;
                } else if (currentName === thisUser.name) {
                    tips.text("Името вече съществува");
                    valid = false;
                }
            }
        } else {
            var allUsers = {};
        }

        if (valid) {
            $("tr#" + id + "").replaceWith("<tr class='row' id='" + id + "'>" +
                    "<td>" + thisUser.phone + "</td>" +
                    "<td>" + thisUser.name + "</td>" +
                    "<td>" + thisUser.place + "</td>" +
                    "<td>" + thisUser.gender + "</td>" +
                    "<td>" + thisUser.zodiac + "</td>" +
                    "<td><img  class='view' src='images/view.png' width='25' height='25' alt='' />" +
                    "<img  class='edit' src='images/edit.png' width='25' height='25' alt='' />" +
                    "<img  class='trash' src='images/trash.png' width='25' height='25' alt='' /></td>" +
                    "</tr>");
            viewEvent();
            editEvent();
            trashEvent();

            allUsers[id] = thisUser;
            localStorage.setItem("users", JSON.stringify(allUsers));
            return true;

        } else {
            return false;
        }
        //location.reload();
    }

    function removeRec(id) {
        var allUsers = JSON.parse(localStorage.getItem("users"));
        delete allUsers[id];
        localStorage.setItem("users", JSON.stringify(allUsers));
    }

    $("#dialog").dialog({autoOpen: false});

    $("#addRec").click(function () {
        $("#dialog").dialog("open");
    });
    $("#importRec").click(function () {
        $("#importDiv").dialog("open");
    });

    $("#clearLS").click(function () {
        localStorage.clear();
    });

    $("#dialog").dialog({
        autoOpen: false,
        height: 500,
        width: 400,
        modal: true,
        buttons: [
            {
                text: "Създай нов",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: addRecord
            },
            {
                text: "Обнови",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    var id = localStorage.currentId;
                    //$("#phoneTable tr#" + id + "").remove();
                    var valid = updateRec(id);
                    if (valid) {
                        $(this).dialog("close");
                    }
                }
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
        width: 400,
        modal: true,
        buttons: [
            {
                text: "Edit Record",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    var id = localStorage.currentId;
                    $(this).dialog("close");
                    $("#dialog").dialog("open");
                    editRec(id);
                }
            },
            {
                text: "Delete Record",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    var id = localStorage.userId;
                    $(this).dialog("close");
                    $("tr#" + id + "").remove();
                    removeRec(id);
                }
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

    $("#importDiv").dialog({
        autoOpen: false,
        height: 400,
        width: 800,
        modal: true,
        buttons: [
            {
                text: "Запиши",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    var valid = true;
                    var entered = $("#textAr").val();
                    if (!entered) {
                        tips.text("Моля, въведете данни.");

                        return valid = false;
                    }
                    var res = entered.match(/.+$/gm);

                    var allUsers = JSON.parse(localStorage.getItem("users"));
                    if (!allUsers) {
                        var allUsers = {};
                    }
                    var fLen = res.length;
                    var c = 0;
                    for (c = 0; c < fLen; c++) {
                        var thisUser = {};
                        var user = res[c].split("\t");

                        if (user[0]) {
                            thisUser.phone = user[0];
                        } else {
                            thisUser.phone = "";
                        }
                        if (user[1]) {
                            thisUser.name = user[1];
                        } else {
                            thisUser.name = "";
                        }
                        if (user[2]) {
                            thisUser.place = user[2];
                        } else {
                            thisUser.place = "";
                        }
                        if (user[3]) {
                            thisUser.gender = user[3];
                        } else {
                            thisUser.gender = "";
                        }
                        if (user[4]) {
                            thisUser.zodiac = user[4];
                        } else {
                            thisUser.zodiac = "";
                        }
                        if (user[5]) {
                            thisUser.note = user[5];
                        } else {
                            thisUser.note = "";
                        }

                        valid = valid && checkLength(thisUser.phone, "phone number", 5, 12);
                        valid = valid && checkRegexp(thisUser.phone, /[0+]\d+/, "Phone number may begin with + or 0, followed by 0-9");
                        valid = valid && checkLength(thisUser.name, "името", 1, 30);
                        valid = valid && checkLength(thisUser.place, "населено място", 0, 30);
                        valid = valid && checkRegexp(thisUser.gender, /[мж]{1}/, "Моля, изберете пол.");
                        valid = valid && checkLength(thisUser.note, "населено място", 0, 500);

                        var userrr = {};
                        if (valid && allUsers) {
                            for (userrr in allUsers) {
                                var currentPhone = allUsers[userrr].phone;
                                var currentName = allUsers[userrr].name;
                                if (currentPhone === thisUser.phone) {
                                    tips.text(currentPhone + " вече съществува.");
                                    valid = false;
                                } else if (currentName === thisUser.name) {
                                    tips.text("Вече съществува това име: " + currentName);
                                    valid = false;
                                }
                            }
                        } else {
                            var allUsers = {};
                        }
                        if (valid) {
                            clickCounter();
                            $("#phoneTable tbody").append("<tr class='row' id='" + localStorage.userId + "'>" +
                                    "<td>" + thisUser.phone + "</td>" +
                                    "<td>" + thisUser.name + "</td>" +
                                    "<td>" + thisUser.place + "</td>" +
                                    "<td>" + thisUser.gender + "</td>" +
                                    "<td>" + thisUser.zodiac + "</td>" +
                                    "<td><img  class='view' src='images/view.png' width='25' height='25' alt='' />" +
                                    "<img  class='edit' src='images/edit.png' width='25' height='25' alt='' />" +
                                    "<img  class='trash' src='images/trash.png' width='25' height='25' alt='' /></td>" +
                                    "</tr>");

                            allUsers[localStorage.userId] = thisUser;

                            viewEvent();
                            editEvent();
                            trashEvent();
                            localStorage.setItem("users", JSON.stringify(allUsers));

                        } else {
                            return false;
                        }
                    }
                    localStorage.setItem("users", JSON.stringify(allUsers));
                    $(this).dialog("close");
                }
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

    function updateTips(t) {
        tips
                .text(t)
                .addClass("ui-state-highlight");
        setTimeout(function () {
            tips.removeClass("ui-state-highlight", 1500);
        }, 500);
    }

    function checkLength(o, n, min, max) {
        if (o.length > max || o.length < min) {
            //o.addClass("ui-state-error");
            updateTips("Length of " + n + " must be between " +
                    min + " and " + max + ".");
            return false;
        } else {
            return true;
        }
    }


    function checkRegexp(o, regexp, n) {
        if (!(regexp.test(o))) {
            //o.addClass("ui-state-error");
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