import {world} from "@minecraft/server"
import {ModalFormData} from "@minecraft/server-ui"

world.afterEvents.itemUse.subscribe(
    async ({itemStack, source: player}) => {
        if (itemStack.typeId == "bao:ominous_spellbook" && player.isSneaking) {
            const form =
                new ModalFormData()
                    .title("Spellbook")

            if (player.hasTag("one")) {
                form.toggle("spell1")
            }        

            if (player.hasTag("two")) {
                form.toggle("spell2")
            } 

            if (player.hasTag("three")) {
                form.toggle("spell3")
            }        

            if (player.hasTag("four")) {
                form.toggle("spell4")
            }  

            if (player.hasTag("five")) {
                form.toggle("spell5")
            }        

            if (player.hasTag("six")) {
                form.toggle("spell6")
            }
            
            const dimension = player.dimension
            const {formValues, canceled} = await form.show(player)
            if (!canceled) {
                const [spell1,spell2,spell3,spell4,spell5,spell6] = formValues
                console.warn(spell1,spell2,spell3,spell4,spell5,spell6)
            }
            else {
                dimension.runCommandAsync(`say Cancelled`)
            }
        }
    }
)