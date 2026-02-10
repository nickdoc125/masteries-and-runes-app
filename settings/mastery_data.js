var data = [
    // offensive
    [
        {
            id: 103, // Deadliness
            index: 1,
            name: "Deadliness",
            ranks: 3,
            desc: "+#% Critical Strike Chance",
            rankInfo: [0.66, 1.33, 2],
        },
        {
            id: 136, // Cripple
            index: 2,
            name: "Cripple",
            ranks: 1,
            desc: "|Empowers Exhaust:|\nReduce the target's Armor and Magic Resistance by 10.\nIncreases the spell's duration by 0.5 seconds.",
            rankInfo: [],
        },
        {
            id: 126, // Plentiful Bounty
            index: 3,
            name: "Plentiful Bounty",
            ranks: 1,
            desc: "|Empowers  Smite:|\n\tGrants 5 Bonus Gold on use.\nReduces the spell's cooldown by 5 seconds.",
            rankInfo: [],
        },
        {
            id: 106, // Archmage's Savvy
            index: 4,
            name: "Archmage's Savvy",
            ranks: 3,
            desc: "+# Ability Power per level",
            rankInfo: [0.2, 0.4, 0.6],
        },
        {
            id: 102, // Sorcery
            index: 6,
            name: "Sorcery",
            ranks: 4,
            desc: "+#% Cooldown Reduction.",
            rankInfo: [0.75, 1.5, 2.25, 3],
        },
        {
            id: 105, // Alacrity
            index: 7,
            name: "Alacrity",
            ranks: 4,
            desc: "+#% Attack Speed",
            rankInfo: [1, 2, 3, 4],
        },
        {
            id: 146, // Burning Embers
            index: 9,
            name: "Burning Embers",
            ranks: 1,
            desc: "|Empowers  Ignite:|\nWhile the spell is on cooldown, the user gains 10 Ability Power.",
            rankInfo: [],
        },
        {
            id: 107, // Archaic Knowledge
            index: 10,
            name: "Archaic Knowledge",
            ranks: 1,
            desc: "+15% Magic Penetration.",
            rankInfo: [],
            parent: 4,
        },
        {
            id: 101, // Sunder
            index: 11,
            name: "Sunder",
            ranks: 3,
            desc: "+# Armor Penetration.",
            rankInfo: [2, 4, 6],
        },
        {
            id: 137, // Offensive Mastery
            index: 12,
            name: "Offensive Mastery",
            ranks: 2,
            desc: "Basic attacks and single target spells deal # bonus damage to minions and monsters.",
            rankInfo: [2, 4],
        },
        {
            id: 100, // Brute Force
            index: 14,
            name: "Brute Force",
            ranks: 3,
            desc: "+# Attack Damage.",
            rankInfo: [1, 2, 3],
        },
        {
            id: 139, // Demolisher
            index: 15,
            name: "Demolisher",
            ranks: 1,
            desc: "|Empowers  Promote:|\nReduces the spell's cooldown by 15 seconds.\nWhile the spell is off cooldown, the user deals 15 more damages to turrets.\nWhile the spell is off cooldown, promoted units gain 20 Armor.",
            rankInfo: [],
        },
        {
            id: 104, // Lethality
            index: 18,
            name: "Lethality",
            ranks: 3,
            desc: "+#% Critical Strike Damage",
            rankInfo: [3.33, 6.66, 10],
        },
        {
            id: 143, // Improved Rally
            index: 19,
            name: "Improved Rally",
            ranks: 1,
            desc: "|Empowers Rally:|\nGrants 20 - 70 Ability Power.\nReduces the spell's cooldown by 5 seconds.",
            rankInfo: [],
        },
        {
            id: 123, // Havoc
            index: 22,
            name: "Havoc",
            ranks: 1,
            desc: "+4% Physical and Magical damages.",
            rankInfo: [],
        },
    ],
    // defensive
    [
        {
            id: 133, // Mender's Faith
            index: 1,
            name: "Mender's Faith",
            ranks: 1,
            desc: "|Empowers  Heal:|\nReduces the spell's cooldown by 30 seconds.",
            rankInfo: [],
        },
        {
            id: 110, // Resistance
            index: 2,
            name: "Resistance",
            ranks: 3,
            desc: "+# Magic Resistance.",
            rankInfo: [2, 4, 6],
        },
        {
            id: 129, // Preservation
            index: 3,
            name: "Preservation",
            ranks: 1,
            desc: "|Empowers  Revive:|\nGrants 400 bonus health after reviving for 120 seconds.\nReduces the spell's cooldown by 30 seconds.",
            rankInfo: [],
        },
        {
            id: 109, // Hardiness
            index: 4,
            name: "Hardiness",
            ranks: 3,
            desc: "+# Armor.",
            rankInfo: [2, 3.5, 5],
        },
        {
            id: 112, // Strength of Spirit
            index: 6,
            name: "Strength of Spirit",
            ranks: 3,
            desc: "Increases Health Regeneration by #% Maximum Mana.",
            rankInfo: [0.33, 0.66, 1],
            parent: 1,
        },
        {
            id: 114, // Evasion
            index: 7,
            name: "Evasion",
            ranks: 4,
            desc: "+#% Dodge Chance",
            rankInfo: [0.5, 1, 1.5, 2],
        },
        {
            id: 144, // Defensive Mastery
            index: 10,
            name: "Defensive Mastery",
            ranks: 2,
            desc: "Reduces by # damage taken from minions and monsters.",
            rankInfo: [1, 2],
        },
        {
            id: 127, // Nimbleness
            index: 11,
            name: "Nimbleness",
            ranks: 1,
            desc: "+10% bonus movement speed for 5 seconds after dodging an attack.",
            rankInfo: [],
            parent: 5
        },
        {
            id: 113, // Harden Skin
            index: 12,
            name: "Harden Skin",
            ranks: 3,
            desc: "Blocks # physical damage from all sources",
            rankInfo: [1, 1.5, 2],
            parent: 3
        },
        {
            id: 108, // Veteran's Scars
            index: 14,
            name: "Veteran's Scars",
            ranks: 4,
            desc: "+# Health.",
            rankInfo: [12, 24, 36, 48],
        },
        {
            id: 131, // Willpower
            index: 15,
            name: "Willpower",
            ranks: 1,
            perlevel: 1,
            desc: "|Empowers Cleanse:|\nReduces the spell's cooldown by 20 seconds.",
            rankInfo: [],
        },
        {
            id: 111, // Ardor
            index: 18,
            name: "Ardor",
            ranks: 3,
            desc: "+#% Ability Power\n+#% Attack Speed",
            rankInfo: [1.33, 2.66, 4],
        },
        {
            id: 145, // Reinforce
            index: 19,
            name: "Reinforce",
            ranks: 1,
            desc: "|Empowers Fortify and Garrison:|\nGrant affected allied turrets 50% splash damage.",
            rankInfo: [],
        },
        {
            id: 125, // Tenacity
            index: 22,
            name: "Tenacity",
            ranks: 1,
            desc: "Reduces all damage dealt to your champion by 4%.",
            rankInfo: [],
        },
    ],
    [
        {
            id: 124, // Spatial Accuracy
            index: 1,
            name: "Spatial Accuracy",
            ranks: 1,
            desc: "|Empowers  Teleport and  Promote:|\nReduces  Teleport's channel time by 0.5 second and reduces its cooldown by 5 seconds.\nReduces  Promote's cooldown by 30 seconds.",
            rankInfo: [],
        },
        {
            id: 134, // Good Hands
            index: 2,
            name: "Good Hands",
            ranks: 3,
            desc: "Reduces time spent dead by #%",
            rankInfo: [3.33, 6.66, 10],
        },
        {
            id: 132, // Perseverance
            index: 3,
            name: "Perseverance",
            ranks: 3,
            desc: "+#% Total Health Regeneration and Mana Regeneration.",
            rankInfo: [2, 3, 4],
        },
        {
            id: 130, // Haste
            index: 4,
            name: "Haste",
            ranks: 1,
            desc: "|Empowers  Ghost:|\nIncreases the movement speed bonus by 6%.\nIncreases its duration by 1.5 seconds.",
            rankInfo: [],
        },
        {
            id: 116, // Awareness
            index: 6,
            name: "Awareness",
            ranks: 4,
            desc: "Increases champion experience gained by #%.",
            rankInfo: [1.25, 2.5, 3.75, 5],
        },
        {
            id: 115, // Expanded Mind
            index: 7,
            name: "Expanded Mind",
            ranks: 4,
            desc: "+#% Maximum Mana.",
            rankInfo: [1.25, 2.5, 3.75, 5],
        },
        {
            id: 117, // Greed
            index: 9,
            name: "Greed",
            ranks: 1,
            desc: "+1 Gold per 10 seconds.",
            rankInfo: [],
        },
        {
            id: 121, // Meditation
            index: 10,
            name: "Meditation",
            ranks: 3,
            desc: "+# Mana Regeneration per 5 seconds.",
            rankInfo: [1, 2, 3],
        },
        {
            id: 135, // Utility Mastery
            index: 11,
            name: "Utility Mastery",
            ranks: 2,
            desc: "Increases the duration of shrines, relics, quests, and neutral monster buffs by #%.",
            rankInfo: [15, 30],
        },
        {
            id: 147, // Insight
            index: 12,
            name: "Insight",
            ranks: 1,
            desc: "|Empowers Clarity:|\nGrants the same amount of mana to allies as your champion receives.",
            rankInfo: [],
        },
        {
            id: 119, // Quickness
            index: 15,
            name: "Quickness",
            ranks: 3,
            desc: "+#% Movement Speed",
            rankInfo: [1, 2, 3],
        },
        {
            id: 140, // Blink of an Eye
            index: 16,
            name: "Blink of an Eye",
            ranks: 1,
            desc: "|Empowers Flash:|\nReduces the spell's cooldown by 15 seconds.",
            rankInfo: [],
        },
        {
            id: 118, // Intelligence
            index: 18,
            name: "Intelligence",
            ranks: 3,
            desc: "+#% Cooldown Reduction.",
            rankInfo: [2, 4, 6],
        },
        {
            id: 122, // Mystical Vision
            index: 19,
            name: "Mystical Vision",
            ranks: 1,
            desc: "|Empowers  Clairvoyance:|\nIncreases the spell's duration by 4 seconds.\nReduces the spell's cooldown by 5 seconds.",
            rankInfo: [],
        },
        {
            id: 120, // Presence of the Master
            index: 22,
            name: "Presence of the Master",
            ranks: 1,
            desc: "Reduces the cooldown of your Summoner Spells by 15%.",
            rankInfo: [],
        },
    ]
];