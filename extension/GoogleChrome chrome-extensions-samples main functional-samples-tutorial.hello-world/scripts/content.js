// insert_info();
// searchForLink(document.body);
url = chrome.runtime.getURL("aggregate_data.json");
let data
fetch(url)
  .then((response) => response.json()) // file contains json
  .then((json) => { 
    data = json
    console.log(data)
    searchForLink(document.body)}
    );

function searchForLink(tag) {

  if (tag.nodeName == "A") {
    console.log(tag)
    link = tag.href;
    sourceData = getData(link);
    const dataContainer = document.createElement("div");
    element.appendChild(dataContainer);
    dataContainer.appendChild(document.createTextNode(sourceData));
  } else {
    Array.from(tag.children).forEach((child) => searchForLink(child));
  }
}

function getData(link) {
    // console.log(data)
  for (source in data) {
    if (link.includes(source)) {
        console.log("hit")
        return data[source]
    }
  }
}

let currentUrl = window.location.href;
currentUrl = currentUrl.replace("https://","");
currentUrl = currentUrl.replace("/", "");

console.log(currentUrl);

// if (getData(currentUrl))