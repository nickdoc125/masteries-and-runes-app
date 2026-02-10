// Controller
var app = angular.module('RunepageApp', []);

app.directive('ngeClick', function($document, $parse) {
    return function(scope, element, attr) {
        element.click(function(e){
            e.preventDefault();
            var fn = $parse(attr['ngeClick']);
            scope.$apply(function() {
                fn(scope, {
                    event: e
                });
            });
            return false;
        });
    }
});

app.directive('ngRclick', function($parse) {
    return function(scope, element, attr) {
        element.bind('contextmenu', function(event) {
            event.preventDefault();
            var fn = $parse(attr['ngRclick']);
            scope.$apply(function() {
                fn(scope, {
                    event: event
                });
            });
            return false;
        });
    }
});

app.factory('service', function($rootScope){
    var bundle = {};

    bundle.runes = G.iterate( function(){
        return Object.create(Rune);
    }, 30 );

    bundle.rune = null;
    bundle.quantity = 0;
    bundle.url = '';
    bundle.addRune = function(rune, quantity) {
        this.rune = rune;
        var s = this;

        for(var r = 0; r < quantity; r++){
            for(var i = 0; i < 30; i++) {
                if(RUNE.Level(i+1) != rune.type || s.runes[i].type != null) continue;

                s.runes[i] = Object.create(rune);
                s.runes[i].pos = RUNE.COORDS[i];
                s.totalCost += rune.cost;
                console.log('Rune added successfully', i, s.runes[i], rune.cost, s.totalCost);
                s.quantity++;
                s.broadcastRuneAdded();
                break;
            }
        }
    }
    bundle.totalCost = 0;
    bundle.remRune = function(rune, quantity) {
        this.rune = rune;
        var s = this;

        var i = s.runes.indexOf(rune);
        if( i < 0 ) return;
        if(quantity == 1) {
            s.runes[i] = Object.create(Rune);
            s.totalCost -= rune.cost;
            this.broadcastRuneRemoved();
            return;
        }

        for(var r = 0; r < quantity; r++) {
            for(var i = 0; i < s.runes.length; i++) {
                if(s.runes[i].id == rune.id) {
                    s.runes[i] = Object.create(Rune);
                    s.totalCost -= rune.cost;
                    this.broadcastRuneRemoved();
                    break;
                }
            }
        }
    }
    bundle.removeAll = function() {
        var s = this;

        for(var i = 0; i < s.runes.length; i++) {
            if(s.runes[i].id > 0) {
                this.rune = s.runes[i];
                this.broadcastRuneRemoved();
                s.runes[i] = Object.create(Rune);
                s.totalCost -= s.runes[i].cost;
            }
        }
        s.totalCost = 0;
        this.broadcastReset();
    }
    bundle.broadcastRuneRemoved = function() {
        this.createUrlString();
        $rootScope.$broadcast('runeRemoved');
    }
    bundle.broadcastRuneAdded = function() {
        this.createUrlString();
        $rootScope.$broadcast('runeAdded');
    }
    bundle.broadcastReset = function() {
        this.createUrlString();
        $rootScope.$broadcast('runesReset');
    }

    bundle.createUrlString = function() {
        var s = this;
        var ids = [];

        for(var i = 0; i < s.runes.length; i++) {
            var id = s.runes[i].id;
            if(!(id > 0)) continue;
            var index = ids.indexOf(id);
            if(index < 0)
                ids.push(id);
            else {
                ids.splice(index, 0, id);
            }
        }

        var count = 0;
        var urlString = '';
        var last = ids[0];
        for(var i = 0; i < ids.length; i++) {
            if( last == ids[i] ) {
                count++;
            } else {
                urlString += last + 'x' + count + ',';
                last = ids[i];
                count = 1;
            }
        }
        urlString += last + 'x' + count;

        if(urlString == 'undefinedx0') urlString = '';

        this.url = urlString;

        if(urlString == '')
            window.history.propertyIsEnumerable('', '', ' ');
        else
            window.history.propertyIsEnumerable("", "", urlString );

        $rootScope.$broadcast('urlModified');
    }

    bundle.reverseUrl = function(hash) {
        console.log('🔄 reverseUrl called with hash:', hash);
        
        var runes = [];
        var string = hash;
        
        if (string.startsWith('#')) {
            string = string.substring(1);
        }
        
        console.log('Cleaned string:', string);
        
        var pairs = string.split(',');
        console.log('Rune pairs:', pairs);
        
        for(var p = 0; p < pairs.length; p++) {
            var pair = pairs[p];
            if (pair.indexOf('x') === -1) {
                console.log('❌ Invalid pair (no x):', pair);
                continue;
            }
            
            var parts = pair.split('x');
            if (parts.length !== 2) {
                console.log('❌ Invalid pair format:', pair);
                continue;
            }
            
            var runeId = parseInt(parts[0]);
            var runeCount = parseInt(parts[1]);
            
            // Αν το runeId είναι NaN, δοκίμασε base61 decoding
            if (isNaN(runeId)) {
                console.log('Trying base61 decoding...');
                runeId = G.reverseRadix(parts[0]);
                console.log('Base61 decoded RuneID:', runeId);
            }
            
            console.log('Pair:', pair, '-> RuneID:', runeId, 'Count:', runeCount);
            
            for(var i = 0; i < runeCount; i++) {
                runes.push(runeId);
            }
        }
        
        console.log('Final runes array:', runes);
        return runes;
    }

    bundle.level = 30;
    bundle.setLevel = function(lvl) {
        if(lvl < 1) lvl = 1;
        if(lvl > 30) lvl = 30;
        this.level = lvl;
        this.broadcastLevelChanged();
    }
    bundle.incLevel = function() { this.setLevel( this.level + 1 ); }
    bundle.decLevel = function() { this.setLevel( this.level + 1 ); }
    bundle.broadcastLevelChanged = function() {
        $rootScope.$broadcast('levelChanged');
    }

    return bundle;
});

app.factory('settings', function($rootScope){
    var settings = {};

    var Setting = {
        name : '',
        enabled : true,
        _construct : function() {
            var args = arguments[0];
            if( typeof args === 'string')
                this.name = args;
            else {
                this.name = args.name;
                this.enabled = args.enabled;
            }
        }
    };
    var TypeSetting = Object.extend(Setting, {
        type : 'typesetting'
    });
    var TierSetting = Object.extend(Setting, {
        type : 'tier',
        enabled : false
    });

    settings.types = [
        Object.new(TypeSetting, 'All'),
        Object.new(TypeSetting, 'Health'),
        Object.new(TypeSetting, 'Mana'),
        Object.new(TypeSetting, 'Physical'),
        Object.new(TypeSetting, 'Magic'),
        Object.new(TypeSetting, 'Defense'),
        Object.new(TypeSetting, 'Utility')
    ];

    settings.tiers = [
        Object.new(TierSetting, { name : 'Tier 3', enabled : true }),
        Object.new(TierSetting, 'Tier 2'),
        Object.new(TierSetting, 'Tier 1')
    ];

    settings.broadcastChange = function() {
        $rootScope.$broadcast('settingChanged');
    }

    return settings;
});

app.controller('Settings', function ($scope, service, settings) {
    $scope.types = settings.types;
    $scope.tiers = settings.tiers;

    $scope.toggle = function(event, setting) {
        setting.enabled = !setting.enabled;
        if(setting.type == 'typesetting') {
            if(setting.name == 'All') {
                $.each($scope.types, function(i,o){
                    o.enabled = setting.enabled;
                });
                settings.broadcastChange();
                return;
            }
            var enabled = 0;
            $.each($scope.types, function(i,o) {
                if(o.name == 'All') return;
                enabled += o.enabled == true ? 1 : 0;
            });
            if( enabled == $scope.types.length - 1)
                $scope.types[0].enabled = true;
            else
                $scope.types[0].enabled = false;
        }

        if(setting.type == 'tier') {
            $.each($scope.tiers, function(i,o){
                if(o == setting)
                    o.enabled = true;
                else
                    o.enabled = false;
            });
        }

        settings.broadcastChange();
    }
    settings.broadcastChange();
});

app.controller('Overview', function ($scope, service, settings) {
    $scope.totalCost = service.totalCost;

    $scope.url = service.url;

    $scope.$on('urlModified', function(){
        $scope.url = service.url;
    })

    $scope.formatCost = function() {
        var cost = service.totalCost.toString();
        var count = Math.floor((cost.length - 1) / 3);
        for(var i = 0; i < count; i++) {
            var l = cost.length - (i+1)*3;
            cost = cost.substring(0, l) + ',' + cost.substring(l);
        }

        return cost;
    }

    $scope.reset = function() {
        service.removeAll();
    }
});

app.controller('Runes', function ($scope, service, settings) {
    $scope.groups = ExampleRuneset;

    $scope.toggleGroup = function(event, group) {
        var state = (group.state == 'expanded') ? 'collapsed' : 'expanded';

        if(event.ctrlKey == true) {
            $.each($scope.groups, function(i, g) {
                g.state = state;
            });
        } else {
            group.state = state;
        }
    }

    $scope.onClick = function(event, rune) {
        if(rune.quantity < 1) { return; }
        var quantity = event.ctrlKey !== true ? 1 :
          rune.type == RUNE.TYPE.QUINT ? 3 : 9;
        service.addRune(rune, quantity);
    }

    $scope.$on('runeAdded', function() {
        for(var g = 0; g < $scope.groups.length; g++) {
            var i = $scope.groups[g].runes.indexOf(service.rune);
            if( i > -1 ) {
                console.log('rune found', $scope.groups[g].runes[i] );
                $scope.groups[g].runes[i].quantity--;
                if($scope.groups[g].runes[i].quantity == 0)
                    G.setRGMaxHeight($scope.groups[g]);
            }
        }
    });

    $scope.$on('runeRemoved', function() {
        for(var g = 0; g < $scope.groups.length; g++) {
            var i = G.runeIndex($scope.groups[g].runes, service.rune);
            if( i > -1 ) {
                $scope.groups[g].runes[i].quantity ++;
                if($scope.groups[g].runes[i].quantity == 1)
                    G.setRGMaxHeight($scope.groups[g]);
            }
        }
    });

    $scope.formatStyle = function(rune) {
        return {
            'background-position' : -(rune.sprite-1)*RUNE.SpriteWidth(rune.type, true)+'px center'
        }
    }

    $scope.$on('settingChanged', function() {

        function checkEffect(rune) {
            if( settings.types[0].enabled == true )
                return true;

            if( rune.effect == RUNE.EFFECT.HEALTH.toUpperCase() && settings.types[1].enabled == true ||
              rune.effect == RUNE.EFFECT.MANA.toUpperCase() && settings.types[2].enabled == true ||
              rune.effect == RUNE.EFFECT.PHYSICAL.toUpperCase() && settings.types[3].enabled == true ||
              rune.effect == RUNE.EFFECT.MAGIC.toUpperCase() && settings.types[4].enabled == true ||
              rune.effect == RUNE.EFFECT.DEFENSE.toUpperCase() && settings.types[5].enabled == true ||
              rune.effect == RUNE.EFFECT.UTILITY.toUpperCase() && settings.types[6].enabled == true
            ) {
                return true;
            }
            return false;
        }

        function checkTier(rune) {
            if( rune.tier == 3 && settings.tiers[0].enabled == true ||
              rune.tier == 2 && settings.tiers[1].enabled == true ||
              rune.tier == 1 && settings.tiers[2].enabled == true
            ) {
                return true;
            }
            return false;
        }

        var runesShown = 0;
        $.each($scope.groups, function(g, group){
            $.each(group.runes, function(r, rune){
                rune.state = rune.quantity > 0 ? 'visible' : 'hidden';

                if( checkEffect(rune) == false ) {
                    rune.show = false;
                    rune.state = 'hidden';
                    return;
                }

                if( checkTier(rune) == false ) {
                    rune.show = false;
                    rune.state = 'hidden';
                    return;
                }

                runesShown++;
                rune.show = true;
            });
            G.setRGMaxHeight(group);
        });
    });

    $scope.fillRunes = function(hash) {
        console.log('🎯 fillRunes called with:', hash);
        
        // Clear current runes first
        service.removeAll();
        
        var runes = service.reverseUrl(hash);
        console.log('Parsed runes:', runes);
        
        for(var i = 0; i < runes.length; i++) {
            var rune = G.findRuneById($scope.groups, runes[i]);
            if (rune) {
                console.log('Adding rune:', rune.id, rune.name);
                service.addRune(rune, 1);
            } else {
                console.log('❌ Rune not found with ID:', runes[i]);
            }
        }
    }
});

app.controller('Runepage', function ($scope, service) {
    $scope.runes = service.runes;

    $scope.formatStyle = function(rune) {
        return {
            'background-position' : -(rune.sprite-1)*RUNE.SpriteWidth(rune.type)+'px center',
            left : rune.pos[0]+'px',
            top : rune.pos[1]+'px'
        }
    }

    $scope.onClick = function(event, rune) {
        var quantity = event.ctrlKey !== true ? 1 :
          rune.type == RUNE.TYPE.QUINT ? 3 : 9;
        service.remRune(rune, quantity);
    }
});

app.controller('Statistics', function ($scope, service) {
    $scope.stats = [];

    // Προσδιορισμός προτεραιότητας για κάθε stat
    var statPriority = {
        "Attack Damage": 1,
        "Ability Power": 2,
        "Armor": 3,
        "Magic Resist": 4,
        "Health": 5,
        "Health Regeneration": 6,
        "Mana": 7,
        "Mana Regeneration": 8,
        "Attack Speed": 9,
        "Critical Strike Chance": 10,
        "Critical Strike Damage": 11,
        "Life Steal": 12,
        "Spell Vamp": 13,
        "Armor Penetration": 14,
        "Magic Penetration": 15,
        "Cooldown Reduction": 16,
        "Movement Speed": 17,
        "Gold per 10": 18,
        "Experience Gain": 19,
        "Time Spent Dead": 20
    };

    // Αρχικοποίηση stats object για καλύτερη διαχείριση
    $scope.statsMap = {};

    $scope.formatStatValue = function(stat) {
        var value = stat.value;
        
        if (value === 0) return '0';
        
        // Format based on stat type
        if (stat.type === 'percent' || stat.type === '%') {
            return G.decimal(value * 100, 1) + '%';
        } else if (stat.type === 'flat' || !stat.type) {
            // For flat values, show 1 decimal place if needed
            if (Math.abs(value - Math.round(value)) > 0.01) {
                return G.decimal(value, 1);
            } else {
                return Math.round(value).toString();
            }
        } else {
            return G.decimal(value, 1);
        }
    }

    $scope.updateStat = function(stat, multiplier) {
        var value = stat.value * multiplier;
        var statKey = stat.name;
        
        if (!$scope.statsMap[statKey]) {
            // Προσθήκη νέου stat
            $scope.statsMap[statKey] = { 
                name: stat.name, 
                value: value, 
                type: stat.type || 'flat',
                priority: statPriority[stat.name] || 999 // Προσθήκη προτεραιότητας
            };
            $scope.statsMap[statKey].stringVal = $scope.formatStatValue($scope.statsMap[statKey]);
        } else {
            // Ενημέρωση υπάρχοντος stat
            $scope.statsMap[statKey].value += value;
            $scope.statsMap[statKey].stringVal = $scope.formatStatValue($scope.statsMap[statKey]);
            
            // Αφαίρεση αν η τιμή είναι 0
            if (Math.abs($scope.statsMap[statKey].value) < 0.001) {
                delete $scope.statsMap[statKey];
            }
        }
        
        // Ενημέρωση του stats array
        $scope.updateStatsArray();
    }

    $scope.updateStatsArray = function() {
        $scope.stats = [];
        for (var key in $scope.statsMap) {
            if ($scope.statsMap.hasOwnProperty(key)) {
                $scope.stats.push($scope.statsMap[key]);
            }
        }
        
        // Ταξινόμηση με βάση την προτεραιότητα και μετά αλφαβητικά
        $scope.stats.sort(function(a, b) {
            var priorityA = a.priority || 999;
            var priorityB = b.priority || 999;
            
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }
            
            // Αν έχουν ίδια προτεραιότητα, ταξινόμηση αλφαβητικά
            return a.name.localeCompare(b.name);
        });
    }

    $scope.$on('runeAdded', function() {
        console.log('➕ Rune added - updating stats:', service.rune);
        if (service.rune && service.rune.stat) {
            $scope.updateStat(service.rune.stat, 1);
        }
    });

    $scope.$on('runeRemoved', function() {
        console.log('➖ Rune removed - updating stats:', service.rune);
        if (service.rune && service.rune.stat) {
            $scope.updateStat(service.rune.stat, -1);
        }
    });

    $scope.$on('runesReset', function() {
        console.log('🔄 Runes reset - clearing stats');
        $scope.statsMap = {};
        $scope.stats = [];
    });

    // Debug function
    $scope.debugStats = function() {
        console.log('📊 Current stats:', $scope.stats);
        console.log('📊 Stats map:', $scope.statsMap);
    }

    // Αρχική αρχικοποίηση
    $scope.updateStatsArray();
});

// On page load
$([
    'tools/runepage/images/mark_sprite.png',
    'tools/runepage/images/seal_sprite.png',
    'tools/runepage/images/glyph_sprite.png',
    'tools/runepage/images/quint_sprite.png'
]).preload();

$(function(){
    $(".custom-scroll").mCustomScrollbar({
        scrollInertia : 200,
        autoHideScrollbar: true,
        scrollButtons:{
            enable: true
        },
        advanced:{
            updateOnContentResize: true
        }
    });

    G.initRGMaxHeight();

    $('#runes .rune').hover(function(e){
        $r = $(this);
        $t = $r.find('.rune-tooltip');
        var o = $r.offset();
        o.left += 220;
        o.top -= 18;
        $t.css(o);
    });

    $("#shareButton").tooltip({
        placement : 'right',
        title : 'Key copied',
        trigger : 'click'
    });

    $('#shareButton').click(function() {
        var urlString = $('#shareUrl').val();
        
        if (!urlString) {
            console.error('No key found');
            return;
        }
        
        // Copy to clipboard
        var tempInput = document.createElement('input');
        tempInput.value = urlString;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, 99999);
        
        try {
            var successful = document.execCommand('copy');
            if (successful) {
                console.log('Key copied to clipboard:', urlString);
            }
        } catch (err) {
            console.log('Failed to copy: ', err);
        }
        
        document.body.removeChild(tempInput);
        
        // Εμφάνιση tooltip
        $('#shareButton').tooltip('show');
        setTimeout(function(){
            $('#shareButton').tooltip('hide');
        }, 1000);
        
        // Notify profiles manager
        setTimeout(() => {
            if (window.runeProfilesManager) {
                window.runeProfilesManager.highlightCurrentProfile();
            }
        }, 300);
    });

    // Global function για external access
    window.applyRuneKey = function(key) {
        console.log('🌐 Global applyRuneKey called with:', key);
        var runesScope = angular.element($('#runes')).scope();
        if (runesScope && runesScope.fillRunes) {
            runesScope.$apply(function() {
                runesScope.fillRunes(key);
            });
            return true;
        }
        return false;
    }

    if(QueryVars.hash != '') {
        angular.element($('#runes')).scope().fillRunes(QueryVars.hash);
    }
});