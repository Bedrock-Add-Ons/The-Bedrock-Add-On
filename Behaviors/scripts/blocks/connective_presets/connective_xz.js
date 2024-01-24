import { world, BlockPermutation, system, Direction } from "@minecraft/server"
import { isReplaceable, isValidConnection, isInteractable } from "data/blockLists"
import { switchBlockFaces } from "utilities/getTargetBlocks"

const blockConnectiveXZ = [
    `bao:framed_glass_pane`,
    `bao:ornate_framed_glass_pane`,
    `bao:small_framed_glass_pane`,
    `bao:rounded_framed_glass_pane`,
    `bao:shimmer_glass_pane`,
    `bao:tinted_glass_pane`,
    `bao:bamboo_paper_panel`
]

function connectAny(block, item, direction) {
    const blockID = item == undefined ? block.typeId : item
    if (!blockConnectiveXZ.includes(blockID)) return
    const states = {
        "bao:north": !isValidConnection(block.north()) || direction == `south`,
        "bao:south": !isValidConnection(block.south()) || direction == `north`,
        "bao:east": !isValidConnection(block.east()) || direction == `west`,
        "bao:west": !isValidConnection(block.west()) || direction == `east`,
        "bao:is_placed": true
    }
    const permutation = BlockPermutation.resolve(blockID, states)

    system.run(
        () => {
            block.setPermutation(permutation)
        }
    )
}

function connectionUpdate(block, blockBreak) {
    connectAny(block.north(), undefined, blockBreak == true ? false : `north`)
    connectAny(block.south(), undefined, blockBreak == true ? false : `south`)
    connectAny(block.east(), undefined, blockBreak == true ? false : `east`)
    connectAny(block.west(), undefined, blockBreak == true ? false : `west`)
}

world.afterEvents.playerPlaceBlock.subscribe(
    event => {
        const location = event.block
        const block = event.block.dimension.getBlock(location)
        if (isValidConnection(block)) return
        connectionUpdate(block, false)
    }
)

world.afterEvents.playerBreakBlock.subscribe(
    event => {
        const location = event.block
        const block = event.block.dimension.getBlock(location)
        connectionUpdate(block, true)
    }
)

world.beforeEvents.itemUseOn.subscribe(
    event => {
        const player = event.source
        const item = event.itemStack.typeId
        const block = event.block
        const location = block.location

        if (isInteractable(block) && !player.isSneaking) return

        // Debouncer
        const oldInterval = console.log[JSON.stringify(item)];
        //const oldLocation = console.log[JSON.stringify(location)];
        //if (oldLocation == location) return
        if ((oldInterval + 150) >= Date.now()) return
        if (!blockConnectiveXZ.includes(item)) return
        console.log[JSON.stringify(item)] = Date.now();
        //console.log[JSON.stringify(location)];

        const targetBlock = switchBlockFaces(event, Direction)
        const players = block.dimension.getPlayers()
        let soundLocation, sound

        if (isReplaceable(block)) {
            connectAny(block, item, false)
            connectionUpdate(block, false)
            soundLocation = block
        } else {
            if (isReplaceable(targetBlock)) {
                connectAny(targetBlock, item, false)
                connectionUpdate(targetBlock, false)
                soundLocation = targetBlock
            }
        }


        
        if (soundLocation != undefined) {
            switch (true) {
                case item.includes(`_glass_`):
                    sound = `dig.stone`
                    break;
            
                case item.includes(`bamboo_`):
                    sound = `block.scaffolding.place`
                    break;
            }
            for (const name of players) {
                system.run(
                    () => {
                        name.playSound(sound, {location: soundLocation, pitch: 0.8 + Math.random() * 0.1})
                        player.runCommandAsync("clear @s[m=!creative] bao:small_framed_glass_pane 0 1");
                    }
                )
            }
        }
    }
)