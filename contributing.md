Thanks for contributing to the add-on. Please note the below phases, implementation details, and systems guidelines *before* contributing.

# Phases
Development of the add-on is divided into progressive phases to ensure some coherence… at least early on. No timetable is set on phase length. The current phase is **Phase 1**.

## Phase 1: Tweaks
Only small tweaks will be accepted in Phase 1. Example tweaks include:

- Entity health, damage, and drops
- Spawn rules
- Structure loot
- Trading
- Recipe adjustments
- Non-gameplay mob variants

The player definitions may not be altered in this phase.

## Phase 2: Reworks & New Mobs
Phase 2 opens up much more than Phase 1:

- New blocks, items, and mobs will be accepted.
- Existing entities, including the player, may be heavily reworked.
- Scripting systems 

Note that core game progression (portal ⃯→ Nether fortress → stronghold → Ender dragon) may not be affected.

## Phase 3: Game Rework
In this final phase, *nothing* is off limits, including core game progression.

# Implementation Notices
A few details implementation details should be noted:

- The add-on minimum engine version will always be kept up-to-date.
- Definition format versions must be (amongst) the newest available.
- Experimental features are not yet available. They may be made available in Phase 2 following community consensus.
- All interfaces must be available in the release client. Systems using interfaces only available to Preview will be rejected.

# System Guidelines
A few systems may have particular guidelines depending on contributor requests…

## Namespace
All non-vanilla definitions will use the namespace `bao` as a standard.

## A Word on Art Assets
Extra care should always be taken in creating art assets to - as near as is comfortably possible - adhere to Vanilla styling and philosophy. Elements to consider include (but are, of course, not limited to):

- **Voxels**: Please mind the count of elements for custom models, applying Vanilla proportions and simplification.
- **Palettes**: Try to limit colours for any textured assets, drawing directly from Vanilla styling where applicable.
- **Resolution**: Please remain within 16x pixel resolution.

## Regarding JsonUI
Bedrock's User Interface system is not particularly intuative at the best of times, so cohenency and compatability are paramount. No short-cuts are to be taken as not to introduce any conflicts, potentially hindering others with their work. The following is the least that must be comformed to:

- **Common Elements**: Not to be overwritten under any circumstances.
- **Vanilla Textures**: Nothing within `textures/ui` or `textures/gui` is to be modified, though new content can be added here.
- **Titles**: Substring detection utilising `/title` is acceptable should the command be ran through a script, having nothing hard-coded using static title commands.
- **Visuals**: Please refer to the Word on Art Assets section above, heed it where applicable. Stick to a 1:1 element scale.