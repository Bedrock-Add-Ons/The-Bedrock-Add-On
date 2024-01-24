import { world, system, BlockPermutation } from "@minecraft/server";

const mossyBlocks = {
    "minecraft:stonebrick": {
        states: { "stone_brick_type": "default" },
        mossy: {
            type: "minecraft:stonebrick",
            states: { "stone_brick_type": "mossy" }
        }
    },
    "minecraft:cobblestone": {
        mossy: { type: "minecraft:mossy_cobblestone" }
    }
};

world.beforeEvents.itemUseOn.subscribe(({ source: player, itemStack, block }) => {
    // Debouncer
    const oldLog = console.log[JSON.stringify(itemStack.typeId)];
    if ((oldLog + 150) >= Date.now()) return;
    const mossyBlock = Object.keys(mossyBlocks).find((b) => block.permutation.matches(b, mossyBlocks[b].states));
    console.log[JSON.stringify(itemStack.typeId)] = Date.now();

    if (itemStack.typeId !== "bao:moss_clump" || mossyBlock === undefined) return;


    const moss = mossyBlocks[mossyBlock].mossy;
    system.run(() => {
        player.runCommandAsync("clear @s[m=!creative] bao:moss_clump 0 1");
        block.setPermutation(BlockPermutation.resolve(moss.type, moss.states));
    });
});