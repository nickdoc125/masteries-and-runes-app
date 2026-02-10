// Static Rune vars
var RUNE = {

    // Constants & Enums
    TYPE : {
        MARK : "Mark",
        SEAL : "Seal",
        GLYPH : "Glyph",
        QUINT : "Quintessence"
    },

    EFFECT : {
        HEALTH : 'Health',
        MANA : 'Mana',
        PHYSICAL : 'Physical',
        MAGIC : 'Magic',
        DEFENSE : 'Defense',
        UTILITY : 'Utility'
    },

    GLOW : {
        RED : "Red",
        BLUE : "Blue",
        YELLOW : "Yellow",
        PURPLE : "Purple"
    },

    RANK : {
        PRI : "Primary",
        SEC : "Secondary"
    },

    SPRITE_WIDTH : {
        ICON : {
            NORMAL : 32,
            QUINT : 36
        },
        NORMAL : {
            NORMAL : 49,
            QUINT : 100
        }
    },

    COORDS : [
        [24, 370],
        [39, 186],
        [401, 4],
        [86, 370],
        [66, 138],
        [463, 8],
        [158, 371],
        [107, 179],
        [550, 6],
        [26, 35],
        [8, 312],
        [119, 112],
        [431, 53],
        [70, 311],
        [154, 70],
        [507, 40],
        [125, 323],
        [204, 43],
        [599, 40],
        [182, 224],
        [29, 254],
        [265, 24],
        [482, 87],
        [76, 222],
        [343, 5],
        [555, 79],
        [113, 264],
        [371, 55],
        [576, 133],
        [413, 159]
    ],

    // Functions
    ExtractStat : function(description) {
        var perLevel = description.indexOf('per level') > -1 ? true : false;
        var ioLeftParen = description.indexOf('(');
        var ioRightParen = description.indexOf(')', ioLeftParen);
        var type = description.substring(0,1);

        function index(char) {
            var string = perLevel == true ? description.substring( ioLeftParen + 1, ioRightParen ) : description;
            return string.indexOf(char);
        }
        function sub(start, end) {
            var string = perLevel == true ? description.substring( ioLeftParen + 1, ioRightParen ) : description;
            if(end == undefined)
                return string.substring(start);
            return string.substring(start, end);
        }

        var ioSpace = index(' ');
        var ioPct = index('%');
        var value = sub( 1, ioPct > -1 ? ioPct : ioSpace );
        var stat = (perLevel == true ? description.substring( description.indexOf(' ') + 1, description.indexOf('per level') - 1 )
                : description.substring( ioSpace + 1 ) );

        var short = type+value+(ioPct > -1 ? '%':'')+' '+stat+(perLevel?' @18':'');

        return {
            name : (ioPct > -1 ? '% ' : '') + stat + (perLevel?' at level 18':''),
            value : value,
            type : type,
            scaling : perLevel,
            short : short
        }
    },

    SpriteWidth : function(type, icon) {
        icon = icon || false;
        if(icon == true) {
            if(type == RUNE.TYPE.QUINT)
                return RUNE.SPRITE_WIDTH.ICON.QUINT;
            return RUNE.SPRITE_WIDTH.ICON.NORMAL;
        }

        if(type == RUNE.TYPE.QUINT)
            return RUNE.SPRITE_WIDTH.NORMAL.QUINT;
        return RUNE.SPRITE_WIDTH.NORMAL.NORMAL;
    },

    Level : function(level) {
        if( level % 10 == 0 ) return RUNE.TYPE.QUINT;
        while( level > 10 )
            level = level % 10;
        if( level % 3 == 0 ) return RUNE.TYPE.GLYPH;
        if( (level + 1) % 3 == 0 ) return RUNE.TYPE.SEAL;
        if( (level + 2) % 3 == 0 ) return RUNE.TYPE.MARK;
        return null;
    }
};

// Rune template
var Rune = {
    id : 0,         // Integer
    type : null,    // Enum of RUNE.TYPE
    tier : 3,       // Integer
    rank :          // Enum of RUNE.RANK
      RUNE.RANK.PRI,
    effect : null,    // Enum of RUNE.TYPE
    cost : 0,       // Integer
    sprite : 1,     // Integer : -(sprite - 1) * spriteWidth
    name :          // String
      'default',
    description:'', // String
    stat : {        // Formatted String, to be turned into a plain object. Ex: "+2.7 Armor at level 18" -> "Armor|2.7|+18", "+2.0% Exp Bonus" -> "Experience|2|+%"
        name : '',      // Stat name
        value : '',     // Value of modification
        type : ''       // Modification type, ex '+', '+18', '-', '+%', '-%'
    },
    show : true,
    pos : [0,0],
    quantity : 9,
    _onCreate : function() {
        this.stat = RUNE.ExtractStat(this.description);
    }
};
var Templates = {};
Templates.Mark = Object.new(Rune, {
    type : RUNE.TYPE.MARK
});
Templates.Seal = Object.new(Rune, {
    type : RUNE.TYPE.SEAL
});
Templates.Glyph = Object.new(Rune, {
    type : RUNE.TYPE.GLYPH
});
Templates.Quintessence = Object.new(Rune, {
    type : RUNE.TYPE.QUINT,
    quantity : 3
});

var ExampleRuneset = [
    {
        name : 'Marks',
        state : 'collapsed',
        runes : []
    },{
        name : 'Seals',
        state : 'collapsed',
        runes : []
    },{
        name : 'Glyphs',
        state : 'collapsed',
        runes : []
    },{
        name : 'Quintessences',
        state : 'collapsed',
        runes : []
    }
];

for(var i = 0; i < runes.length; i++) {
    var rune = runes[i];
    if(rune.cost == 0) {
        continue;
    }
    rune.stat = RUNE.ExtractStat(rune.description);

    var runetypes = [ RUNE.TYPE.MARK, RUNE.TYPE.SEAL, RUNE.TYPE.GLYPH, RUNE.TYPE.QUINT];
    for(var rt = 0; rt < runetypes.length; rt++) {
        if(rune.name.indexOf(runetypes[rt]) > -1 ) {
            rune.type = runetypes[rt];

            rune.id = parseInt(rune.id);
            rune.cost = parseInt(rune.cost);
            rune.rank = rune.rank == 1 ? RUNE.RANK.PRI : RUNE.RANK.SEC;
            rune.tier = parseInt(rune.tier);

            ExampleRuneset[rt].runes.push( Object.new(Templates[rune.type], rune) );
        }
    }
}