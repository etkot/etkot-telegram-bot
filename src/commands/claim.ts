import { Commander } from '.'
import { getCollection } from '../mongoUtil'
import { CreditDocument } from './credit'

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['claim', 'cl', 'csc'],
        arguments: [],
        help: 'Claimaa vanhoja credittejä usernamen takaa id:llesi',

        func: async (args, message, telegram) => {
            const id = message.from?.id || 0
            const username = message.from?.username || ''

            const oldDocs = await getCollection<CreditDocument>('credit').find({ username }).toArray()
            if (!oldDocs.length) {
                telegram.sendMessage(message.chat.id, `Käyttäjänimeltä ${username} ei löydy kolikkoja :(`, {
                    disable_notification: true,
                    reply_to_message_id: message.message_id,
                })
                return
            }

            const plus_credits = oldDocs.map((doc) => doc.plus_credits || []).reduce((a, b) => a.concat(b), [])
            const minus_credits = oldDocs.map((doc) => doc.minus_credits || []).reduce((a, b) => a.concat(b), [])

            getCollection<CreditDocument>('id_credit')
                .updateOne(
                    { id },
                    {
                        $push: { plus_credits: { $each: plus_credits }, minus_credits: { $each: minus_credits } },
                        $set: { username },
                    },
                    { upsert: true }
                )
                .then(() => {
                    getCollection<CreditDocument>('credit').deleteMany({ username })
                    telegram.sendMessage(message.chat.id, 'Koliket on claimattu', {
                        disable_notification: true,
                        reply_to_message_id: message.message_id,
                    })
                })
        },
    })
}
