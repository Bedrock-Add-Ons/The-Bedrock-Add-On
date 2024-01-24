import { world, BlockPermutation } from "@minecraft/server"
import { getPlayerYRot } from "utilities/getTargetBlocks"

const placementUpdates = [
    `bao:cooking_pot`
]

world.afterEvents.playerPlaceBlock.subscribe(
    event => {
        const location = event.block
        const block = event.block.dimension.getBlock(location)
        const blockID = block.typeId
        if (!placementUpdates.includes(blockID)) return
        const direction = getPlayerYRot(event.player)
        block.setPermutation(BlockPermutation.resolve(blockID, { "bao:is_placed": true, "bao:direction": direction }))
    }
)