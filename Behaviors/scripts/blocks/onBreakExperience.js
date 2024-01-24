import { world, system } from "@minecraft/server"

const dropsExperience = [
    `minecraft:wheat`,
    `minecraft:beetroot`,
    `minecraft:carrots`,
    `minecraft:potatoes`,
]

world.beforeEvents.playerBreakBlock.subscribe(
    event => {
        const location = event.block
        const block = event.block.dimension.getBlock(location)
        const blockID = block.typeId
        if (!dropsExperience.includes(blockID)) return
        if (Math.random() > 0.6 && block.permutation.matches(blockID, {"growth": 7})) {
            system.run(() => {
                block.dimension.spawnEntity(`minecraft:xp_orb`, block.center())
            })
        }
    }
)