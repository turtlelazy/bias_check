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
  if (tag.nodeName == "A") {
    console.log(tag);
    link = tag.href;
    host = tag.host;
    console.log(link + "ITS HERE BABY")
    sourceData = getData(link);
    if (sourceData != "miss" && getData(currentUrl) == "miss" && !checked_urls.has(host)) {
      checked_urls.add(host);
      const dataContainer = document.createElement("div");
      dataContainer.style.display = "inline-flex"
      //dataContainer.style.paddingLeft = "30px"

      dataContainer.classList.add("analysis_div");

      parent.appendChild(dataContainer);
      let img = new Image();
      if (sourceData.Report.Bias == "LEAST BIASED") {
        img.src = chrome.runtime.getURL("0.png");
      } else if (sourceData.Report.Bias == "LEFT-CENTER") {
        img.src = chrome.runtime.getURL("-1.png");
      } else if (sourceData.Report.Bias == "LEFT") {
        img.src = chrome.runtime.getURL("-2.png");
      } else if (sourceData.Report.Bias == "EXTREME LEFT" || sourceData.Report.Bias == "FAR LEFT") {
        img.src = chrome.runtime.getURL("-3.png");
      } else if (sourceData.Report.Bias == "EXTREME RIGHT" || sourceData.Report.Bias == "FAR RIGHT" || sourceData.Report.Bias == "FAR LEFT") {
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
      createCircle(dataContainer, sourceData.Report["Factual Reporting"]);
      //$(".analysis_div").css('display', 'inline-block');

    }
  } else {
    Array.from(tag.children).forEach((child) => searchForLink(child, tag));
  }
}

function getData(link) {
  // console.log(data)
  for (source in data) {
    if (link.includes(source.replace("www.",""))) {
      console.log("hit");
      return data[source];
    }
  }
  return "miss";
}

function createCircle(link_element,grade) {
  // Create a new div element
  var circle = document.createElement("div");

  // Set the width and height to make it a circle
  circle.style.width = "1.5vw";
  circle.style.height = "1.5vw";

  // Set the background color or other styles as needed
  circle.style.backgroundColor = "red";

  color_pairs = {
    "VERY LOW":"#ff0000",
    "LOW":"#ff8000",
    "MIXED": "#ffff00",
    "MOSTLY FACTUAL":"#a0ff00",
    "HIGH":"#33ff00",
    "VERY HIGH":"#00ff66"
  }

  if(grade in color_pairs){
    circle.style.backgroundColor = color_pairs[grade];
  }
  circle.style.borderRadius = "10%";
  // Append the circle to a container div
  child = link_element.appendChild(circle);
  
}


// if (getData(currentUrl))