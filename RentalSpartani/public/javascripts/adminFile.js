function myFunction1() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInputGuerrieri");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableGuerrieri");
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
    input = document.getElementById("myInputNoleggiAttivi");
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
  
  
  
  
  
function changeSelect(numRiga) {
    var stati = ['Ottimo','Infortunato','Menomato','Deceduto','Non disponibile'];
    var table = document.getElementById("tableNoleggiAttivi");
    for( var i = 0 ; i < stati.length ; i ++){
    if(stati[i] == table.rows[numRiga].cells[2].innerHTML){
    var app = stati[stati.length];
        stati[stati.length] = stati[i];
        stati[i] = app;
        stati.pop();
        }
    }
    removeOptions(document.getElementById('selectCond'));
    var select = document.getElementById('selectCond');
    for (var i = 0; i<stati.length; i++){
        if(stati[i] != undefined){
        var opt = document.createElement('option');
        opt.value = stati[i];
        opt.innerHTML = stati[i];
        select.appendChild(opt);
         }
        }
    }
  
  
  function removeOptions(selectElement) {
     var i, L = selectElement.options.length - 1;
     for(i = L; i >= 1; i--) {
        selectElement.remove(i);
     }
  }


  function myFunction3() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInputNoleggiFuturi");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableNoleggiFuturi");
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

  function myFunction4() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInputStoricoNoleggi");
    filter = input.value.toUpperCase();
    table = document.getElementById("tableStoricoNoleggi");
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

  function myFunction5() {
    // Declare variables
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("myInputUtenti");
    filter = input.value.toUpperCase();
    table = document.getElementById("table1Utenti");
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

  
  