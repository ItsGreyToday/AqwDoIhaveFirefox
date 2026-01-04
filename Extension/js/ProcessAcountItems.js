// ProcessAccountItems.js


function getJson(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); 
	xmlHttp.send(null);
    return JSON.parse(xmlHttp.responseText)
}




var json_data = getJson(browser.runtime.getURL("data/Unidentified_Translation.json"))




var _UndArray_0 = json_data["Names"]
var _UndArray_1 = json_data["Translation"]
  



// Translates unidentified items 
function translateUnidentified(itemname) {
	if (itemname.includes("unidentified")) {
		for (var x = 0; x < _UndArray_0.length; x++) {
			if (itemname == _UndArray_0[x]) {
				return _UndArray_1[x];
			}
		}
	}
	return itemname;
}

	
// Processes items from account 
function ProcessAccountItems() {
		// Stored data for return to main 
		var Items = []
		var Where = []
		var Type = []
		var Buy = []
		var Category = [] 
		
		// Indicator of loaded items bellow search input.
		var indicator = null;
		var filterElement = document.getElementById("listinvFull_filter");
		
		// Only create and append indicator if the filter element exists
		if (filterElement) {
			indicator = document.createElement("div");
			var h = document.createElement("h");
			h.textContent = "Loaded 0 Items";
			indicator.appendChild(h);
			indicator.style = "display: block;width: auto;text-align: right;position:relative;";
			indicator.classList.add("tblHeader");
			filterElement.appendChild(indicator);
		}
		
		// Get all table rows from the inventory table specifically
		// Try to find the table by ID first
		var inventoryTable = document.getElementById("listinvFull");
		if (!inventoryTable) {
			// Fallback: look for table with id containing "inv" or "listinv"
			var tables = document.getElementsByTagName("table");
			for (var t = 0; t < tables.length; t++) {
				if (tables[t].id && (tables[t].id.includes("inv") || tables[t].id.includes("listinv"))) {
					inventoryTable = tables[t];
					break;
				}
			}
		}
		
		// Get all rows from the table (skip header row if it exists)
		var tableRows = inventoryTable ? inventoryTable.getElementsByTagName("tr") : [];
		var inventoryElement = [];
		
		// Extract td elements from each row, skipping header rows
		for (var r = 0; r < tableRows.length; r++) {
			var row = tableRows[r];
			var cells = row.getElementsByTagName("td");
			// Only process rows that have at least 5 cells (inventory data rows)
			if (cells.length >= 5) {
				for (var c = 0; c < cells.length; c++) {
					inventoryElement.push(cells[c]);
				}
			}
		}
		
		// If no table found, fallback to all td elements
		if (inventoryElement.length === 0) {
			inventoryElement = document.getElementsByTagName("td");
		}
		
		// Counter for recgonizing row of table 
		var count = 0;
		
		// Loop Througth Table Elements 
		for (var x = 0; x < inventoryElement.length; x++) {
			count += 1;
			
			// Current Table Element 
			let iterated = inventoryElement[x].innerHTML.trim().replace("’","'");
			
			// Skip empty cells or cells with only whitespace
			if (!iterated || iterated.length === 0) {
				continue;
			}
			
			//  Count 1 == Item Name 
			if (count == 1) {
				// Skip if this looks like a header or non-item text
				if (iterated.toLowerCase().includes("loading") || 
				    iterated.toLowerCase().includes("loaded") ||
				    iterated.toLowerCase() === "item name" ||
				    iterated.toLowerCase() === "name") {
					count = 0; // Reset counter and skip this row
					continue;
				}
				
				iterated = iterated
				// Check if next element exists before accessing it
				let type = "";
				if (x + 1 < inventoryElement.length && inventoryElement[x+1]) {
					type = inventoryElement[x+1].innerHTML.trim().replace("’","'");
				}
				if (iterated.includes(" x")) { // Checks if item has count (Just for Unidentified Translation)
					Items.push(iterated.toLowerCase());
				} else if (type == "Item" || type == "Resource" || type == "Quest Item" || type == "Wall Item" || type == "Floor Item")  {
					Items.push(iterated);
				} else {
					Items.push(translateUnidentified(iterated.toLowerCase()));
				}
			} 
			
			// Count 2 == Type 
			else if (count == 2) {
				
				// Checks type of item if its one of stackable.
				if (iterated == "Item" || iterated == "Resource" || iterated == "Quest Item" || iterated == "Wall Item" || iterated == "Floor Item") {

					// Gets item 
					name 
					let itemname = Items.pop(); 
					
					// If it has xAmount it will process the amount 
					if (itemname.includes(" x")) {
						
						// Saves Type as [Type, ItemAmount] 
						Type.push([iterated,itemname.split(" x")[1]]); 
						
						// Return name without xAmount
						Items.push(translateUnidentified(itemname.split(" x")[0])); 
					}
					// If it has no amount give it 1 as amount
					else {
						Type.push([iterated, 1]);
						Items.push(translateUnidentified(itemname.toLowerCase()));
					}
				} else {
					// Normall process of types just push value.
					let psh = inventoryElement[x].innerHTML.trim();
					Type.push(psh);
				}	
			} 
			
			// Count 3 == Where (Location of item)
			else if (count == 3) {
				Where.push(iterated);
			} 
			
			// Count 4 == Buy  (Ac/Gold)
			else if (count == 4) {
				Buy.push(iterated);
			} 
			
			// Count 5 == Category (Free / Member) 
			else if (count == 5) {
				let psh = inventoryElement[x].innerHTML.trim();
				Category.push(psh);
			}	
			else {
				// Reset Counter 
				if (count == 6) {
					count = 0;
				}
			}	
		}
	// Update indicator if it was created and appended
	if (indicator) {
		var h = indicator.querySelector("h");
		if (h) {
			h.textContent = "Loaded "+Items.length+" Items";
		} else {
			h = document.createElement("h");
			h.textContent = "Loaded "+Items.length+" Items";
			indicator.appendChild(h);
		}
	}
	
	var data = [Items, Where, Type, Buy, Category]
	return data;
}

