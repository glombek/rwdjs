/*
 * rwdjs
 * JavaScript library for managing JavaScript used in responsive web designs
 * 
 * http://rwdjs.joe.gl
 * MIT License
 * Requires jQuery
 */

var rwdjs = rwdjs || (function ($) {
    var rules = [],
        prevWidth,
        parent,
        console = {
            log:   function () { },
            warn:  function () { },
            error: function () { },
            info:  function () { }
        },
        utils = {
            remToPx: function (remVal) {
                /// <summary>rem is a useful unit for responsive designs, but rwdjs requires values in pixels.
                ///     This function converts rem values to px.</summary>
                /// <param name="remVal" type="Number">The value in rem which you want to convert to px.</param>
                /// <returns type="Number">The rem value in pixels.</returns>
                return parseFloat(getComputedStyle(document.documentElement).fontSize) * remVal;
            }
        };
    
    if(window.console) {
        log = function (obj) {
            window.console.log(obj);
        };
        warn = function (obj) {
            window.console.warn(obj);
        };
        error = function (obj) {
            window.console.error(obj);
        };
        info = function (obj) {
            window.console.info(obj);
        };
    }
    
    if(!$) {
        this.console.error("rwdjs: jQuery is not loaded.");
    }
    
    parent = $(window);
    
    function runRule(rule, forceRun) {
        var width = parent.innerWidth(),
            prevIn = prevWidth >= rule.minWidth && prevWidth <= rule.maxWidth,
            nowIn = width >= rule.minWidth && width <= rule.maxWidth,
            movedIn = nowIn && !prevIn,
            movedOut = prevIn && !nowIn;
                
        if(movedIn || movedOut || (forceRun && nowIn)) {
            rule.func(nowIn);
        }
    }
    
    function run() {
        /// <summary>Force the rules to be re-evaluated. This function is run initially and on the window resize event, but it's here just in case you should wish to access it.</summary>

        var width = parent.innerWidth();
        //just in case only the height changed
        if (width !== prevWidth) {
            
            //check to see if we've gone over a breakpoint
            $.each(rules, function (i, rule) {
                runRule(rule);
            });
            
            
            prevWidth = width;
        }
    }
    
    function init() {
        $(parent).resize(function () {
            run();
        });
        run();
    }
    
    function addRule(minWidth, maxWidth, on, off) {
        /// <signature>
        /// <summary>Add a rule with a single function (which is passed a boolean argument indicating on/off state.</summary>
        /// <param name="minWidth" type="Number">The width must be at least this size for the rule to apply. Use 'null' or '0' if there is no minimum.</param>
        /// <param name="maxWidth" type="Number">The width must be this size or less for the rule to apply. Use 'null' or 'Infinity' if there is no maximum.</param>
        /// <param name="on" type="Function">The function which is run whenever the rule is triggered on or off. A boolean argument passed to this function indicates the on/off state.</param>
        /// </signature>
        /// <signature>
        /// <summary>Add a rule with one function when the rule is triggered on and a second when the rule is triggered off.</summary>
        /// <param name="minWidth" type="Number">The width must be at least this size for the rule to apply. Use 'null' or '0' if there is no minimum.</param>
        /// <param name="maxWidth" type="Number">The width must be this size or less for the rule to apply. Use 'null' or 'Infinity' if there is no maximum.</param>
        /// <param name="on" type="Function">The function which is run whenever the rule is triggered on.</param>
        /// <param name="off" type="Function">The function which is run whenever the rule is triggered off.</param>
        /// </signature>

        //initialise if its the first time
        if (!prevWidth) {
            init();
        }
        
        //Make our maths work in case of nulls
        if (!maxWidth) {
            maxWidth = Infinity;
        }
        if (!minWidth) {
            minWidth = 0;
        }
        
        var func = on;
        if (off) {
            func = function (runOn) {
                if (runOn) {
                    on();
                } else {
                    off();
                }
            }
        }
        
        var rule = { minWidth: minWidth, maxWidth: maxWidth, func: func };
        
        //add to our list of rules
        rules.push(rule);
        
        runRule(rule, true);
    }

    //publically accessible variables
    return {
        addRule: addRule,
        run: run,
        utils: utils
    };
}(window.jQuery));