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

const links = [];
let classes, gradeTemplate;

function init() {
    jQuery.ajax({
        url: chrome.extension.getURL('assets/templates/grade-template.html'),
        success: function (html) {
            $(".site-middle").append(html);
        },
        async: false
    });
    //document.getElementById("updateButton").addEventListener("click", update(true));
    $("#updateButton").click(function () {
        console.log("button clicked.");
        update(true);
    });

    gradeTemplate = $("#gradeTemplate");

    let assignmentButton = $(".site-menu-group").filter($("[data-index='3']")).children("button");
    assignmentButton.click();
    $(".site-content").click();

    classes = $("div.site-menu-dropdown").find(".site-menu-items").children();
    console.log(classes);

    classes.each(function (index, value) {
        links.push($(value).attr("href"));
    });
    console.log(links);

    update(false);
}

function update(force) {
    chrome.storage.local.get(['lastUpdate'], function (result) {
        let useCache;

        if (force) {
            //remove current elements
            $(".gradeRow").remove();
        } else { //false -> reg logic
            console.log(result.lastUpdate);
            console.log(new Date().getTime() - new Date(result.lastUpdate).getTime());
            useCache = new Date().getTime() - new Date(result.lastUpdate).getTime() < 1 * 60000;
        }

        links.forEach(function (item, index, array) {
            let className = $(classes[index]).attr("title").split(" - ")[0];

            let newGrade = gradeTemplate.clone();

            newGrade.find(".courseName a").text(className);
            newGrade.find(".courseName a").attr("href", item);
            newGrade.css("display", "block");
            newGrade.attr("id", className);
            newGrade.attr("class", "gradeRow");
            $("#gradeOverviewTable tbody").append(newGrade);

            if (!useCache || force) {
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
        if (!useCache) chrome.storage.local.set({"lastUpdate": new Date().toString()});
    });
}