import { world, system } from "@minecraft/server";

system.run(() => {
    world.getDimension(`overworld`).runCommand(`gamerule playerssleepingpercentage 34`)
});