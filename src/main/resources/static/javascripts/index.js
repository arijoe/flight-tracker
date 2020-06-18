(function() {
    "use strict";

    function startApplication() {
        new AppRunner();
    }

    function startAtTop() {
        window.scroll({
          top: 0,
          behavior: 'auto'
        });
    }

    function showSpinner() {
        setTimeout(removeSpinner, 1000);
    }

    function removeSpinner(){
        let loadingDiv = document.querySelector(".loadingDiv");
        document.querySelector("body").removeChild(loadingDiv);
        startAtTop();
    }

    function startDatepickers() {
        document.getElementById("origin-city").datepicker({
            'format': 'yyyy-mm-dd',
            'autoclose': true
        });
        document.getElementById("destination-city").datepicker({
            'format': 'yyyy-mm-dd',
            'autoclose': true
        });
    }

    window.onload = function() {
        showSpinner();
        startApplication();
    };
}());
