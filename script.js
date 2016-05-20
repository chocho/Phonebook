$(document).ready(function () {
    var list = function () {
        // Private variables and functions

        var tips = $(".validateTips");
        var properties = ["phone", "name", "place", "gender", "zodiac", "note"];
        var availableZodiac = ["Овен", "Телец", "Близнаци", "Рак", "Лъв", "Дева",
            "Везни", "Скорпион", "Стрелец", "Козирог", "Водолей", "Риби"];

        /**
         * A counter for id's in LocalStorage .
         * @return {String} localStorage.userId - An id number, stored as a string.
         */
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

        /**
         * Fetches all users , stored in LocalStorage.
         * @param {String} item - An item to fetch.
         * @return {Object} users -  All users, stored in objects of an object.
         */
        function fetchUsers(item) {
            var users = JSON.parse(localStorage.getItem(item));
            return users;
        }

        /**
         * Set stringified user objects in LocalStorage .
         * @param {String} localStItem - A name for store in LocalStorage.
         * @param {String} item - An item to store.
         */
        function setUsers(localStItem, item) {
            localStorage.setItem(localStItem, JSON.stringify(item));
        }

        /**
         * Fetches all users from LocalStorage and lists them in a table .
         * @param {String} users - A LocalStorage object of users to fetch.
         */
        function listAllUsers(users) {
            var user = {};
            var allUsers = fetchUsers(users);
            for (user in allUsers) {
                tableRecordAppend(user, allUsers[user]);
            }
        }

        /**
         * Escapes unallowed characters, entered by a user.
         * @param {String} str - A string to escape.
         * @return {String} str - The escaped string.
         */
        function htmlEscape(str) {
            return String(str)
                    .replace(/&/g, '&amp;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
        }

        /**
         * Un-escapes an escaped string.
         * @param {String} value - An escaped string for un-escape.
         * @return {String} value - The un-escaped string.
         */
        function htmlUnescape(value) {
            return String(value)
                    .replace(/&quot;/g, '"')
                    .replace(/&#39;/g, "'")
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>')
                    .replace(/&amp;/g, '&');
        }

        /**
         * Close a dialog and clears the input data and tips (if any).
         */
        function closeClearData() {
            $(this).dialog("close");
            clearData();
            clearTips();
        }

        /**
         * Clears tips, if any.
         */
        function clearTips() {
            if (tips.text !== "") {
                tips.text("");
            }
        }

        /**
         * Removes a LocalStorage record and it's table row.
         */
        function eventDelButton() {
            var id = localStorage.currentId;
            $(this).dialog("close");
            var isOpen = $("#viewDiv").dialog("isOpen");
            if (isOpen) {
                $("#viewDiv").dialog("close");
            }
            $("tr#" + id + "").remove();
            recordRemove(id);
        }

        /**
         * Triggers a record update.
         */
        function eventUpdateButton() {
            var id = localStorage.currentId;
            var valid = recordUpdate(id);
            if (valid) {
                $(this).dialog("close");
                clearData();
            }
        }

        /**
         * Opens a dialog to update values of a record .
         * @param {String} target - A button to  click.
         * @param {String} openDiv - A div to open.
         */
        function eventEditIcon(target, openDiv) {
            $(target).click(function () {
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

        /**
         * Removes a LocalStorage record and i'ts table row.
         * @param {String} target - A button to click.
         */
        function eventTrashIcon(target) {
            $(target).click(function () {
                var id = $(this).parents("tr").attr("id");
                localStorage.currentId = id;
                dialogTrashRec();
            });
        }

        /**
         * Opens a dialog for delete confirmation.
         */
        function dialogTrashRec() {
            $("#dialog-confirm").dialog("open");
            $("#dialog-confirm").dialog("option", "buttons",
                    [
                        buttons("Изтрий", "ui-icon-trash", eventDelButton),
                        buttons("Отмени")
                    ]
                    );

        }

        /**
         * Checks if a phone and a name exists.
         * @param {Object} allUsers - All stored users.
         * @param {Object} thisUser - The current user.
         * @param {String} id - Exists only when checks through update of a record.
         * @return {Boolean} - The result of the check.
         */
        function phoneNameCheck(allUsers, thisUser, id) {
            var user = {};
            var currentPhone = "";
            var currentName = "";
            for (user in allUsers) {
                if (id !== undefined) {
                    if (user === id) {
                        continue;
                    }
                } else {
                    id = 0;
                }
                currentPhone = allUsers[user].phone;
                currentName = allUsers[user].name;
                if (currentPhone === thisUser.phone) {
                    updateTips("Телефон " + currentPhone + " вече съществува.");
                    return  false;
                } else if (currentName === thisUser.name) {
                    updateTips("Името " + currentName + " вече съществува.");
                    return  false;
                }
            }
            return true;
        }

        /**
         * Checks if entered values are valid.
         * @param {String} phone - Entered phone.
         * @param {String} name - Entered name.
         * @param {String} place - Entered place.
         * @param {String} gender - Entered gender.
         * @param {String} zodiac - Entered zodiac.
         * @param {String} note - Entered note.
         * @return {Boolean} - The result of the check.
         */
        function inputValidation(phone, name, place, gender, zodiac, note) {
            var valid = true;
            valid = valid && checkLength(phone, "Телефон", 5, 12);
            valid = valid && checkRegexp(phone, /[0+]\d+/, "Телефонът трябва да започва с + или 0, последвани от цифри 0-9");
            valid = valid && checkLength(name, "Име", 1, 30);
            valid = valid && checkLength(place, "Населено място", 0, 30);
            valid = valid && checkRegexp(gender, /[мж]{1}/, "Моля, изберете пол.");
            valid = valid && checkLength(zodiac, "Зодия", 0, 8);
            if (zodiac !== '') {
                valid = valid && checkRegexp(zodiac, /Овен|Телец|Близнаци|Рак|Лъв|Дева|Везни|Скорпион|Стрелец|Козирог|Водолей|Риби/, "Невалидна зодия.");
            }
            valid = valid && checkLength(note, "Бележки", 0, 500);
            return valid;
        }

        /**
         * Checks if entered values are valid.
         * @param {String} rowId - An id of a table row.
         * @param {Object} fields - Fields to  append or replace.
         * @param {String} edit - If exists, the row will be replaced, not appended.
         */
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

        /**
         * Checks if entered values are valid.
         * @param {Object} fields - Fields to append.
         * @param {String} rowId - An id of a table row.
         * @return {String} row - The row with fields appended.
         */
        function appending(fields, rowId) {
            var field = "";
            var imgCell = "<img  class='view' src='images/view.png' width='25' height='25' alt='View icon' title='Виж запис' />";
            var editCell = "<img  class='edit' src='images/edit.png' width='25' height='25' alt='Edit icon' title='Редактирай запис' />";
            var trashCell = "<img  class='trash' src='images/trash.png' width='25' height='25' alt='Delete icon' title='Изтрий запис' />";
            var row = "<tr class='row' id='" + rowId + "'>";
            for (field in fields) {
                if (field === "note") {
                    continue;
                }
                row += "<td>" + fields[field] + "</td>";
            }
            row += "<td>" + imgCell + editCell + trashCell + "</td></tr>";
            return row;
        }

        /**
         * If valid, adds a record to LocalStorage and to a table.
         */
        function recordAdd() {
            var valid = true;
            var thisUser = {};
            var char = "";
            thisUser = foreachUser(htmlEscape, thisUser, properties);
            for (char in thisUser) {
                if (char === undefined) {
                    char = "";
                }
            }
            valid = inputValidation(thisUser.phone, thisUser.name, thisUser.place, thisUser.gender, thisUser.zodiac, thisUser.note);
            var allUsers = fetchUsers("users");

            if (valid && allUsers) {
                valid = phoneNameCheck(allUsers, thisUser);
            } else {
                allUsers = {};
            }

            if (valid) {
                idCounter();
                allUsers[localStorage.userId] = thisUser;
                tableRecordAppend(localStorage.userId, thisUser);
                $(this).dialog("close");
                setUsers("users", allUsers);
                clearData();
                clearTips();
            }
        }

        /**
         * Default function to fetch a record and place it in a dialog window.
         * @param {String} id - An id of a record to fetch.
         * @param {String} mode - Checks if the mode is for viewing or editing.
         */
        function  recordViewEditDef(id, mode) {
            var allUsers = fetchUsers("users");
            localStorage.currentId = id;
            var currentUser = allUsers[id];
            var prop = 0;
            var property = '';
            var selector = '';
            var currProperty = '';
            for (prop; prop < properties.length; prop++) {
                currProperty = properties[prop];
                property = htmlUnescape(currentUser[currProperty]);
                if (mode === "view") {
                    selector = "#" + mode + "-" + currProperty;
                    $(selector).text(property);
                } else {
                    selector = "#" + currProperty;
                    $(selector).val(property);
                }
            }
        }

        /**
         * Fetches a record and places it in a dialog window for viewing.
         * @param {String} id - An id of a record to fetch.
         */
        function recordView(id) {
            recordViewEditDef(id, "view");
        }

        /**
         * Fetches a record and places it in a dialog window for  editing.
         * @param {String} id - An id of a record to fetch.
         */
        function recordEdit(id) {
            recordViewEditDef(id, "");
        }

        /**
         * Default function to fetch a record and place it in a dialog window.
         * @param {Function} func - Function that applies to properties.
         * @param {Object} userObject - A user object.
         * @param {Array} properties - Properties that passes the function and 
         * appends to the user object.
         * @return {Object} userObject - The user object with properties added.
         */
        function foreachUser(func, userObject, properties) {
            var prop = 0;
            for (prop; prop < properties.length; prop++) {
                var property = properties[prop];
                var selector = "#" + property + "";
                userObject[property] = func($(selector).val());
            }
            return userObject;
        }

        /**
         * Updates a user record in LocalStorage, if passes the validation.
         * @param {String} id - An id of a record.
         * @return {Boolean} - The result of the update process.
         */
        function recordUpdate(id) {
            var valid = true;
            var thisUser = {};
            thisUser = foreachUser(htmlEscape, thisUser, properties);
            valid = inputValidation(thisUser.phone, thisUser.name, thisUser.place, thisUser.gender, thisUser.zodiac, thisUser.note);
            var allUsers = fetchUsers("users");
            if (valid && allUsers) {
                valid = phoneNameCheck(allUsers, thisUser, id);
            } else {
                allUsers = {};
            }
            if (valid) {
                tableRecordAppend(id, thisUser, true);
                allUsers[id] = thisUser;
                setUsers("users", allUsers);
                clearTips();
                return true;
            } else {
                return false;
            }
        }

        /**
         * Removes a record from LocalStorage.
         * @param {String} id - An id of a record.
         */
        function recordRemove(id) {
            var allUsers = fetchUsers("users");
            delete allUsers[id];
            setUsers("users", allUsers);
        }

        /**
         * Imports many records, if pass the validation.
         */
        function recordImport() {
            var valid = true;
            var user = [];
            var entered = $("#textAr").val();
            if (!entered) {
                updateTips("Моля, въведете данни.");
                return valid = false;
            }
            var rowsEntered = entered.match(/.+$/gm); //returns all entered rows
            var allUsers = fetchUsers("users");
            if (!allUsers) {
                allUsers = {};
            }
            var num = 0;
            for (num; num < rowsEntered.length; num++) {
                var thisUser = {};
                user = rowsEntered[num].split("\t"); //splits fields by Tab
                var prop = 0;
                for (prop; prop < properties.length; prop++) {
                    var property = properties[prop];
                    if (user[num]) {
                        thisUser[property] = user[prop];
                    } else {
                        thisUser[property] = "";
                    }
                }

                valid = inputValidation(thisUser.phone, thisUser.name, thisUser.place, thisUser.gender, thisUser.zodiac, thisUser.note);
                if (valid && allUsers) {
                    valid = phoneNameCheck(allUsers, thisUser);
                } else {
                    allUsers = {};
                }
                if (valid) {
                    idCounter();
                    tableRecordAppend(localStorage.userId, thisUser);
                    allUsers[localStorage.userId] = thisUser;
                    setUsers("users", allUsers);
                    clearTips();
                } else {
                    return false;
                }
            }
            setUsers("users", allUsers);
            $(this).dialog("close");
        }

        /**
         * Checks for valid length of an input.
         * @param {String} input - A user input.
         * @param {String} name - The name of the input field.
         * @param {Number} min - A min length.
         * @param {Number} max - A max length.
         * @return {Boolean} - The result of the check.
         */
        function checkLength(input, name, min, max) {
            if (input.length > max || input.length < min) {
                updateTips("Дължината на полето '" + name + "' трябва да бъде между " +
                        min + " и " + max + " .");
                return false;
            } else {
                return true;
            }
        }

        /**
         * Checks for valid characters of an input.
         * @param {String} input - A user input.
         * @param {RegExp} regexp - A regular expression to determine  valid characters.
         * @param {Number} tip - A tip to show if characters are not valid.
         * @return {Boolean} - The result of the check.
         */
        function checkRegexp(input, regexp, tip) {
            if (!(regexp.test(input))) {
                updateTips(tip);
                return false;
            } else {
                return true;
            }
        }

        /**
         * Shows a tip, adds and removes a class to the tip paragraph .
         * @param {String} tip - A user input.
         */
        function updateTips(tip) {
            tips
                    .text(tip)
                    .addClass("bg-danger");
        }

        /**
         * Clears values from all user input fields .
         */
        function clearData() {
            $(':input', 'form').val('').removeAttr('checked').removeAttr('selected');
        }

        /**
         * Bind an event handler to a view element (icon) button that open
         *   a div with filled values.
         * @param {String} target - An element to click (icon).
         * @param {String} openDiv - A modal dialog div to open.
         */
        function eventViewIcon(target, openDiv) {
            $(target).click(function () {
                var id = $(this).parents("tr").attr("id");
                $(openDiv).dialog("open");
                recordView(id);
            });
        }

        /**
         * Default function to create buttons in a dialog modal window.
         * @param {String} text - A text for a button.
         * @param {String} icons - Icons for a button.
         * @param {String} clickFunc - An event handler to attach.
         * @return {Object} button - The button with the text, icons and the event handler attached.
         */
        function buttons(text, icons, clickFunc) {
            if (text === "Отмени") {
                icons = "ui-icon-cancel";
                clickFunc = closeClearData;
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

        /**
         * Default modal dialog properties.
         * @param {String} selector - A valid selector.
         * @param {Number} width - Width for the dialog.
         * @param {Number} height - Height for the dialog.
         * @param {String} title - A title for the dialog.
         */
        function dialogDefault(selector, width, height, title) {
            $(selector).dialog({
                autoOpen: false,
                modal: true,
                width: width,
                height: height,
                title: title
            });
        }

        /**
         * Creates a dialog to view a record.
         * @param {String} selector - A valid selector.
         * @param {Number} width - Width for the dialog.
         * @param {Number} height - Height for the dialog.
         * @param {String} title - A title for the dialog.
         */
        function dialogView(selector, width, height, title) {
            dialogDefault(selector, width, height, title);
            $(selector).dialog("option", "buttons",
                    [
                        buttons("Редактирай", "ui-icon-pencil", eventEditButton),
                        buttons("Изтрий", "ui-icon-trash", dialogTrashRec),
                        buttons("Отмени")
                    ]
                    );
        }

        /**
         * Creates a dialog to edit a record.
         * @param {String} selector - A valid selector.
         * @param {Number} width - Width for the dialog.
         * @param {Number} height - Height for the dialog.
         * @param {String} title - A title for the dialog.
         */
        function dialogAddEdit(selector, width, height, title) {
            dialogDefault(selector, width, height, title);
        }

        /**
         * Creates a dialog to confirm deletion of a record.
         * @param {String} selector - A valid selector.
         * @param {Number} width - Width for the dialog.
         * @param {Number} height - Height for the dialog.
         * @param {String} title - A title for the dialog.
         */
        function dialogDeleteConfirm(selector, width, height, title) {
            dialogDefault(selector, width, height, title);
        }

        /**
         * Creates a dialog to import many records.
         * @param {String} selector - A valid selector.
         * @param {Number} width - Width for the dialog.
         * @param {Number} height - Height for the dialog.
         * @param {String} title - A title for the dialog.
         */
        function dialogImport(selector, width, height, title) {
            dialogDefault(selector, width, height, title);
            $(selector).dialog("option", "buttons",
                    [
                        buttons("Запиши", "ui-icon-check", recordImport),
                        buttons("Отмени")
                    ]
                    );

        }


        /**
         * Bind an event handler to the Import button that open a modal window
         * for importing many records.
         * @param {String} target - A button to click.
         * @param {String} openDiv - A modal dialog div to open.
         */
        function eventImportButton(target, openDiv) {
            $(target).click(function () {
                $(openDiv).dialog("open");
            });
        }

        /**
         * Bind an event handler to the Add button that open a modal window
         * for adding a record.
         * @param {String} target - A button to click.
         * @param {String} openDiv - A modal dialog div to open.
         * @param {String} title - A title to set.
         */
        function eventAddButton(target, openDiv, title) {
            $(target).click(function () {
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

        /**
         * Bind an event handler to the Edit button that open a modal window
         * to edit a record.
         */
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

        /**
         * Enables users to quickly find and select from a pre-populated list of
         * values as they type in the zodiac field.
         * @param {String} target - A field to type in.
         */
        function zodiacAutocomplete(target) {
            $(function () {
                $(target).autocomplete({
                    source: availableZodiac
                });
            });
        }

        function changePointer() {
            $(".trash, .view, .edit").hover(
                    function () {
                        $(this).css('cursor', 'pointer');
                    }, function () {
                $(this).css('cursor', 'initial');
            }
            );
        }

        /**
         * Determines a predefined set of function to execute when a document
         * is ready (loaded).
         */
        function onReady() {
            listAllUsers("users");
            eventAddButton("#addRec", "#addEditDiv", "Нов запис");
            eventImportButton("#importRec", "#importDiv");
            dialogAddEdit("#addEditDiv", 420, 650, '');
            dialogDeleteConfirm("#dialog-confirm", 320, 180, 'Изтриване на потребител?');
            dialogView("#viewDiv", 420, 550, "Потребител");
            dialogImport("#importDiv", 600, 650, "Импортирай  записи");
            zodiacAutocomplete("#zodiac");
            changePointer();
        }

        // Public API
        return {
            ready: function () {
                onReady();
            }
        };
    };
    var phonebook = list();
    phonebook.ready();
});