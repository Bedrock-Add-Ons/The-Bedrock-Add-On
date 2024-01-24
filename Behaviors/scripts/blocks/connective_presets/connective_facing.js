import { world, BlockPermutation, system } from "@minecraft/server"

const blocksConnectiveFacing = [
    `bao:polished_glowstone_pillar`
]

function xAxis(block) {
    const permutation = block.permutation
    const blockID = block.typeId
    return permutation.matches(blockID, { "minecraft:block_face": `east` }) || permutation.matches(blockID, { "minecraft:block_face": `west` })
}
function yAxis(block) {
    const permutation = block.permutation
    const blockID = block.typeId
    return permutation.matches(blockID, { "minecraft:block_face": `up` }) || permutation.matches(blockID, { "minecraft:block_face": `down` })
}
function zAxis(block) {
    const permutation = block.permutation
    const blockID = block.typeId
    return permutation.matches(blockID, { "minecraft:block_face": `north` }) || permutation.matches(blockID, { "minecraft:block_face": `south` })
}

function getBlockFace(block) {
    let minecraftBlockFace
    switch (true) {
        case xAxis(block):
            minecraftBlockFace = `east`
            //console.warn(`east-west`)
            break;

        case yAxis(block):
            minecraftBlockFace = `up`
            //console.warn(`up-down`)
            break;

        case zAxis(block):
            minecraftBlockFace = `north`
            //console.warn(`north-west`)
            break;
    }
    return minecraftBlockFace
}


function updateBlock(block, blockID, states) {
    const permutation = BlockPermutation.resolve(blockID, states)

    system.run(
        () => {
            block.setPermutation(permutation)
        }
    )
}


function originConnect(block, blockID, originDirection) {
    if (!block.permutation.matches(blockID)) return
    let states
    switch (originDirection) {
        case "north":
            states = {
                "bao:upper_bit": block.north().permutation.matches(blockID),
                "bao:lower_bit": block.south().permutation.matches(blockID),
                "minecraft:block_face": originDirection
            }
            break;

        case "east":
            states = {
                "bao:upper_bit": block.east().permutation.matches(blockID),
                "bao:lower_bit": block.west().permutation.matches(blockID),
                "minecraft:block_face": originDirection
            }
            break;

        case "up":
            states = {
                "bao:upper_bit": block.below().permutation.matches(blockID),
                "bao:lower_bit": block.above().permutation.matches(blockID),
                "minecraft:block_face": originDirection
            }
            break;
    }
    updateBlock(block, blockID, states)
}

function adjacentConnect(block, blockID, direction, originDirection) {
    if (getBlockFace(block) == originDirection && block.permutation.matches(blockID)) {
        let states
        //console.warn(direction)
        switch (true) {
            case direction == 0:
                states = {
                    "bao:upper_bit": block.permutation.matches(blockID, { "bao:upper_bit": true }),
                    "bao:lower_bit": block.south().permutation.matches(blockID),
                    "minecraft:block_face": originDirection
                }
                break;

            case direction == 1:
                states = {
                    "bao:lower_bit": block.permutation.matches(blockID, { "bao:lower_bit": true }),
                    "bao:upper_bit": block.north().permutation.matches(blockID),
                    "minecraft:block_face": originDirection
                }
                break;

            case direction == 2:
                states = {
                    "bao:upper_bit": block.permutation.matches(blockID, { "bao:upper_bit": true }),
                    "bao:lower_bit": block.west().permutation.matches(blockID),
                    "minecraft:block_face": originDirection
                }
                break;

            case direction == 3:
                states = {
                    "bao:lower_bit": block.permutation.matches(blockID, { "bao:lower_bit": true }),
                    "bao:upper_bit": block.east().permutation.matches(blockID),
                    "minecraft:block_face": originDirection
                }
                break;

            case direction == 4:
                states = {
                    "bao:upper_bit": block.below().permutation.matches(blockID),
                    "bao:lower_bit": block.permutation.matches(blockID, { "bao:lower_bit": true }),
                    "minecraft:block_face": originDirection
                }
                break;

            case direction == 5:
                states = {
                    "bao:lower_bit": block.above().permutation.matches(blockID),
                    "bao:upper_bit": block.permutation.matches(blockID, { "bao:upper_bit": true }),
                    "minecraft:block_face": originDirection
                }
                break;
        }
        updateBlock(block, blockID, states)
    }

}


function connectionUpdatePlace(block, blockID) {
    let direction, upperBlock, lowerBlock
    const originDirection = getBlockFace(block)
    //console.warn(originDirection)
    switch (originDirection) {
        case "north":
            upperBlock = block.north()
            lowerBlock = block.south()
            direction = 0
            break

        case "east":
            upperBlock = block.east()
            lowerBlock = block.west()
            direction = 2
            break

        case "up":
            upperBlock = block.above()
            lowerBlock = block.below()
            direction = 4
            break
    }
    adjacentConnect(upperBlock, blockID, direction, originDirection)
    adjacentConnect(lowerBlock, blockID, direction + 1, originDirection)
    originConnect(block, blockID, originDirection)

}

function connectionUpdateBreak(block, blockID) {
    adjacentConnect(block.north(), blockID, 0, `north`)
    adjacentConnect(block.south(), blockID, 1, `north`)
    adjacentConnect(block.east(), blockID, 2, `east`)
    adjacentConnect(block.west(), blockID, 3, `east`)
    adjacentConnect(block.above(), blockID, 4, `up`)
    adjacentConnect(block.below(), blockID, 5, `up`)
}

world.afterEvents.playerPlaceBlock.subscribe(
    event => {
        if (event.player.isSneaking) return
        const location = event.block
        const block = event.block.dimension.getBlock(location)
        const blockID = block.typeId
        if (!blocksConnectiveFacing.includes(blockID)) return
        connectionUpdatePlace(block, blockID)
    }
)

world.afterEvents.playerBreakBlock.subscribe(
    event => {
        const location = event.block
        const block = event.block.dimension.getBlock(location)
        const blockID = event.brokenBlockPermutation.type.id
        if (!blocksConnectiveFacing.includes(blockID)) return
        connectionUpdateBreak(block, blockID)
    }
)