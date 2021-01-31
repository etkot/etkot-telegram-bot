import net from 'net'
import { Commander } from '.'

const ToVarInt = (value: number) => {
    const bytes = []

    do {
        let temp = value & 0b01111111
        // Note: >>> means that the sign bit is shifted with the rest of the number rather than being left alone
        value >>>= 7
        if (value != 0) {
            temp |= 0b10000000
        }
        bytes.push(temp)
    } while (value != 0)

    return Buffer.from(bytes)
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['minecraft', 'mc'],
        arguments: [],
        help: 'Kertoo kuinka monta pelaajaa serverillä on',

        func: (args, message, telegram) => {
            const host = process.env.MC_ADDR || ''
            const port = Number(process.env.MC_PORT || 25565)

            const client = net.connect({ host, port }, () => {
                const bufPacketId = ToVarInt(0)
                const bufVersion = ToVarInt(-1)
                const bufAddressLen = ToVarInt(host.length)
                const bufAddress = Buffer.from(host)
                const bufPort = Buffer.from([port >> 8, port])
                const bufMode = ToVarInt(1)

                const bufLength = ToVarInt(
                    bufPacketId.length +
                        bufVersion.length +
                        bufAddressLen.length +
                        bufAddress.length +
                        bufPort.length +
                        bufMode.length
                )

                const buf = Buffer.concat([
                    bufLength,
                    bufPacketId,
                    bufVersion,
                    bufAddressLen,
                    bufAddress,
                    bufPort,
                    bufMode,
                ])

                client.write(buf)
                client.write(Buffer.concat([ToVarInt(1), ToVarInt(0)]))
            })

            client.on('data', (buf) => {
                let str = buf.toString()
                while (str[0] !== '{') {
                    str = str.substr(1)
                }

                const data = JSON.parse(str)

                let text = `<b>${data.description.text}</b> (${data.players.online}/${data.players.max})`

                for (const p in data.players.sample) {
                    text += `\n    ${data.players.sample[p].name}`
                }

                telegram.sendMessage(message.chat.id, text, { disable_notification: true, parse_mode: 'HTML' })

                client.end()
            })
        },
    })
}
