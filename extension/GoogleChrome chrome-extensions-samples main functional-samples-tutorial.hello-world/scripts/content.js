// insert_info();
// searchForLink(document.body);
url = chrome.runtime.getURL("aggregate_data.json");
let data;
let currentUrl = window.location.host;

console.log(currentUrl);

checked_urls = new Set();


fetch(url)
    .then((response) => response.json()) // file contains json
    .then((json) => {
        data = json;
        console.log(data);
        Array.from(document.body.children).forEach(child => {
            searchForLink(child, document.body);
        })

    });

function searchForLink(tag, parent) {
    let sourceData;

    if (tag.nodeName == "A") {
        console.log(tag);
        link = tag.href;
        host = tag.host;

        sourceData = getData(link);
        if (sourceData != "miss" && getData(currentUrl) == "miss" && !checked_urls.has(host)) {
            checked_urls.add(host);
            const dataContainer = document.createElement("div");
            dataContainer.style.display = "inline-flex"

            parent.appendChild(dataContainer);
            let img = new Image();
            if (sourceData.Report.Bias == "LEAST BIASED") {
                img.src = chrome.runtime.getURL("0.png");
            } else if (sourceData.Report.Bias == "LEFT-CENTER") {
                img.src = chrome.runtime.getURL("-1.png");
            } else if (sourceData.Report.Bias == "LEFT") {
                img.src = chrome.runtime.getURL("-2.png");
            } else if (sourceData.Report.Bias == "EXTREME LEFT") {
                img.src = chrome.runtime.getURL("-3.png");
            } else if (sourceData.Report.Bias == "EXTREME RIGHT") {
                img.src = chrome.runtime.getURL("3.png");
            } else if (sourceData.Report.Bias == "RIGHT-CENTER") {
                img.src = chrome.runtime.getURL("1.png");
            } else if (sourceData.Report.Bias == "RIGHT") {
                img.src = chrome.runtime.getURL("2.png");
            }
            img.style.height = "1.5vw";
            img.style.marginRight = "10px"
            img.style.marginLeft = "10px"
            img.style.borderRadius = "15%";

            dataContainer.appendChild(img);
            createCircle(dataContainer, sourceData["Report"]["Accuracy"]);
            br = document.createElement("br");
            dataContainer.appendChild(br);
            dataContainer.addEventListener("click", () => {

                if (dataContainer.parentElement.getElementsByClassName('information_box').length != 0){
                    box = dataContainer.parentElement.getElementsByClassName('information_box')[0];
                    if(box.style.display == "none"){
                        box.style.display = "block";
                    }
                    else{
                        box.style.display = "none";
                    }
                }
                else{
                    box = document.createElement("div")
                    box.className = 'information_box'
                    box.style.paddingTop = "5px"
                    box.style.paddingBottom = "5px"
                    box.style.paddingLeft = "5px"
                    box.style.paddingRight = "5px"
                    box.style.backgroundColor = "#d9dbde";
                    box.style.borderRadius = "5px";

                    dataContainer.parentElement.appendChild(box)
                    let info = document.createElement("div")
                    info.style.color = "#000000"
                    info.innerHTML = sourceData.Analysis + "\n"
                    //info.style.paddingTop = "20px"
                    box.appendChild(info)
                }

            })
        }
    } else {
        Array.from(tag.children).forEach((child) => searchForLink(child, tag));
    }
}

function getData(link) {
    // console.log(data)
    for (source in data) {
        if (link.includes(source)) {
            console.log("hit");
            return data[source];
        }
    }
    return "miss";
}

function createCircle(link_element, grade) {
    // Create a new div element
    var circle = document.createElement("div");

    // Set the width and height to make it a circle
    circle.style.width = "1.5vw";
    circle.style.height = "1.5vw";

    // Set the background color or other styles as needed
    circle.style.backgroundColor = "blue";

    color_pairs = {
        "VERY LOW": "#ff0000",
        "LOW": "#ff8000",
        "MIXED": "#ffff00",
        "MOSTLY FACTUAL": "#a0ff00",
        "HIGH": "#33ff00",
        "VERY HIGH": "#00ff66"
    }

    if (grade in color_pairs) {
        circle.style.backgroundColor = color_pairs[grade];
    }
    circle.style.borderRadius = "10%";
    // Append the circle to a container div
    child = link_element.appendChild(circle);

}


// if (getData(currentUrl))