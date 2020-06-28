"use strict;"

/**
 * @Class AppRunner
 * @desc Manages front-end application and UI
 */
class AppRunner {

    /**
     * @Constructor - takes no parameters
     */
    constructor() {
        /**
         * @type {string} - defines baseUrl for invoking Web API
         * @desc Class Variable
         */
        this.baseUrl = "/api/flights";
        this.attachListeners();
    }

    /**
     * @desc attaches event listeners for user actions: form submission, field focuses, and switching inbound/outbound
     */
    attachListeners() {
        document.getElementById('submit-button').addEventListener("click", function() {
            this.onSubmit();
        }.bind(this));
        document.querySelectorAll(".required").forEach( function(i) {
            i.addEventListener("focus", function() {
                i.parentElement.querySelector(".error").innerText = "";
            }.bind(this));
        });
        document.getElementById("inbound-date").addEventListener("focus", function () {
           document.querySelector(".dates.out .error").innerText = "";
        });
        document.getElementById('switch').addEventListener("click", function() {
            this.switchCities();
        }.bind(this));
    }

    /**
     * @desc Runs on user submission. Validates input, and if valid, calls getFlights().
     */
    onSubmit() {
        const params = this.getParams();
        if (this.validateParams(params)) {
            this.getFlights(params);
        }
    }

    /**
     * @desc gets parameters from user input fields
     * @returns {{outboundDate: *, origin: *, inboundDate: *, destination: *}}
     */
    getParams() {
        return {
            "origin": this.getValueFromForm("origin-city"),
            "destination": this.getValueFromForm("destination-city"),
            "outboundDate": this.getValueFromForm("outbound-date"),
            "inboundDate": this.getValueFromForm("inbound-date")
        }
    }

    /**
     * @desc gets a value from a given input field
     * @param formId {string} HTML Id for a form field
     * @returns {null || String}
     */
    getValueFromForm(formId) {
        if (!formId || !document.getElementById(formId)) {
            return null
        }
        return document.getElementById(formId).value;
    }

    /**
     * @desc validates user input and renders errors, if any
     * @param params {object} maps to input values
     * @returns {boolean}
     */
    validateParams(params) {
        const errorText = "You must enter a value for ";
        let isValid = true;
        if (!params) {
            return false;
        }
        if (!params.origin) {
            document.getElementById("origin-err").innerText = errorText + " origin airport."
            isValid = false;
        }
        if (!params.destination) {
            document.getElementById("dest-err").innerText = errorText + " destination airport."
            isValid = false;
        } if (!params.outboundDate) {
            document.getElementById("out-err").innerText = errorText + " outbound date."
            isValid = false;
        } if (!!params.inboundDate && params.inboundDate < params.outboundDate) {
            document.getElementById("out-err").innerText = "Inbound date must come after outbound date."
            isValid = false;
        }
        return isValid;
    }

    /**
     * @desc builds and returns API endpoint URL based on given parameters
     * @param p {object} contains input values
     * @returns {string}
     */
    getUrl(p) {
        return `${this.baseUrl}/${p.origin}/${p.destination}/${p.outboundDate}`;
    }

    /**
     * @desc builds and returns API endpoint for a return flight URL based on given parameters
     * @param p {object} contains input values
     * @returns {string}
     */
    getReturnUrl(p) {
        const origin = p.origin;
        p.origin = p.destination;
        p.destination = origin;
        p.outboundDate = p.inboundDate;
        return this.getUrl(p);
    }

    /**
     * @desc Chains Promises to show spinner, render response of outbound, render response of inbound (if any), remove spinner, and catch/log errors
     * @param params {object}
     */
    getFlights(params) {
        this.showSpinner()
            .then( spinner => {
                const url = this.getUrl(params);
                return this.get(url);
            })
            .then( res => {
                return this.renderResponse(JSON.parse(res));
            })
            .then( hadErrors => {
                if (!!params.inboundDate && !hadErrors) {
                    const url = this.getReturnUrl(params);
                    return this.get(url);
                } else {
                    return null;
                }
            })
            .then ( res => {
                if (!res) {
                    return null;
                }
                this.renderReturnResponse(JSON.parse(res));
            })
            .then( () => {
                return this.removeSpinner();
            })
            .catch( err => {
                this.removeSpinner();
                console.error(err);
            }
        );
    }

    /**
     * @desc shows response of API call in UI
     * @param response {object}
     * @returns {boolean}
     */
    renderResponse(response) {
        this.removeAllChildNodes(document.querySelector("#response .flight-info"));
        return this._renderResponse(response);
    }

    /**
     * @desc shows response of second API call for returns flights in UI
     * @param response {Object}
     * @returns {boolean}
     */
    renderReturnResponse(response) {
        this.addBreak();
        return this._renderResponse(response);
    }

    /**
     * @desc shows response in UI
     * @param response {Object}
     * @returns {boolean}
     */
    _renderResponse(response) {
        if (this.renderError(response, document.querySelector("#response .error"))) {
            return true;
        }

        for (let quote of response.Quotes) {
            this.renderQuote(quote, response);
        }
    }

    /**
     * @desc renders errors from response in UI
     * @param response {Object}
     * @param error {HTMLElement}
     * @returns {boolean}
     */
    renderError(response, error) {
        document.querySelector("#response .errors").classList.add("hidden");

        if (!response) {
            this.renderErrorMessage(error, "Skyscanner API is not responding.");
            return true;
        } else if (response.ValidationErrors && response.ValidationErrors[0]) {
            this.renderErrorMessage(error, "We've got a problem: " + response.ValidationErrors[0].Message + ".");
            return true;
        } else if (!response.Quotes || !response.Quotes[0]) {
            this.renderErrorMessage(error, "Couldn't find any flights between those cities for those dates.");
            return true;
        }

        return false;
    }

    /**
     * @desc renders error within HTML element
     * @param error {HTMLElement}
     * @param message {String}
     */
    renderErrorMessage(error, message) {
        error.innerText = message;
        document.querySelector("#response .errors").classList.remove("hidden");
    }

    /**
     * @desc renders q given quote in the UI
     * @param quote {object} Flight quote returned from web API
     * @param response {object} Full JSON response Object
     */
    renderQuote(quote, response) {
        let infoParent = document.querySelector("#response .flight-info");
        let container = document.createElement('div');
        let info1 = document.createElement('div');
        let info2 = document.createElement('div');
        container.setAttribute('class', 'info');
        info1.setAttribute('class', 'leader');
        info2.setAttribute('class', 'follower');
        const carrier = response.Carriers.find( c => c.CarrierId == quote.OutboundLeg.CarrierIds[0] );
        const price = response.Currencies[0].Symbol + quote.MinPrice;
        const direct = quote.Direct ? 'Direct' : 'Indirect';
        const from = response.Places.find( p => p.PlaceId == quote.OutboundLeg.OriginId );
        const to = response.Places.find( p => p.PlaceId == quote.OutboundLeg.DestinationId );
        info1.innerHTML = `<span class="price">${price}: </span><span class="trip">${from.Name} &#x279C; ${to.Name}</span>`;
        info2.innerHTML = `<span class="carrier">${direct} through ${carrier.Name}</span>`;
        container.appendChild(info1);
        container.appendChild(info2);
        infoParent.appendChild(container);
    }

    /**
     * @desc creates UI break between outbound and inbound flights
     */
    addBreak() {
        const infoParent = document.querySelector("#response .flight-info");
        let lineBreak = document.createElement('div');
        lineBreak.setAttribute('class', 'line-break');
        lineBreak.innerText = "-- Return Flight Information --";
        infoParent.appendChild(lineBreak);
    }

    /**
     * @desc removes all children nodes of a given node
     * @param parent {HTMLElement}
     */
    removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    /**
     * @desc switches the origin and destination cities
     */
    switchCities() {
        const origin = document.getElementById("origin-city");
        const dest = document.getElementById("destination-city");
        const originValue = origin.value;
        const destValue = dest.value;
        origin.value = destValue;
        dest.value = originValue;
    }

    /**
     * @desc performs HTTP `GET` request
     * @param url {string} REST endpoint
     * @returns {Promise<XMLHttpRequest.response>}
     */
    get(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            // resolve response of get
            req.onload = function() {
                if (req.status === 200) {
                    resolve(req.response);
                }
                else {
                    reject(Error(req.statusText));
                }
            };
            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };
            // Make the request
            req.send();
        });
    }

    /**
     * @desc shows the HTML/CSS Spinner
     * @returns {Promise<boolean>}
     */
    showSpinner() {
        return new Promise(function(resolve, reject) {
            let spinnerClass = 'loadingDiv';
            let parent = document.querySelector('body');
            let spinner = document.createElement('div');
            let loader = document.createElement('div');
            try {
                spinner.setAttribute('class', spinnerClass);
                loader.setAttribute('class', 'loader');
                spinner.appendChild(loader);
                parent.appendChild(spinner);
                resolve(true);
            } catch(e) {
                reject(e);
            }
        });
    }

    /**
     * @desc removes the HTML/CSS Spinner
     */
    removeSpinner() {
        const loadingDiv = document.querySelector(".loadingDiv");
        document.querySelector("body").removeChild(loadingDiv);
    }
}