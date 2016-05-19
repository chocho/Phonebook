$(document).ready(function () {
    var list = function () {
        var tips = $(".validateTips");
        var user = {};

        function fetchUsers(param) {
            var users = JSON.parse(localStorage.getItem(param));
            return users;
        }

        function listAllUsers() {
            var allUsers = fetchUsers("users");
            for (user in allUsers) {
                tableRecordAppend(user, allUsers[user]);
            }
        }

        function idCounter() {
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

        function closeClear() {
            if (tips.text !== "") {
                tips.text("");
            }
            $(this).dialog("close");
            clearData();
        }

        function eventDelButton() {
            var id = localStorage.currentId;
            $(this).dialog("close");
            $("tr#" + id + "").remove();
            recordRemove(id);
        }

        function eventUpdateButton() {
            var id = localStorage.currentId;
            var valid = recordUpdate(id);
            if (valid) {
                $(this).dialog("close");
                clearData();
            }
        }

        function eventEditIcon(click, openDiv) {
            $(click).click(function () {
                var id = $(this).parents("tr").attr("id");
                $(openDiv).dialog("open");
                $(openDiv).dialog("option", "title", "Редактирай запис");
                $(openDiv).dialog("option", "buttons",
                        [
                            buttons("Обнови", "ui-icon-check", eventUpdateButton),
                            buttons("Отмени")
                        ]
                        );

                recordEdit(id);
            });
        }

        function eventTrashIcon(click) {
            $(click).click(function () {
                var id = $(this).parents("tr").attr("id");
                $("#" + id + "").remove();
                recordRemove(id);
            });
        }

        function phoneNameCheck(restoredUsers, assignedUser, id) {
            var user = {};
            var currentPhone = "";
            var currentName = "";
            for (user in restoredUsers) {
                if (id !== undefined) {
                    if (user === id) {
                        continue;
                    }
                } else {
                    id = 0;
                }
                currentPhone = restoredUsers[user].phone;
                currentName = restoredUsers[user].name;
                if (currentPhone === assignedUser.phone) {
                    updateTips("Телефон " + currentPhone + " вече съществува.");
                    return  false;
                } else if (currentName === assignedUser.name) {
                    updateTips("Името " + currentName + " вече съществува.");
                    return  false;
                }
            }
            return true;
        }

        function inputValidation(phone, name, place, gender, note) {
            var valid = true;
            valid = valid && checkLength(phone, "Телефон", 5, 12);
            valid = valid && checkRegexp(phone, /[0+]\d+/, "Телефонът трябва да започва с + или 0, последвани от цифри 0-9");
            valid = valid && checkLength(name, "Име", 1, 30);
            valid = valid && checkLength(place, "Населено място", 0, 30);
            valid = valid && checkRegexp(gender, /[мж]{1}/, "Моля, изберете пол.");
            valid = valid && checkLength(note, "Бележки", 0, 500);
            return valid;
        }

        function tableRecordAppend(rowId, fields, edit) {
            if (edit !== undefined) {
                $("tr#" + rowId + "").replaceWith(appending(fields, rowId));
            } else {
                $("#phoneTable tbody").append(appending(fields, rowId));
            }
            ;
            eventViewIcon(".view", "#viewDiv");
            eventEditIcon(".edit", "#addEditDiv");
            eventTrashIcon(".trash");
        }

        function appending(fields, rowId) {
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

        function recordAdd() {
            var valid = true;
            var thisUser = {};
            var prop = 0;
            var masiv = ["phone", "name", "place", "gender", "zodiac", "note"];
            var length = masiv.length;
            for (prop = 0; prop < length; prop++) {
                var test = masiv[prop];
                thisUser[test] = htmlEscape($("#" + masiv[prop] + "").val());
            }
            /*thisUser.phone = htmlEscape($("#phone").val());
             thisUser.name = htmlEscape($("#name").val());
             thisUser.place = htmlEscape($("#place").val());
             thisUser.gender = htmlEscape($("#gender").val());
             thisUser.zodiac = htmlEscape($("#zodiac").val());
             thisUser.note = htmlEscape($("#note").val());*/
            var char = "";
            for (char in thisUser) {
                if (char === undefined) {
                    char = "";
                }
            }
            valid = inputValidation(thisUser.phone, thisUser.name, thisUser.place, thisUser.gender, thisUser.note);
            var allUsers = fetchUsers("users");

            if (valid && allUsers) {
                valid = phoneNameCheck(allUsers, thisUser);
            } else {
                var allUsers = {};
            }

            if (valid) {
                idCounter();
                allUsers[localStorage.userId] = thisUser;
                tableRecordAppend(localStorage.userId, thisUser);
                $(this).dialog("close");
                localStorage.setItem("users", JSON.stringify(allUsers));
                clearData();
            }
        }

        function recordView(id) {
            var allUsers = fetchUsers("users");
            localStorage.currentId = id;
            var phone = htmlUnescape(allUsers[id].phone);
            var name = htmlUnescape(allUsers[id].name);
            var place = htmlUnescape(allUsers[id].place);
            var gender = htmlUnescape(allUsers[id].gender);
            var zodiac = htmlUnescape(allUsers[id].zodiac);
            var note = htmlUnescape(allUsers[id].note);
            $("#viewDiv #phone").text(phone);
            $("#viewDiv #name").text(name);
            $("#viewDiv #place").text(place);
            $("#viewDiv #gender").text(gender);
            $("#viewDiv #zodiac").text(zodiac);
            $("#viewDiv #note").text(note);
        }

        function recordEdit(id) {
            var allUsers = fetchUsers("users");
            localStorage.currentId = id;
            var phone = allUsers[id].phone;
            var name = htmlUnescape(allUsers[id].name);
            var place = allUsers[id].place;
            var gender = allUsers[id].gender;
            var zodiac = allUsers[id].zodiac;
            var note = allUsers[id].note;
            $("#addEditDiv #phone").val(phone);
            $("#addEditDiv #name").val(name);
            $("#addEditDiv #place").val(place);
            $("#addEditDiv #gender").val(gender);
            $("#addEditDiv #zodiac").val(zodiac);
            $("#addEditDiv #note").val(note);
        }

        function recordUpdate(id) {
            var thisUser = {};
            thisUser.phone = htmlEscape($("#addEditDiv #phone").val());
            thisUser.name = htmlEscape($("#addEditDiv #name").val());
            thisUser.place = htmlEscape($("#addEditDiv #place").val());
            thisUser.gender = htmlEscape($("#addEditDiv #gender").val());
            thisUser.zodiac = htmlEscape($("#addEditDiv #zodiac").val());
            thisUser.note = htmlEscape($("#addEditDiv #note").val());
            var valid = true;
            valid = inputValidation(thisUser.phone, thisUser.name, thisUser.place, thisUser.gender, thisUser.note);
            var allUsers = fetchUsers("users");
            if (valid && allUsers) {
                valid = phoneNameCheck(allUsers, thisUser, id);
            } else {
                var allUsers = {};
            }

            if (valid) {
                tableRecordAppend(id, thisUser, true);
                allUsers[id] = thisUser;
                localStorage.setItem("users", JSON.stringify(allUsers));
                return true;
            } else {
                return false;
            }
        }

        function recordRemove(id) {
            var allUsers = fetchUsers("users");
            delete allUsers[id];
            localStorage.setItem("users", JSON.stringify(allUsers));
        }

        function recordImport() {
            var valid = true;
            var entered = $("#textAr").val();
            if (!entered) {
                updateTips("Моля, въведете данни.");
                return valid = false;
            }
            var res = entered.match(/.+$/gm);
            var allUsers = fetchUsers("users");
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
                    idCounter();
                    tableRecordAppend(localStorage.userId, thisUser);
                    allUsers[localStorage.userId] = thisUser;
                    localStorage.setItem("users", JSON.stringify(allUsers));
                } else {
                    return false;
                }
            }
            localStorage.setItem("users", JSON.stringify(allUsers));
            $(this).dialog("close");
        }

        function checkLength(o, n, min, max) {
            if (o.length > max || o.length < min) {
                updateTips("Дължината на полето '" + n + "' трябва да бъде между " +
                        min + " и " + max + " .");
                return false;
            } else {
                return true;
            }
        }

        function checkRegexp(o, regexp, n) {
            if (!(regexp.test(o))) {
                updateTips(n);
                return false;
            } else {
                return true;
            }
        }

        function updateTips(t) {
            tips
                    .text(t)
                    .addClass("bg-danger");
            setTimeout(function () {
                tips.removeClass("bg-danger", 1500);
            }, 500);
        }

        function clearData() {
            $(':input', 'form').val('').removeAttr('checked').removeAttr('selected');
        }
        ;

        function eventViewIcon(click, openDiv) {
            $(click).click(function () {
                var id = $(this).parents("tr").attr("id");
                $(openDiv).dialog("open");
                recordView(id);
            });
        }

        function buttons(text, icons, clickFunc) {
            if (text === "Отмени") {
                icons = "ui-icon-cancel";
                clickFunc = closeClear;
            }
            var button = {
                text: text,
                icons: {
                    primary: icons
                },
                click: clickFunc

            };
            return button;
        }

        function dialogDefault(selector, width, height, title) {
            $(selector).dialog({
                autoOpen: false,
                modal: true,
                width: width,
                height: height,
                title: title
            });
        }

        function dialogView(selector, width, height, title) {
            dialogDefault(selector, width, height, title);
            $(selector).dialog("option", "buttons",
                    [
                        buttons("Редактирай", "ui-icon-pencil", eventEditButton),
                        buttons("Изтрий", "ui-icon-trash", eventDelButton),
                        buttons("Отмени")
                    ]
                    );
        }


        function dialogAddEdit(selector, width, height, title) {
            dialogDefault(selector, width, height, title);
        }

        function dialogImport(selector, width, height, title) {
            dialogDefault(selector, width, height, title);
            $(selector).dialog("option", "buttons",
                    [
                        buttons("Запиши", "ui-icon-check", recordImport),
                        buttons("Отмени")
                    ]
                    );

        }

        function eventImportButton(clickBut, openDiv) {
            $(clickBut).click(function () {
                $(openDiv).dialog("open");
            });
        }

        function eventAddButton(clickBut, openDiv, title) {
            $(clickBut).click(function () {
                $(openDiv).dialog("open");
                $(openDiv).dialog("option", "title", title);
                $(openDiv).dialog("option", "buttons",
                        [
                            buttons("Добави", "ui-icon-check", recordAdd),
                            buttons("Отмени")
                        ]
                        );
            });
        }

        function eventEditButton() {
            var selector = "#addEditDiv";
            var id = localStorage.currentId;
            $(this).dialog("close");
            $(selector).dialog("open");
            $(selector).dialog("option", "title", "Редактирай запис");
            $(selector).dialog("option", "buttons",
                    [
                        buttons("Обнови", "ui-icon-check", eventUpdateButton),
                        buttons("Отмени")
                    ]
                    );
            recordEdit(id);
        }

        function zodiacAutocomplete(selector) {
            $(function () {
                var availableTags = [
                    "Овен",
                    "Телец",
                    "Близнаци",
                    "Рак",
                    "Лъв",
                    "Дева",
                    "Везни",
                    "Скорпион",
                    "Стрелец",
                    "Козирог",
                    "Водолей",
                    "Риби"
                ];
                $(selector).autocomplete({
                    source: availableTags
                });
            });
        }

        function onReady() {
            $("#clearLS").click(function () {
                localStorage.clear();
            });
            listAllUsers();
            eventAddButton("#addRec", "#addEditDiv", "Нов запис");
            eventImportButton("#importRec", "#importDiv");
            dialogAddEdit("#addEditDiv", 420, 600);
            dialogView("#viewDiv", 420, 500, "Потребител");
            dialogImport("#importDiv", 600, 650, "Импортирай  записи");
            zodiacAutocomplete("#zodiac");
        }
        return {
            ready: function () {
                onReady();
            }
        };
    };
    var proba = list();
    proba.ready();
});