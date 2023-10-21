// insert_info();
// searchForLink(document.body);
url = chrome.runtime.getURL("aggregate_data.json");
let data;
fetch(url)
  .then((response) => response.json()) // file contains json
  .then((json) => {
    data = json;
    console.log(data);
    searchForLink(document.body);
  });

function searchForLink(tag) {
  if (tag.nodeName == "A") {
    console.log(tag);
    link = tag.href;
    sourceData = getData(link);
    if (sourceData != "miss") {
      const dataContainer = document.createElement("div");
      tag.appendChild(dataContainer);
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
      
      img.style.width = "10vw";
      dataContainer.appendChild(img);
    }
  } else {
    Array.from(tag.children).forEach((child) => searchForLink(child));
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

let currentUrl = window.location.href;
currentUrl = currentUrl.replace("https://","");
currentUrl = currentUrl.replace("/", "");

console.log(currentUrl);

// if (getData(currentUrl))