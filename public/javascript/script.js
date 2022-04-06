const resDiv = document.querySelector('#results');

 
window.onload = () => {
  getAdvice();
};
 
 
 
function getAdvice() {
 
  fetch('https://api.adviceslip.com/advice').then(response => {
    return response.json();
  }).then(adviceData => {
    const Adviceobj = adviceData.slip;
    resDiv.innerHTML = `<p>"${Adviceobj.advice}"</p>`;
  }).catch(error => {
    console.log(error);
  });
 
}


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


 

 
 
 

