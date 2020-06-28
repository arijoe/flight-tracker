"use strict;"

class AppRunner {

    constructor() {
        this.baseUrl = "/api/flights";
        this.attachListeners();
    }

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

    onSubmit() {
        const params = this.getParams();
        if (this.validateParams(params)) {
            this.getFlights(params);
        }
    }

    getParams() {
        return {
            "origin": this.getValueFromForm("origin-city"),
            "destination": this.getValueFromForm("destination-city"),
            "outboundDate": this.getValueFromForm("outbound-date"),
            "inboundDate": this.getValueFromForm("inbound-date")
        }
    }

    getValueFromForm(formId) {
        if (!formId || !document.getElementById(formId)) {
            return null
        }
        return document.getElementById(formId).value;
    }

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

    getUrl(p) {
        return `${this.baseUrl}/${p.origin}/${p.destination}/${p.outboundDate}`;
    }

    getReturnUrl(p) {
        const origin = p.origin;
        p.origin = p.destination;
        p.destination = origin;
        p.outboundDate = p.inboundDate;
        return this.getUrl(p);
    }

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

    renderResponse(response) {
        this.removeAllChildNodes(document.querySelector("#response .flight-info"));
        return this._renderResponse(response);
    }

    renderReturnResponse(response) {
        this.addBreak();
        return this._renderResponse(response);
    }

    _renderResponse(response) {
        if (this.renderError(response, document.querySelector("#response .error"))) {
            return true;
        }

        for (let quote of response.Quotes) {
            this.renderQuote(quote, response);
        }
    }

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

    renderErrorMessage(error, message) {
        error.innerText = message;
        document.querySelector("#response .errors").classList.remove("hidden");
    }

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

    addBreak() {
        const infoParent = document.querySelector("#response .flight-info");
        let lineBreak = document.createElement('div');
        lineBreak.setAttribute('class', 'line-break');
        lineBreak.innerText = "-- Return Flight Information --";
        infoParent.appendChild(lineBreak);
    }

    removeAllChildNodes(parent) {
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    switchCities() {
        const origin = document.getElementById("origin-city");
        const dest = document.getElementById("destination-city");
        const originValue = origin.value;
        const destValue = dest.value;
        origin.value = destValue;
        dest.value = originValue;
    }

    get(url) {
        return new Promise(function(resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);
            // resolve response of get
            req.onload = function() {
                if (req.status == 200) {
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

    removeSpinner() {
        const loadingDiv = document.querySelector(".loadingDiv");
        document.querySelector("body").removeChild(loadingDiv);
    }
}