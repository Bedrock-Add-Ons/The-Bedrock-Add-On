import { world, system } from "@minecraft/server";

system.run(() => {
    world.getDimension(`overworld`).runCommandAsync(`gamerule playerssleepingpercentage 34`)
});