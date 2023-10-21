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
        img.style.width = "10vw"; 
        dataContainer.appendChild(img);
  
        dataContainer.addEventListener("click", () => {
          box = document.createElement("div")
          box.style.backgroundColor = "yellow"
          dataContainer.appendChild(box)
          box.appendChild(document.createTextNode(`This ${sourceData.Report.Type.toString().toLowerCase()} is considered ${sourceData.Report.Bias.toString().toLowerCase()}. It has a ${sourceData.Report.Accuracy.toString().toLowerCase()} accuracy and is considered to have ${sourceData.Report.Credibility.toString().toLowerCase()}`))
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

// if (getData(currentUrl))