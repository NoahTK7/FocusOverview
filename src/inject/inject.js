chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log("[FocusOverview] " + "Script successfully injected.");
            // ----------------------------------------------------------

            init()

        }
    }, 10);
});

function init() {
    jQuery.ajax({
        url: chrome.extension.getURL('assets/templates/grade-template.html'),
        success: function(html) {
            $(".site-middle").append(html);
        },
        async:false
    });

    const gradeTemplate = $("#gradeTemplate");

    $(".site-menu-group").filter($("[data-index='3']")).children("button").click();

    const classes = $("div.site-menu-dropdown").find(".site-menu-items").children();
    console.log(classes);

    //$(".site-menu-group").filter($("[data-index='3']")).children("button").click();

    const links = [];
    classes.each(function (index, value) {
        links.push($(value).attr("href"));
    });
    console.log(links);

    links.forEach(function (item, index, array) {
        let className = $(classes[index]).attr("title").split(" - ")[0];
        $.ajax({
            url: item,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            },
            success: function (html) {
                console.log("success");
                let newGrade = gradeTemplate.clone();
                newGrade.find(".courseGrade").text($(html).find(".jsStudentAverageCell").text());
                newGrade.find(".courseName a").text(className);
                newGrade.find(".courseName a").attr("href", item);
                newGrade.css("display", "block");
                newGrade.attr("id", className);
                newGrade.attr("class", "gradeRow");
                $("#gradeOverviewTable tbody").append(newGrade);
            },
            async:true
        })
    })
}