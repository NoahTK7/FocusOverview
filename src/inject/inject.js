chrome.extension.sendMessage({}, function (response) {
    let readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);

            // ----------------------------------------------------------
            // This part of the script triggers when page is done loading
            console.log("[FocusOverview] " + "Script successfully injected.");
            // ----------------------------------------------------------

            init();

        }
    }, 10);
});

function init() {
    jQuery.ajax({
        url: chrome.extension.getURL('assets/templates/grade-template.html'),
        success: function (html) {
            $(".site-middle").append(html);
        },
        async: false
    });

    const gradeTemplate = $("#gradeTemplate");


    let assignmentButton = $(".site-menu-group").filter($("[data-index='3']")).children("button");
    assignmentButton.click();

    const classes = $("div.site-menu-dropdown").find(".site-menu-items").children();
    console.log(classes);

    const links = [];
    classes.each(function (index, value) {
        links.push($(value).attr("href"));
    });
    console.log(links);


    chrome.storage.local.get(['lastUpdate'], function (result) {
        console.log(result.lastUpdate);
        console.log(new Date().getTime() - new Date(result.lastUpdate).getTime());
        let useCache = new Date().getTime() - new Date(result.lastUpdate).getTime() < 1 * 60000;

        links.forEach(function (item, index, array) {
            let className = $(classes[index]).attr("title").split(" - ")[0];

            let newGrade = gradeTemplate.clone();

            newGrade.find(".courseName a").text(className);
            newGrade.find(".courseName a").attr("href", item);
            newGrade.css("display", "block");
            newGrade.attr("id", className);
            newGrade.attr("class", "gradeRow");
            $("#gradeOverviewTable tbody").append(newGrade);

            if (!useCache) {
                console.log("ajax");
                $.ajax({
                    url: item,
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(textStatus);
                    },
                    success: function (html) {
                        let gradeAvg = $(html).find(".jsStudentAverageCell").text();
                        newGrade.find(".courseGrade").text(gradeAvg);
                        let data = {};
                        data[className] = gradeAvg;
                        chrome.storage.local.set(data);
                    },
                    async: true,
                });
            } else {
                console.log("cached values");
                //gradeAvg = window.localStorage.getItem(className);
                chrome.storage.local.get(null, function (result) {
                    console.log(result);
                    console.log(result[className]);
                    newGrade.find(".courseGrade").text(result[className]);
                });
            }
        });
        if (!useCache) chrome.storage.local.set({"lastUpdate": new Date().toString()}); //window.localStorage.setItem("lastUpdate", new Date());
    });
}