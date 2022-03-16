console.log("TEST");

const terms = document.getElementById("terms")
const btn = document.getElementById("submit")
												
terms.onchange = function(){
	if(terms.checked){
		btn.disabled = false;
	} else {
		btn.disabled = true;
        
	}
};

