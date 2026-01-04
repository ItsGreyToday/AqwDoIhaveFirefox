/* Main.js */ 

const bank_icon = browser.runtime.getURL("images/in_bank.png")
const inv_icon = browser.runtime.getURL("images/in_inventory.png")
const price_icon = browser.runtime.getURL("images/price_icon.png");
const drop_icon = browser.runtime.getURL("images/monster_drop.png")
const collectionchest_icon = browser.runtime.getURL("images/collectionchest_icon.png")
const inventory_update_icon = browser.runtime.getURL("images/update_inventory.png")
const tofarm_icon = browser.runtime.getURL("images/WICF_button.png")

const mergeshop_icon = browser.runtime.getURL("images/mergeshop_icon.png")
const quest_icon = browser.runtime.getURL("images/quest_icon.png")
const shop_icon = browser.runtime.getURL("images/shop_icon.png")
const treasurechest_icon = browser.runtime.getURL("images/treasurechest_icon.png")
const whellofdoom_icon = browser.runtime.getURL("images/whellofdoom_icon.png")
const normal_icon = browser.runtime.getURL("images/normal_icon.png")

const wiki_searchpage = "aqwwiki.wikidot.com/search-items"
var found = 0 
var filterMergeAc = false 


// WIP stuff 
function resetFilterMerge() {
	var elementList = document.querySelectorAll("tr")
	
	for (var x = 0; x < elementList.length; x++) { 
		if (elementList[x].querySelectorAll("td").length == 3) { 
			elementList[x].hidden = false  
		}
	}
}


function TagFilterMerge(normal,ac,legend) {
	var hideNormal = !normal 
	var hideAc = !ac 
	var hideLegend = !legend 
	
	var elementList = document.querySelectorAll("tr")
	
	for (var x = 0; x < elementList.length; x++) { 
		if (elementList[x].querySelectorAll("td").length == 3) {
			
			checkAc = elementList[x].innerHTML.includes("acsmall.png")
			checkLegend = elementList[x].innerHTML.includes("legendsmall.png")
			checkNormal = !checkAc & !checkLegend
			
			//alert(checkAc+"  "+checkLegend+"  "+checkNormal+"\n"+hideAc+"  "+hideLegend+"  "+hideNormal+"\n")
			

			if (hideLegend == false & hideAc == false & hideNormal == true) {
				if (checkNormal == true) {
					elementList[x].hidden = true 
				} 
				if (checkAc == true & checkLegend == false) {
					elementList[x].hidden = true 
				} 
				if (checkAc == false & checkLegend == true) {
					elementList[x].hidden = true 
				} 
				
			} else if (hideLegend == false & hideAc == true & hideNormal == true) {
				if (checkLegend == false) {
					elementList[x].hidden = true 
				}
			} else if (hideLegend == true & hideAc == true & hideNormal == true) {

			} else if (hideLegend == true & hideAc == false & hideNormal == true) {
				if (!checkAc == true) {
					elementList[x].hidden = true 
				}
			} else if (hideLegend == false & hideAc == true & hideNormal == false) {
				if (checkAc == true | checkNormal == true) {
					elementList[x].hidden = true 
				}
			} else if (hideLegend == true & hideAc == false & hideNormal == false) {
				if (!checkAc == true | checkLegend == true) {
					elementList[x].hidden = true 
				}
				
			} else if (hideLegend == true & hideAc == true & hideNormal == false) {
				if (checkAc == true | checkLegend == true) {
					elementList[x].hidden = true 
				}
				
			} 
			
			
		}
	}
	
}




// Wait and Process acount data
var waitAttempts = 0;
var maxWaitAttempts = 40; // 10 seconds max (40 * 250ms)

function waitForTableToLoad(){
	waitAttempts++;
	var tableElement = document.getElementById("listinvFull");
	if (tableElement) {
		// Check if table has content and contains actual inventory rows
		var tableRows = tableElement.getElementsByTagName("tr");
		// Wait for at least a few rows to be loaded (not just header)
		if (tableRows.length > 1) {
			// Check if first data row exists (skip header row)
			var firstDataRow = tableRows[1];
			if (firstDataRow && firstDataRow.getElementsByTagName("td").length >= 5) {
				// Verify the row has actual item data (not just empty cells)
				var firstCell = firstDataRow.getElementsByTagName("td")[0];
				if (firstCell && firstCell.textContent.trim().length > 0 && 
				    !firstCell.textContent.toLowerCase().includes("loading") &&
				    !firstCell.textContent.toLowerCase().includes("no data")) {
					processAcount();
					return;
				}
			}
		}
	}
	// If table not ready and we haven't exceeded max attempts, wait and try again
	if (waitAttempts < maxWaitAttempts) {
		setTimeout(waitForTableToLoad, 250);
	} else {
		// Max attempts reached, try processing anyway
		console.log("Max wait attempts reached, processing inventory...");
		processAcount();
	}
}

function goto_ToFarm() {
	document.location.href = browser.runtime.getURL("tofarm.html")
}


function processAcountBackground() {
	var prevurl = document.location.href 
	
	
	browser.storage.local.set({"background": prevurl}, function() {});
	document.location.href = "https://account.aq.com/AQW/Inventory"
}

function addToFarm_button() {
	const header = document.getElementById("side-bar")
	var ToFarm = document.createElement("button") 
	ToFarm.onclick = function() { goto_ToFarm(); return false; }
	ToFarm.style = "background-color: Transparent;border: none;" 
	var img = document.createElement("img");
	img.style.height = "35px";
	img.src = tofarm_icon;
	ToFarm.appendChild(document.createTextNode(" "));
	ToFarm.appendChild(img);
	header.prepend(ToFarm)
	
}

function addUpdateInventory_button() {
	const Title = document.getElementById("page-title")
	var styles = `
    #UpdateInventory:hover {
		filter: contrast(120%) brightness(1.25);; 
	}`
	var styleSheet = document.createElement("style")
	styleSheet.innerText = styles
	document.head.appendChild(styleSheet)
	
	const updateInventory = document.createElement("button") 
	const updateInventoryImg = document.createElement("img");
	updateInventory.onclick = () => processAcountBackground();
	updateInventory.style.backgroundColor = "Transparent";
	updateInventory.style.border = "none";
	updateInventoryImg.id = "UpdateInventory";
	updateInventoryImg.style.height = "35px";
	updateInventoryImg.src = inventory_update_icon;
	
	updateInventory.appendChild(updateInventoryImg);
	Title.appendChild(updateInventory)
	

}

function setFilterAc() {
	browser.storage.local.get({mergeFilterAc: false}, function(result){
		browser.storage.local.set({"mergeFilterAc": !result.mergeFilterAc}, function() {});
		document.getElementById("AcFilter").checked = !result.mergeFilterAc
	})
	FilterEvent()
}

function setFilterNormal() {
	browser.storage.local.get({mergeFilterNormal: false}, function(result){
		browser.storage.local.set({"mergeFilterNormal": !result.mergeFilterNormal}, function() {});
		document.getElementById("NormalFilter").checked = !result.mergeFilterNormal
	})
	FilterEvent()
}

function setFilterLegend() {
	browser.storage.local.get({mergeFilterLegend: false}, function(result){
		browser.storage.local.set({"mergeFilterLegend": !result.mergeFilterLegend}, function() {});
		document.getElementById("LegendFilter").checked = !result.mergeFilterLegend
	})
	FilterEvent()
}



function processAcount() {
	
	var data = ProcessAccountItems();
	
	// Save Items to local Storage 
	browser.storage.local.set({"aqwitems": data[0]}, function() {});
	browser.storage.local.set({"aqwwhere": data[1]}, function() {});
	browser.storage.local.set({"aqwtype": data[2]}, function() {});
	browser.storage.local.set({"aqwbuy": data[3]}, function() {});
	browser.storage.local.set({"aqwcategory": data[4]}, function() {
		// After all data is saved, check for redirect
		browser.storage.local.get({background: false}, function(result){
			if (result.background !== false && document.location.href == "https://account.aq.com/AQW/Inventory") {
				let shouldRedirect = false;
				try {
					const redirectUrl = new URL(result.background);
					const allowedHosts = ['aqwwiki.wikidot.com'];
					if ((redirectUrl.protocol === 'http:' || redirectUrl.protocol === 'https:') &&
						allowedHosts.includes(redirectUrl.hostname)) {
						shouldRedirect = true;
					}
				} catch (e) {
					// Invalid URL, do not redirect
					shouldRedirect = false;
				}
				if (shouldRedirect) { // Redirect Only Aqw Wiki Pages  
					// Clear the background flag first
					browser.storage.local.set({"background": false}, function() {
						// Small delay to ensure page is ready, then redirect
						setTimeout(function() {
							document.location.href = result.background;
						}, 500);
					});
				} else {
					// Clear background even if not redirecting
					browser.storage.local.set({"background": false}, function() {});
				}
			}
		});
	});
	
}




// Account Page Handling 
if (window.location.href == "https://account.aq.com/AQW/Inventory") {
	// page load 
	document.addEventListener('DOMContentLoaded', function(event) {
		
	// Wait function for table load 
	waitForTableToLoad()
	
	})
	
	
	
// Wiki Page Handling 
} else {

	// Adds theme if enabled 
	browser.storage.local.get({darkmode: 0}, function(result){
		if(result.darkmode) {
			addCss(browser.runtime.getURL("themes/dark.css"));
		}
	});
	
	addCss(browser.runtime.getURL("themes/progressbar.css"));
	// page load 
	document.addEventListener('DOMContentLoaded', function(event) {
	
	// Removes width bar [Not even usefull]
	var Body = document.getElementsByTagName('body')[0]
	Body.style = Body.style +";overflow-x: hidden;";


	// Get title of Wiki page (Name of category basically) 
	const Title = document.getElementById("page-title")
	const Content = document.getElementById("page-content")
	
	// Creates Found amount element near title. 
	var found_info = document.createElement("a") 
	found_info.textContent = "- Found 0 Items"
	found_info.style = "font-weight: bold;color:green;"
	Title.appendChild(found_info)
	
	
	
	
	
	
	addUpdateInventory_button()
	addToFarm_button()
	
	
	// Selects all <a> elements 
	// [It is best method, as it is compatible with other browsers]
	var nodeList = document.querySelectorAll("a")
	
	// How much <a> elements to skip 
	const arrayOffset = 190
	
	let arrayList = Array.from(nodeList).slice(arrayOffset) // About 200 is alright
	
	// Site detect vars 
	
	try{
		var isMonster = document.body.parentElement.innerHTML.includes("/system:page-tags/tag/monster");
	} 
	catch(err){var isMonster = false}
	
	try{
		var isShop =    document.body.parentElement.innerHTML.includes("(Shop)");
	} 
	catch(err){var isShop = false}
	

	// if shop is a merge shop 
	try{
		var isMerge = document.body.innerHTML.includes('/system:page-tags/tag/mergeshop'); 
	} 
	catch(err){var isMerge = false}

	// Is Quest Page 
	try{
		var isQuest = document.body.innerHTML.includes('/system:page-tags/tag/quest'); 
	} 
	catch(err){var isQuest = false}
	
	
	// Exclude search pages for false positives 
	if (window.location.href.includes(wiki_searchpage)) {
		var isMerge = false 
		var isQuest = false 
		var isShop = false 
		var isMonster = false 
	}
	

	if (isMerge) {
		window.addEventListener('load', function () {
			async function _add() {
				var element = document.getElementsByClassName("yui-nav")[0];
				
				
				var liMergeFilters = document.createElement("li")
				liMergeFilters.id = "MergeFilter"
				liMergeFilters.onclick = null 
				
				var filtersLabel = document.createElement("b");
				filtersLabel.className = "grayBox";
				filtersLabel.id = "pad";
				filtersLabel.textContent = "Filters >";
				liMergeFilters.appendChild(filtersLabel);
				
				var normalFilterInput = document.createElement("input");
				normalFilterInput.id = "NormalFilter";
				normalFilterInput.type = "checkbox";
				normalFilterInput.style.marginLeft = "5px";
				liMergeFilters.appendChild(normalFilterInput);
				
				var normalImg = document.createElement("img");
				normalImg.src = normal_icon;
				normalImg.alt = "normal_icon.png";
				normalImg.className = "image";
				liMergeFilters.appendChild(normalImg);
				
				var acFilterInput = document.createElement("input");
				acFilterInput.id = "AcFilter";
				acFilterInput.type = "checkbox";
				acFilterInput.style.marginLeft = "5px";
				liMergeFilters.appendChild(acFilterInput);
				
				var acImg = document.createElement("img");
				acImg.src = "http://aqwwiki.wdfiles.com/local--files/image-tags/acsmall.png";
				acImg.alt = "acsmall.png";
				acImg.className = "image";
				liMergeFilters.appendChild(acImg);
				
				var legendFilterInput = document.createElement("input");
				legendFilterInput.id = "LegendFilter";
				legendFilterInput.type = "checkbox";
				legendFilterInput.style.marginLeft = "5px";
				liMergeFilters.appendChild(legendFilterInput);
				
				var legendImg = document.createElement("img");
				legendImg.src = "http://aqwwiki.wdfiles.com/local--files/image-tags/legendsmall.png";
				legendImg.alt = "legendsmall.png";
				legendImg.className = "image";
				liMergeFilters.appendChild(legendImg);
				
				element.append(liMergeFilters)
				
				
				
				filterAcInput = document.getElementById("AcFilter")
				filterAcInput.onclick = function(){setFilterAc();resetFilterMerge();TagFilterMerge(filterNormalInput.checked, filterAcInput.checked, filterLegendInput.checked);return false; }
		
				filterNormalInput = document.getElementById("NormalFilter")
				filterNormalInput.onclick = function(){setFilterNormal();resetFilterMerge();TagFilterMerge(filterNormalInput.checked, filterAcInput.checked, filterLegendInput.checked);return false; }
				
				filterLegendInput = document.getElementById("LegendFilter")
				filterLegendInput.onclick = function(){setFilterLegend();resetFilterMerge();TagFilterMerge(filterNormalInput.checked, filterAcInput.checked, filterLegendInput.checked);return false; }
		
		
				browser.storage.local.get({mergeFilterNormal: false}, function(result){
					filterNormalInput.checked = result.mergeFilterNormal
					browser.storage.local.get({mergeFilterLegend: false}, function(result){
						filterLegendInput.checked = result.mergeFilterLegend
						browser.storage.local.get({mergeFilterAc: false}, function(result){
							filterAcInput.checked = result.mergeFilterAc
							TagFilterMerge(filterNormalInput.checked, filterAcInput.checked, filterLegendInput.checked)
						})
						
					})
					
				})
				
				
				
				
				
				
			}
			setTimeout(_add,500); 
			// Don't ask it just sometimes doesn't work if timeout isn't specified and then is at beginning of list 
			// timeout fixes that edge case, no idea why it happens negative time loading?? idk.
			// It only appeared when changing css file (Possible that in relase this bug doesn't appears)
			
		})
		
		

	}
			
			
	// Item lists 
	try{
		var isList = document.body.parentElement.innerHTML.includes("Go to"); 
	} 
	catch(err){var isList = false}
	
	try{
		var isLocation = document.body.parentElement.innerHTML.includes("/join"); 
	} 
	catch(err){var isLocation = false}
	
	


	
	// get stored data
	// If WIP in options is enabled.
	browser.storage.local.get({wipmoreinfo: 1}, function(result){WIP_moreinfo = result.wipmoreinfo;})

	// Get account data (Just not items) 
	browser.storage.local.get({aqwbuy: []}, function(result){Buy = result.aqwbuy;});
	browser.storage.local.get({aqwcategory: []}, function(result){Category = result.aqwcategory;});
	browser.storage.local.get({aqwwhere: []}, function(result){Where = result.aqwwhere;});
	browser.storage.local.get({aqwtype: []}, function(result){Type = result.aqwtype;});
	
	browser.storage.local.get({mergeFilterAc: []}, function(result){mergeFilterAc = result.mergeFilterAc;});
	browser.storage.local.get({mergeFilterNormal: []}, function(result){mergeFilterNormal = result.mergeFilterNormal;});
	browser.storage.local.get({mergeFilterLegend: []}, function(result){mergeFilterLegend = result.mergeFilterLegend;});
	


	
	
	
	
	// Get items and process it 
	// Add a small delay to ensure storage is ready after redirect
	setTimeout(function() {
		browser.storage.local.get({aqwitems: []}, function(result){
			var Items = result.aqwitems;
			
			if (isMerge) {
				DisplayCostMergeShop(Items, mergeFilterNormal, mergeFilterAc, mergeFilterLegend)
				FilterEvent = updateCostMergeShop.bind(null, Items, mergeFilterNormal, mergeFilterAc, mergeFilterLegend)
				
	
			}
	
			
			// Iterate over nodelist with array offset applied 
			for (var x = 0; x < arrayList.length; x++) {
				
				ProcessWikiItem(nodeList, arrayOffset, Items, Buy, Category, Where, Type, x, isMerge, isList, isQuest, isMonster) 
				
				
				// Wip process (Can be enabled in options of Extension.
				if (WIP_moreinfo) {
			
					ProcessAnyWikiItem(nodeList, arrayOffset, Buy, Category, Where, Type, x, isMonster, isQuest, isMerge)
					
				}
			
			
			}
			
			
			// Displays found amount 
			found_info.textContent = "- Found "+found+" Items" // Displays items found 
			
		});
	}, 100); // Small delay to ensure storage is ready
	
	})
	
	
}
