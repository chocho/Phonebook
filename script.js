$(document).ready(function () {
    function clickCounter() {
        if (typeof (Storage) !== "undefined") {
            if (localStorage.userId) {
                localStorage.userId = Number(localStorage.userId) + 1;
            } else {
                localStorage.userId = 1;
            }
        }
    }
 var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
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
function htmlUnescape(value){
    return String(value)
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&');
}
    function addRecord(id) {
        if (id !== undefined) {
            //  removeRec(id);
        }
        var valid = true;
        var thisUser = {};
        //var localStorage.userId =
        clickCounter();
        thisUser.phone = $("#phone").val();
        var name = $("#name");
        var phone = $("#phone");
        thisUser.name = $("#name").val();
        var proba = $("#name").val();
        var newproba = escapeHtml(proba);
        var newproba2 = htmlEscape(proba);
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
            potrebiteli[localStorage.userId] = thisUser;
        } else {
            var potrebiteli = {};
            potrebiteli[localStorage.userId] = thisUser;
        }
        if (valid) {
            $("#phoneTable tbody").append("<tr class='row' id='" + localStorage.userId + "'>" +
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
            $(".trash").click(function () {
                $("#" + localStorage.userId + "").remove();
                ;
                removeRec(localStorage.userId);
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
            localStorage.setItem("users", JSON.stringify(potrebiteli));
            //listRecords();
        }
        return valid;

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
                $(".trash").on("click", function () {
                    var id = userrr;
                    $(this).parentsUntil("tbody").remove();
                    removeRec(id);
                });
                $(".view").on("click", function () {
                    var id = userrr;
                    $("#dialog2").dialog("open");
                    //$(this).parentsUntil("tbody").remove();
                    viewRec(id);
                });
                $(".edit").on("click", function () {
                    var id = userrr;
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
        $("#dialog2 p").css("background-color", "#000");
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        localStorage.userId = id;
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
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        localStorage.userId = id;
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
    function updateRec(id) {
        var currentID = localStorage.userId;
        var restoredUsers = JSON.parse(localStorage.getItem("users"));
        var phone = $("#dialog #phone").val();
        var name = $("#dialog #name").val();
        var place = $("#dialog #place").val();
        var gender = $("#dialog #gender").val();
        var zodiac = $("#dialog #zodiac").val();
        var note = $("#dialog #note").val();
        $("tr#" + id + "").replaceWith("<tr class='row' id='" + localStorage.userId + "'>" +
                "<td>" + $("#phone").val() + "</td>" +
                "<td>" + $("#name").val() + "</td>" +
                "<td>" + $("#place").val() + "</td>" +
                "<td>" + $("#gender").val() + "</td>" +
                "<td>" + $("#zodiac").val() + "</td>" +
                "<td><img  class='view' src='images/view.png' width='25' height='25' alt='' />" +
                "<img  class='edit' src='images/edit.png' width='25' height='25' alt='' />" +
                "<img  class='trash' src='images/trash.png' width='25' height='25' alt='' /></td>" +
                "</tr>");
        $(".trash").on("click", function () {
            $(this).parentsUntil("tbody").remove();
            removeRec(id);
        });
        $(".view").on("click", function () {
            $("#dialog2").dialog("open");
            //$(this).parentsUntil("tbody").remove();
            viewRec(id);
        });
        $(".edit").on("click", function () {
            $("#dialog").dialog("open");
            //$(this).parentsUntil("tbody").remove();
            editRec(id);
        });

        restoredUsers[id].phone = phone;
        restoredUsers[id].name = name;
        restoredUsers[id].place = place;
        restoredUsers[id].gender = gender;
        restoredUsers[id].zodiac = zodiac;
        restoredUsers[id].note = note;
        localStorage.setItem("users", JSON.stringify(restoredUsers));
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
        $("#textAr").dialog("open");
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

                        // Uncommenting the following line would hide the text,
                        // resulting in the label being used as a tooltip
            },
            {
                text: "Обнови",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    var id = localStorage.userId;
                    $(this).dialog("close");
                    //$("#phoneTable tr#" + id + "").remove();
                    updateRec(id);
                }

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
        width: 400,
        modal: true,
        buttons: [
            {
                text: "Edit Record",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                    var id = localStorage.userId;
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
                    //$("#dialog").dialog("open");
                    //$(this).parentsUntil("tbody").remove();
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

    $("#textAr").dialog({
        autoOpen: false,
        height: 400,
        width: 800,
        modal: true,
        buttons: [
            {
                text: "Alert",
                icons: {
                    primary: "ui-icon-heart"
                },
                click: function () {
                   var entered =  $("#textAr").val();
                var res = entered.match(/.+$/gm);
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