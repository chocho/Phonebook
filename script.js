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
            var id = $(this).parents("tr").attr("id");
            $("#dialog").dialog("open");
        $( "#dialog" ).dialog( "option", "title", "Редактирай запис" );
            
                $("#dialog").dialog("option", "buttons",
            [
                {
                    text: "Обнови",
                    icons: {
                        primary: "ui-icon-heart"
                    },
                    click: function () {
                        var id = localStorage.currentId;
                        var valid = updateRec(id);
                        if (valid) {
                            $(this).dialog("close");
                        }
                        location.reload();
                    }
                },
                {
                    text: "Отмени",
                    icons: {
                        primary: "ui-icon-heart"
                    },
                    click: function () {
                        $(this).dialog("close");
                        location.reload();
                    }
                }
            ]
            );
            
            
            
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

    function phoneNameCheck(restoredUsers, assignedUser, id) {
        var userrr = {};
        var currentPhone = "";
        var currentName = "";
        for (userrr in restoredUsers) {
            if (id !== undefined) {
                if (userrr === id) {
                    continue;
                }
            } else {
                id = 0;
            }
            currentPhone = restoredUsers[userrr].phone;
            currentName = restoredUsers[userrr].name;
            if (currentPhone === assignedUser.phone) {
                tips.text("Телефон " + currentPhone + " вече съществува.");
                return  false;
            } else if (currentName === assignedUser.name) {
                tips.text("Името " + currentName + " вече съществува.");
                return  false;
            }

        }
        return true;
    }

    function inputValidation(phone, name, place, gender, note) {
        var valid = true;
        valid = valid && checkLength(phone, "телефон", 5, 12);
        valid = valid && checkRegexp(phone, /[0+]\d+/, "Телефонът трябва да започва с + или 0, последвани от цифри 0-9");
        valid = valid && checkLength(name, "името", 1, 30);
        valid = valid && checkLength(place, "населено място", 0, 30);
        valid = valid && checkRegexp(gender, /[мж]{1}/, "Моля, изберете пол.");
        valid = valid && checkLength(note, "населено място", 0, 500);
        return valid;
    }

    function appendRecord(rowId, fields, edit) {
        if (edit !== undefined) {
            $("tr#" + rowId + "").replaceWith(appending(fields));
        } else {
            $("#phoneTable tbody").append(appending(fields));
        }
        ;
        viewEvent();
        editEvent();
        trashEvent();

        function appending(fields) {
            var field = "";
            var row = "<tr class='row' id='" + rowId + "'>";
            for (field in fields) {
                if (field === "note") {
                    continue;
                }
                row += "<td>" + fields[field] + "</td>";
            }
            row += "<td><img  class='view' src='images/view.png' width='25' height='25' alt='View icon' title='Виж запис' />" +
                    "<img  class='edit' src='images/edit.png' width='25' height='25' alt='Edit icon' title='Редактирай запис' />" +
                    "<img  class='trash' src='images/trash.png' width='25' height='25' alt='Delete icon' title='Изтрий запис' /></td>" +
                    "</tr>";
            return row;
        }
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

        valid = inputValidation(thisUser.phone, thisUser.name, thisUser.place, thisUser.gender, thisUser.note);

        var allUsers = JSON.parse(localStorage.getItem("users"));
        if (valid && allUsers) {
            valid = phoneNameCheck(allUsers, thisUser);
        } else {
            var allUsers = {};
        }

        if (valid) {
            clickCounter();
            allUsers[localStorage.userId] = thisUser;
            appendRecord(localStorage.userId, thisUser);
            $(this).dialog("close");
            localStorage.setItem("users", JSON.stringify(allUsers));
            location.reload();
        }
    }
    ;

    function listRecords() {
        var allUsers = JSON.parse(localStorage.getItem("users"));
        if (allUsers) {
            var userrr = {};
            for (userrr in allUsers) {
                appendRecord(userrr, allUsers[userrr]);
            }
        }
        ;
    }
    ;
    function viewRec(id) {
        //$("#dialog2 p").css("background-color", "#000");
        var allUsers = JSON.parse(localStorage.getItem("users"));
        localStorage.currentId = id;
        var phone = htmlUnescape(allUsers[id].phone);
        $("#dialog2 #phone").text(phone);
        var name = htmlUnescape(allUsers[id].name);
        $("#dialog2 #name").text(name);
        var place = htmlUnescape(allUsers[id].place);
        $("#dialog2 #place").text(place);
        var gender = htmlUnescape(allUsers[id].gender);
        $("#dialog2 #gender").text(gender);
        var zodiac = htmlUnescape(allUsers[id].zodiac);
        $("#dialog2 #zodiac").text(zodiac);
        var note = htmlUnescape(allUsers[id].note);
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

        valid = inputValidation(thisUser.phone, thisUser.name, thisUser.place, thisUser.gender, thisUser.note);

        var allUsers = JSON.parse(localStorage.getItem("users"));
        if (valid && allUsers) {
            valid = phoneNameCheck(allUsers, thisUser, id);

        } else {
            var allUsers = {};
        }

        if (valid) {
            appendRecord(id, thisUser, true);
            allUsers[id] = thisUser;
            localStorage.setItem("users", JSON.stringify(allUsers));
            return true;
        } else {
            return false;
        }
        
    }

    function removeRec(id) {
        var allUsers = JSON.parse(localStorage.getItem("users"));
        delete allUsers[id];
        localStorage.setItem("users", JSON.stringify(allUsers));
    }

    $("#dialog").dialog({autoOpen: false});

    $("#addRec").click(function () {
        $("#dialog").dialog("open");
        $( "#dialog" ).dialog( "option", "title", "Нов запис" );
            $("#dialog").dialog("option", "buttons",
            [
                {
                    text: "Добави",
                    icons: {
                        primary: "ui-icon-heart"
                    },
                    click: addRecord
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
            );
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
        modal: true
    });

    $("#dialog2").dialog({
        autoOpen: false,
        height: 500,
        width: 420,
        modal: true,
        buttons: [
            {
                text: "Редактирай",
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
                text: "Изтрий",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    var id = localStorage.currentId;
                    $(this).dialog("close");
                    $("tr#" + id + "").remove();
                    removeRec(id);
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

                        valid = inputValidation(thisUser.phone, thisUser.name, thisUser.place, thisUser.gender, thisUser.note);

                        if (valid && allUsers) {
                            valid = phoneNameCheck(allUsers, thisUser);
                        } else {
                            var allUsers = {};
                        }
                        if (valid) {
                            clickCounter();
                            appendRecord(localStorage.userId, thisUser);
                            allUsers[localStorage.userId] = thisUser;
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
            updateTips("Дължината на полето " + n + " трябва да бъде между " +
                    min + " и " + max + ".");
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
    var tips = $(".validateTips");

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