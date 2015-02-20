var rwdjs = rwdjs || (function ($) {
    var rules = [],
        prevWidth,
        parent,
        console = {
            log:   function () { },
            warn:  function () { },
            error: function () { },
            info:  function () { }
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
        var usePrevWidth = forceRun ? -1 : prevWidth;
        var width = parent.width(),
            prevIn = usePrevWidth > rule.gt && usePrevWidth < rule.lt,
            nowIn = width > rule.gt && width < rule.lt,
            movedIn = nowIn && !prevIn,
            movedOut = prevIn && !nowIn;
                
        if(movedIn || movedOut || forceRun) {
            rule.func(movedIn);
        }
    }
    
    function run() {
        var width = parent.width();
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
        //prevWidth = parent.width();
        
        $(parent).resize(function () {
            run();
        });
        run();
    }
    
    function addRule(gt, lt, func) {
        //initialise if its the first time
        if (!prevWidth) {
            init();
        }
        
        //Make our maths work in case of nulls
        if (!lt) {
            lt = Infinity;
        }
        if (!gt) {
            gt = -1;
        }
        
        var rule = { gt: gt, lt: lt, func: func };
        
        //add to our list of rules
        rules.push(rule);
        
        runRule(rule, true);
    }
    
    //publically accessible variables
    return {
        addRule: addRule,
        run: run
    };
}(window.jQuery));