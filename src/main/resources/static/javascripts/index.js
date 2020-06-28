/**
 * @method Anonymous function that wraps bootstrapping of front-end scripting
 */
(function() {
    "use strict";

    /**
     * @method startApplication
     * @desc instantiates a singleton AppRunner class to handle front-end scripting
     */
    function startApplication() {
        new AppRunner();
    }

    /**
     * @method startAtTop
     * @desc scrolls to top of page--useful on refreshes
     */
    function startAtTop() {
        window.scroll({
          top: 0,
          behavior: 'auto'
        });
    }

    /**
     * @method showSpinner
     * @desc invokes method that removes hard-coded HTML/CSS spinner, which will run one second after scripting is loaded
     */
    function showSpinner() {
        setTimeout(removeSpinner, 1000);
    }

    /**
     * @desc removes hard-coded HTML/CSS Spinner
     */
    function removeSpinner(){
        let loadingDiv = document.querySelector(".loadingDiv");
        document.querySelector("body").removeChild(loadingDiv);
        startAtTop();
    }

    /**
     * @listens window.onload
     * @desc bootstrap front-end classes
     * sets timeout to remove spinner
     * starts frontend appRunner
     */
    window.onload = function() {
        showSpinner();
        startApplication();
    };
}());
