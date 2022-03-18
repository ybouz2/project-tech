const terms = document.getElementById("terms");
const btn = document.getElementById("submit");

const rmRequired = () => {
    document.getElementById("terms").removeAttribute("required");
}
rmRequired();


terms.onchange = function(){
	if(terms.checked){
		btn.disabled = false;
	} else {
		btn.disabled = true;
        
	}
};


