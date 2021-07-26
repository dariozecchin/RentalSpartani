function controllo(){
    document.querySelector(".popup").style.display = "flex";

    document.getElementById("conteinerMenu").style.backgroundColor = "rgba(0,0,0,0.3)";
    document.getElementById("barSearch").style.backgroundColor = "rgba(0,0,0,0.3)";
    document.getElementById("lastFooter").style.backgroundColor = "rgba(0,0,0,0.3)";
    document.body.style.backgroundColor = "rgba(0,0,0,0.3)";
}

function openLogPop(){
    document.querySelector(".popup").style.display = "flex";

    document.getElementById("conteinerMenu").style.backgroundColor = "rgba(0,0,0,0.3)";

    document.getElementById("lastFooter").style.backgroundColor = "rgba(0,0,0,0.3)";
    document.body.style.backgroundColor = "rgba(0,0,0,0.3)";
}

function controllo1(){
    var p = document.getElementById('errorLogin');
    p.innerHTML= "";


    document.getElementById("conteinerMenu").style.backgroundColor = "#74B3CE";
    document.getElementById("barSearch").style.backgroundColor = "#508991";
    document.body.style.backgroundColor = "white";
    document.getElementById("lastFooter").style.backgroundColor = "#74B3CE";

    document.querySelector(".popup").style.display = "none";
    // Usare .value per elementi di input type
    document.getElementById("casellaTesto").value = "";
    document.getElementById("casellaPsw").value = "";



}


function chiusuraLoginNoHome(){
  var p = document.getElementById('errorLogin');
  p.innerHTML= "";


  document.getElementById("conteinerMenu").style.backgroundColor = "#74B3CE";
  document.body.style.backgroundColor = "white";
  document.getElementById("lastFooter").style.backgroundColor = "#74B3CE";

  document.querySelector(".popup").style.display = "none";
  document.getElementById("casellaTesto").value = "";
  document.getElementById("casellaPsw").value = "";
}


function closePopUp()  {
  document.getElementById("conteinerMenu").style.backgroundColor = "#74B3CE";
  document.getElementById("barSearch").style.backgroundColor = "#508991";
  document.body.style.backgroundColor = "white";
  document.getElementById("lastFooter").style.backgroundColor = "#74B3CE";
  document.querySelector(".popup2").style.display = "none";

}


function closePopUpNoHome()  {
  document.getElementById("conteinerMenu").style.backgroundColor = "#74B3CE";
  document.body.style.backgroundColor = "white";
  document.getElementById("lastFooter").style.backgroundColor = "#74B3CE";
  document.querySelector(".popup2").style.display = "none";

}
function closePopUpAdmin()  {
  document.getElementById("conteinerMenu").style.backgroundColor = "#74B3CE";
  document.body.style.backgroundColor = "white";

  document.getElementById("lastFooter").style.backgroundColor = "#74B3CE";
  document.querySelector(".popup2").style.display = "none";

}


function closePopUpAdmin2()  {


  document.getElementById("conteinerMenu").style.backgroundColor = "#74B3CE";
  document.body.style.backgroundColor = "white";
  var elements = document.getElementsByClassName('liE');
    for(var i = 0; i < elements.length; i++){
      elements[i].style.backgroundColor = "#7190A2";
    }

  document.getElementById("lastFooter").style.backgroundColor = "#74B3CE";
  document.querySelector(".popup2").style.display = "none";

}




function closePopUp2()  {
  document.body.style.backgroundColor = "white";
  document.getElementById("lastFooter").style.backgroundColor = "#74B3CE";
  document.querySelector(".popup2").style.display = "none";

}


function possibleLogOut(){
  if (confirm('Are you sure you want to log out?')) {
  // Save it!
} else {
  // Do nothing!
  }
}


function logOut(){

    document.querySelector(".popup2").style.display = "flex";

    document.getElementById("conteinerMenu").style.backgroundColor = "rgba(0,0,0,0.3)";
    document.getElementById("barSearch").style.backgroundColor = "rgba(0,0,0,0.3)";
    document.getElementById("lastFooter").style.backgroundColor = "rgba(0,0,0,0.3)";
}


function logOut2(){

    document.querySelector(".popup2").style.display = "flex";
    document.getElementById("conteinerMenu").style.backgroundColor = "rgba(0,0,0,0.3)";
    document.getElementById("lastFooter").style.backgroundColor = "rgba(0,0,0,0.3)";
}

function logOutAdmin(){

    document.querySelector(".popup2").style.display = "flex";
    document.getElementById("conteinerMenu").style.backgroundColor = "rgba(0,0,0,0.3)";
    document.getElementById("lastFooter").style.backgroundColor = "rgba(0,0,0,0.3)";
}


function logOutAdmin2(){
  document.querySelector(".popup2").style.display = "flex";

  var elements = document.getElementsByClassName('liE'); // get all elements
  	for(var i = 0; i < elements.length; i++){
  		elements[i].style.backgroundColor = "rgba(0,0,0,0.3)";
  	}
      
    document.getElementById("conteinerMenu").style.backgroundColor = "rgba(0,0,0,0.3)";
    document.getElementById("lastFooter").style.backgroundColor = "rgba(0,0,0,0.3)";
}
