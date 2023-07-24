#######################################################################################
# By DW623
# Ran by ticks.json
# This just shows you what direction you are heading in the action bar
#                          N,NE,E,SE,S,SW,W,NW
# Note: The ability for each player to turn toggle it off and on for themselves
#       cannot be added back until Phase 2 when we can add items
#       Then I can add the toggle.mcfunction, the item and the recipe
#######################################################################################
# Tracks the tick count for running the actionbar, since every tick is too much
    scoreboard objectives add compassTicks dummy 
    scoreboard players add Ticks compassTicks 1
    scoreboard players set Ticks_Max compassTicks 691200
#######################################################################################
# User (yes you) - Change iteration to between 5 and 30 - remember 20 ticks is one second
    scoreboard players set Tick_Iteration compassTicks 15
#######################################################################################
# Players - default is to show compass, can be toggled on and off via the compass toggle
# To be released in Phase 2
    scoreboard objectives add noCompass dummy 
    scoreboard players add @a noCompass 0
    # just in case
    scoreboard players set @a[scores={noCompass=..-1}] noCompass 1
	scoreboard players set @a[scores={noCompass=2..}] noCompass 1
#######################################################################################
# Mod 15 ticks 3/4 second
    scoreboard players operation TicksModCheck compassTicks = Ticks compassTicks
    scoreboard players operation TicksModCheck compassTicks %= Tick_Iteration compassTicks
    execute if score TicksModCheck compassTicks matches 0 as @a[scores={noCompass=0}] run function compass/display
    execute if score Ticks compassTicks >= Ticks_Max compassTicks run scoreboard players set Ticks compassTicks 0
#######################################################################################    
#End