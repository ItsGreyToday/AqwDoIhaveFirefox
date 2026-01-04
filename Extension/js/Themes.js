// Make Aqwiki preetier or Darker o_o 

function addCss(fileName) {
  var nbottom = document.querySelectorAll("*")[0];
  var link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = fileName;
  nbottom.appendChild(link);
  
  // Set CSS variable for banner image URL (Firefox compatibility)
  if (fileName.includes("dark.css")) {
    var style = document.createElement("style");
    style.textContent = ":root { --banner-image-url: url('" + browser.runtime.getURL("images/BannerMain.png") + "'); }";
    nbottom.appendChild(style);
  }
}
