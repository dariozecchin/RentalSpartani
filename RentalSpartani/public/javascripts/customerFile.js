function myFunction() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableNoleggiAttivi");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      var th =  tr[i].getElementsByTagName("th")[0];
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  function myFunction2() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput2");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableFuTPre");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      var th =  tr[i].getElementsByTagName("th")[0];
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }


  function myFunction3() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInput3");
    filter = input.value.toUpperCase();
    table = document.getElementById("storicTable");
    tr = table.getElementsByTagName("tr");
  
    // Loop through all table rows, and hide those who don't match the search query
    for (i = 0; i < tr.length; i++) {
      var th =  tr[i].getElementsByTagName("th")[0];
      td = tr[i].getElementsByTagName("td")[0];
      if (td) {
        txtValue = td.textContent || td.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        } else {
          tr[i].style.display = "none";
        }
      }
    }
  }

  var dt = new Date();
  var giorno = dt.getDate();
  var mese = dt.getMonth() + 1;
  var anno = dt.getFullYear();
  var oggi = 0;

    if(giorno < 10){
      giorno = "0" + giorno;
    }

    if(mese < 10){
      mese = "0" + mese;
    }

  var oggi = anno + "-" + mese + "-" + giorno;
  
function c1(){
    var array = document.getElementsByName('input_dataI');
    var arrayButton = document.getElementsByName('btnid1');
    for(var i = 0; i < array.length; i++){
      let calendario = array[i];
      let y = arrayButton[i];
      calendario.onchange = function(){
        var valore = calendario.value; 
         if(valore < oggi){
           y.disabled = true;
         } else {
           y.disabled = false;
         }
      }
    }
  }

  function c2(){
    var array1 = document.getElementsByName('dataidI');
    var array2 = document.getElementsByName('dataidF');
    var arrayButton = document.getElementsByName('btnid2');
    for(var i = 0; i < array1.length; i++){
      let calendario1 = array1[i];
      let calendario2 = array2[i];
      let y = arrayButton[i];
      calendario1.onchange = function(){
        var valore1 = calendario1.value;
        var valore2 = calendario2.value;
        if(valore1 < oggi || valore2 < oggi || valore1 > valore2){
          y.disabled = true;
        } else {
          y.disabled = false;
        }
      }
      calendario2.onchange = function(){
        var valore1 = calendario1.value;
        var valore2 = calendario2.value;
        if(valore1 < oggi || valore2 < oggi || valore1 > valore2){
          y.disabled = true;
        } else {
          y.disabled = false;
        }
      }
    }
  }

  function stars(id){
    var row2= document.getElementById('rowValue').value;
   // clear stars color
  clearStar(row2);

  // get the number from the id substring
  var j = id.substring(5);

   // set value of the hidden input
  var s= document.getElementById('starR');
  s.value =j;
  var s2= document.getElementsByName('buttonRec');
  // set color prop
  for( var i = 1 ; i <= j ; i ++){

   document.getElementById('stars'+i).style.color = "yellow";
  }

   }

  function clearStar(row){

   var hiddenF= document.getElementById('rowValue');

  hiddenF.value= row;

   for( var i = 1 ; i <= 5 ; i ++){
  document.getElementById('stars'+i).style.color = "black";
  }

}

function funzione30(){
   var array = document.getElementsByName('btnid1');
   var array1 = document.getElementsByName('btnid2');
   for(var i = 0; i < array.length; i++){
   array[i].disabled = true;
   }

   for(var j = 0; j < array1.length; j++){
   array1[j].disabled = true;
   }
}
 