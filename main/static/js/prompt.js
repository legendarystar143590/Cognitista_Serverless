$(document).ready(function () {
    var pid = 1;
    var sid = '';

    // Set a click event handler for the span element with id "mySpan"
    $(".fn__model_item").click(function () {
        alert("Hello World!");
    });

    // Attach click event for "Edit" anchor tag
    $('.fn__icon_popup a:contains("Edit")').on('click', function (e) {
        e.preventDefault();
        var promptId = $(this).closest('.fn__prompt_item').attr('id');
        sid = promptId;
        console.log(promptId);
        var title = $(`#${promptId} .title_holder`).text().trim();
        var prompt = $(`#${promptId} .item_body`).text().trim();
        $("#prompt_title_input").val(title);
        $("#prompt_body_input").val(prompt);
    });

    // Attach click event for "Delete" anchor tag
    $('.fn__icon_popup a:contains("Delete")').on('click', function (e) {
        e.preventDefault();
        var promptId = $(this).closest('.fn__prompt_item').attr('id');
        var sendData = {
            id: promptId,
        };

        var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
        $.ajax({
            url: '/deletePrompt',
            method: 'POST',
            headers: { 'X-CSRFToken': csrfToken },
            data: sendData,
            success: function (result) {
                if (result.success === "ok") {
                    if ($(`#${promptId}`)) $(`#${promptId}`).remove();
                }
                else {
                    alert("You can't delete the prompt!");
                }
            },
            error: function (xhr, status, error) {
                console.error('Error occurred: ', error);
                alert("Error occurred!")
            }
        });
    });

    $("#promptClearBtn").on('click', function (e) {
        $("#prompt_title_input").val('');
        $("#prompt_body_input").val('');
    });

    $("#promptAddBtn").on('click', function (e) {
        var title = $("#prompt_title_input").val().trim();
        var prompt = $("#prompt_body_input").val().trim();
        if (title == '') {
            $("#prompt_title_input").focus();
            return;
        }
        if (prompt == '') {
            $("#prompt_body_input").focus();
            return;
        }
        var sendData = {
            title: title,
            prompt: prompt,
        };

        var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
        $.ajax({
            url: '/addPrompt',
            method: 'POST',
            headers: { 'X-CSRFToken': csrfToken },
            data: sendData,
            success: function (result) {
                if (result.success === "ok") {
                    var promptItem = $(`<div id="${result.id}" class="fn__prompt_item"> \
                                <div class="item_header">\
                                    <div class="title_holder">${title}</div>\
                                    <div class="item_options">\
                                        <div class="fn__icon_options medium_size align_right">\
                                            <a href="#" class="fn__icon_button">\
                                                <span class="dots"></span>\
                                            </a>\
                                            <div class="fn__icon_popup">\
                                                <ul>\
                                                    <li>\
                                                        <a href="#">Edit</a>\
                                                    </li>\
                                                    <li class="high_priorety">\
                                                        <a href="#">Delete</a>\
                                                    </li>\
                                                </ul>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>\
                                <div class="item_body">${prompt}</div>\
                            </div>`);

                    $(".prompt_list").prepend(promptItem);

                    sid = `newppt${pid}`;
                    // Attach click event for "Edit" anchor tag
                    $('.fn__icon_popup a:contains("Edit")').on('click', function (e) {
                        e.preventDefault();
                        var promptId = $(this).closest('.fn__prompt_item').attr('id');
                        sid = promptId;
                        console.log(promptId);
                        var title = $(`#${promptId} .title_holder`).text().trim();
                        var prompt = $(`#${promptId} .item_body`).text().trim();
                        $("#prompt_title_input").val(title);
                        $("#prompt_body_input").val(prompt);
                    });

                    // Attach click event for "Delete" anchor tag
                    $('.fn__icon_popup a:contains("Delete")').on('click', function (e) {
                        e.preventDefault();
                        var promptId = $(this).closest('.fn__prompt_item').attr('id');
                        var sendData = {
                            id: promptId,
                        };

                        var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
                        $.ajax({
                            url: '/deletePrompt',
                            method: 'POST',
                            headers: { 'X-CSRFToken': csrfToken },
                            data: sendData,
                            success: function (result) {
                                if (result.success === "ok") {
                                    if ($(`#${promptId}`)) $(`#${promptId}`).remove();
                                }
                                else {
                                    alert("You can't delete the prompt!");
                                }
                            },
                            error: function (xhr, status, error) {
                                console.error('Error occurred: ', error);
                                alert("Error occurred!")
                            }
                        });
                    });

                    pid += 1;
                }
                else {
                    alert("You can't save the prompt!");
                }
            },
            error: function (xhr, status, error) {
                console.error('Error occurred: ', error);
                alert("Error occurred!")
            }
        });
    });

    $("#promptUpdateBtn").on('click', function (e) {
        if (sid == '') {
            alert("Edit any one."); return;
        }

        var title = $("#prompt_title_input").val().trim();
        var prompt = $("#prompt_body_input").val().trim();
        if (title == '') {
            $("#prompt_title_input").focus(); return;
        }
        if (prompt == '') {
            $("#prompt_body_input").focus(); return;
        }
        var sendData = {
            id: sid,
            title: title,
            prompt: prompt,
        };

        var csrfToken = $('input[name="csrfmiddlewaretoken"]').val();
        $.ajax({
            url: '/updatePrompt',
            method: 'POST',
            headers: { 'X-CSRFToken': csrfToken },
            data: sendData,
            success: function (result) {
                if (result.success === "ok") {
                    $(`#${sid} .title_holder`).text(title);
                    $(`#${sid} .item_body`).text(prompt);
                }
                else {
                    alert("You can't update the prompt!");
                }
            },
            error: function (xhr, status, error) {
                console.error('Error occurred: ', error);
                alert("Error occurred!")
            }
        });

    });
});
