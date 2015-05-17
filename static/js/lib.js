var lib = {};
(function(document, window, undefined){
    'use strict';
    lib.live = function (eventType, elementQuerySelector, cb) {
        document.addEventListener(eventType, function (event) {

            var qs = document.querySelectorAll(elementQuerySelector);

            if (qs) {
                var el = event.target, index = -1;
                while (el && ((index = Array.prototype.indexOf.call(qs, el)) === -1)) {
                    el = el.parentElement;
                }

                if (index > -1) {
                    cb.call(el, event);
                }
            }
        });
    };
    
    var cache = {};
    lib.template = function(str, data) {
        /* jshint evil: true */
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        try {
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] || template(document.getElementById(str).innerHTML) :
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                "var p=[];" +
                // Introduce the data as local variables using with() {}
                "with(obj) {p.push('" +
                // Convert the template into pure JavaScript
                str.replace(/[\r\t\n]/g, " ")
                  .split("<%").join("\t")
                  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                  .replace(/\t=(.*?)%>/g, "',$1,'")
                  .split("\t").join("');")
                  .split("%>").join("p.push('")
                  .split("\r").join("\\'")
                + "');}return p.join('');");
            // Provide some basic currying to the user
            return data ? fn( data ) : fn;
        }
        catch(e) {
            throw new Error('Error while processing template, check template format and try again.');
        }
    };

})(document, window);