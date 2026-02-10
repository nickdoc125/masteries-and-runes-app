// Object Create Method
if(typeof Object.create !== "function") {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}
if(typeof Object.extend !== "function") {
    Object.extend = function(o, p) {
        var n = Object.create(o);
        if(p == undefined || p == null) return o;
        for(a in p) {
            if(p.hasOwnProperty(a)) {
                n[a] = p[a];
            }
        }
        return n;
    };
}

// Object Create Method
if(typeof Object.new !== "function") {
    Object.new = function (o, p) {
        function Obj() {}
        Obj.prototype = o;
        var n = new Obj();
        if( typeof n._construct !== "function") {
            n = Object.extend(n, p);
            if( typeof n._onCreate !== 'function')
                return n;
            n._onCreate();
            return n;
        }
        n._construct(p);
        if( typeof n._onCreate !== 'function')
            return n;
        n._onCreate();
        return n;
    };
}
$.fn.preload = function() {
    this.each(function(){
        $('<img/>')[0].src = this;
    });
}


// Global helper
G = {};
G.log = function(message) {
    console.log('G.'+arguments.callee.caller.name, message);
}
G.make = function(template, amount, values) {
    var result = [];
    for(var i = 0; i < amount; i++)
        result.push( Object.new(template, values) );
    G.log(result);
    return result;
}
G.decimal = function(value, decimals) {
    value = value.toFixed(decimals)+'';
    var max = value.length;
    var lastIndex = max;
    var i = max;
    while(lastIndex == max && i >= 0) {
        if(value.substring(i,i+1) > 0)
            lastIndex = i;
        i--;
    }
    return value.substring(0, lastIndex+1);
}
G.runeIndex = function( runes, rune ) {
    for(var i = 0; i < runes.length; i++){
        if(runes[i].id == rune.id)
            return i;
    }
    return -1;
}
G.iterate = function(func, times) {
    var result = [];
    for(var i = 0; i < times; i++) {
        result[i] = func();
    }
    return result;
}
G.calcRGMaxHeight = function(r) {
    return r * 42 + (r+1) * 2 + 28;
}
G.calcRGItems = function(x) {
    return (x - 30) / 44;
}
G.initRGMaxHeight = function() {
    $('.rune-group').each(function(i,e){
        function calc(r) {
            return r * 42 + (r+1) * 2 + 28;
        }
        $group = $(e);
        $group.css('max-height', calc($group.find('.rune').length)+'px');
    });
}
G.setRGMaxHeight = function(group) {
//    if( force != true ) { return; }
    console.log('rune group', group);

    $group =$('.rune-group.'+group.name.toLowerCase());
    var count = 0;
    for(var i = 0; i < group.runes.length; i++) {
        if(group.runes[i].show == true &&
            group.runes[i].quantity > 0)
        count++;
    }
    $group.css('max-height', G.calcRGMaxHeight(count)+'px');
}
G.setRGMaxHeightSpecific = function(group, amount) {
    $('.rune-group.'+group.toLowerCase()).css('max-height', G.calcRGMaxHeight(amount)+'px');
}
G.toRadix = function(N,radix) {
    var HexN="", Q=Math.floor(Math.abs(N)), R;
    while (true) {
        R=Q%radix;
            // Base 61 - all but lower case 'x'
        HexN = "0123456789abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(R)
            + HexN;
        Q=(Q-R)/radix;
        if (Q==0) break;
    }
    return ((N<0) ? "-"+HexN : HexN);
}
G.reverseRadix = function(hash) {
    var value = 0, values = [], list = "0123456789abcdefghijklmnopqrstuvwyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for(var i = 0; i < hash.length; i++) {
        var val = list.indexOf(hash[i]);
        if( val > -1 )
            value += val * Math.pow(61, hash.length - 1 - i);
    }

    /*for(var i = 0; i < values.length; i++) {
        var val = list.indexOf(hash[i]);
        if( val > -1 )
            values.push(val);
    }*/

    return value;
}
G.findRuneById = function(groups, id) {
    for(var g = 0; g < groups.length; g++) {
        console.log('rune group', groups[g]);
        var runes = groups[g].runes;
        for(var i = 0; i < runes.length; i++) {
            if( runes[i].id == id )
                return runes[i];
        }
    }

    return null;
}