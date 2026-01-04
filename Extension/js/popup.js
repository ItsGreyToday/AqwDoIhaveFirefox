
if (document.URL.includes("moz-extension") || document.URL.includes("chrome-extension")) { 
	document.addEventListener('DOMContentLoaded', popup_restore_options);
}
else{

}
function popup_restore_options() {
	var docs = document.getElementById('dark_moded')
	browser.storage.local.get({darkmode: 0}, function(result){
	if (result.darkmode == 1) {
		docs.textContent = "Dark Mode (ON)"
	}
	else{
		docs.textContent = "Dark Mode (OFF)"
	}

 
 })
 }
 
function popup_save_options() {
  var Dark_Mode = 0
  if (document.getElementById('dark_moded').textContent == "Dark Mode (ON)") {
	  Dark_Mode = 0
  } else {
	  Dark_Mode = 1
  }
  browser.storage.local.set({"darkmode": Dark_Mode}, function() {});
  popup_restore_options()
  }
 
 try {
 	document.getElementById('dark_moded').addEventListener('click',
    		popup_save_options);
} catch (error) {}