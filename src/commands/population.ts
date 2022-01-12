import axios from 'axios'
import { Commander } from '.'

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['population', 'vakiluku', 'ppl', 'vkl'],
        arguments: [],
        help: 'Kertoo suomen tämän hetkisen väkiluvun',

        func: async (_, message, telegram) => {
            const { data } = await axios.get<string>('https://dvv.fi/c/portal/render_portlet', {
                params: {
                    p_p_id: 'fi_yja_populationdisplay_web_portlet_PopulationDisplay',
                    p_l_id: 16665043,
                },
            })

            const number = data.match(/\d+/g)
            if (number?.length) {
                const numberString = number.join(' ')
                telegram.sendMessage(message.chat.id, numberString, {
                    disable_notification: true,
                })
            } else {
                telegram.sendMessage(message.chat.id, 'Väkilukua ei saatu haettua', {
                    disable_notification: true,
                })
            }
        },
    })
}
