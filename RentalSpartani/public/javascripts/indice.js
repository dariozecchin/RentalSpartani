$(document).ready ( function(){
    var url = window.location.search;
    var queryStr = url.split("?")[1];

    if(queryStr) {
        let hash = queryStr.split('&');
        for (var i = 0; i < hash.length; i++) {
            params=hash[i].split("=");
            if(params[0] == 'error' && params[1] == 'user_not_found') {


                // SHOW YOUR MODAL HERE
                controllo();
                var x = document.getElementById("errorLogin");
                x.style.display = "block";
                //document.querySelector("errorLogin").style.display = "block";
                document.getElementById('errorLogin').innerHTML = "CREDENZIALI SBAGLIATE";

            }
        }
    }
})


