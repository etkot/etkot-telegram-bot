import axios, { AxiosError } from 'axios'
import FormData from 'form-data'
import * as googleTTS from 'google-tts-api'
import { Readable } from 'stream'
import { Commander } from '.'
import detectLanguage from '../ttsUtils'
import { Message } from '../types/telegram'

const validLangs = `
ar-XA, ar-XA, ar-XA, ar-XA, bn-IN, bn-IN, en-GB, en-GB, en-GB, en-GB, en-GB, fr-CA, fr-CA, fr-CA, fr-CA, 
en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, es-ES, es-ES, es-ES, fi-FI, gu-IN, 
gu-IN, ja-JP, ja-JP, ja-JP, ja-JP, kn-IN, kn-IN, ml-IN, ml-IN, sv-SE, sv-SE, sv-SE, sv-SE, sv-SE, ta-IN, 
ta-IN, tr-TR, tr-TR, tr-TR, tr-TR, tr-TR, ms-MY, ms-MY, ms-MY, ms-MY, pa-IN, pa-IN, pa-IN, pa-IN, cs-CZ, 
de-DE, de-DE, de-DE, de-DE, de-DE, de-DE, en-AU, en-AU, en-AU, en-AU, en-IN, en-IN, en-IN, en-IN, es-US, 
es-US, es-US, fr-FR, fr-FR, fr-FR, fr-FR, fr-FR, hi-IN, hi-IN, hi-IN, hi-IN, id-ID, id-ID, id-ID, id-ID, 
it-IT, it-IT, it-IT, it-IT, ko-KR, ko-KR, ko-KR, ko-KR, ru-RU, ru-RU, ru-RU, ru-RU, ru-RU, uk-UA, cmn-CN, 
cmn-CN, cmn-CN, cmn-CN, cmn-TW, cmn-TW, cmn-TW, da-DK, da-DK, da-DK, da-DK, el-GR, fil-PH, fil-PH, fil-PH,
fil-PH, hu-HU, nb-NO, nb-NO, nb-NO, nb-NO, nb-NO, nl-BE, nl-BE, nl-NL, nl-NL, nl-NL, nl-NL, nl-NL, pt-PT, pt-PT, 
pt-PT, pt-PT, sk-SK, vi-VN, vi-VN, vi-VN, vi-VN, pl-PL, pl-PL, pl-PL, pl-PL, pl-PL, pt-BR, pt-BR, ro-RO, 
th-TH, bn-IN, bn-IN, en-IN, en-IN, en-IN, en-IN, gu-IN, gu-IN, hi-IN, hi-IN, hi-IN, hi-IN, kn-IN, kn-IN, 
ml-IN, ml-IN, ta-IN, ta-IN, te-IN, te-IN, pa-IN, pa-IN, pa-IN, pa-IN, af-ZA, bg-BG, hu-HU, lv-LV, ro-RO, 
sk-SK, sr-RS, uk-UA, pl-PL, pl-PL, pl-PL, pl-PL, pl-PL, tr-TR, tr-TR, tr-TR, tr-TR, tr-TR, da-DK, da-DK, 
da-DK, da-DK, fi-FI, is-IS, nb-NO, nb-NO, nb-NO, nb-NO, nb-NO, pt-PT, pt-PT, pt-PT, pt-PT, sv-SE, sv-SE, 
sv-SE, sv-SE, sv-SE, fr-FR, fr-FR, fr-FR, fr-FR, de-DE, de-DE, de-DE, de-DE, de-DE, de-DE, fr-CA, fr-CA, 
fr-CA, fr-CA, it-IT, it-IT, it-IT, en-AU, en-AU, en-AU, en-AU, en-GB, en-GB, en-GB, en-GB, en-GB, cs-CZ, 
el-GR, pt-BR, pt-BR, es-US, es-US, es-US, ms-MY, ms-MY, ms-MY, ms-MY, id-ID, id-ID, id-ID, id-ID, nl-BE, 
nl-BE, nl-NL, nl-NL, nl-NL, nl-NL, nl-NL, fil-PH, fil-PH, fil-PH, fil-PH, yue-HK, yue-HK, yue-HK, yue-HK, cmn-CN, 
cmn-CN, cmn-CN, cmn-CN, ja-JP, ja-JP, ja-JP, ja-JP, cmn-TW, cmn-TW, cmn-TW, ko-KR, ko-KR, ko-KR, ko-KR, vi-VN, 
vi-VN, vi-VN, vi-VN, ar-XA, ar-XA, ar-XA, ar-XA, fr-FR, it-IT, ru-RU, ru-RU, ru-RU, ru-RU, ru-RU, en-US, 
en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, en-US, ca-ES, es-ES, es-ES, es-ES, es-ES, si-LK,
`

const regex = /[-[\]{}()*+?.,<>\\^$|#]/g

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['tts', 'text-to-speech'],
        arguments: [],
        allowReply: true,
        help: 'Muuttaa tekstin ääniviestiksi',

        func: async (args, message, telegram) => {
            const argsLanguage = args[0]
            let argsLanguageIsValid = false

            if (validLangs.includes(argsLanguage)) {
                args.shift()
                argsLanguageIsValid = true
            }

            let text = ''
            if (message.reply_to_message?.text !== undefined) {
                text = message.reply_to_message.text
            } else {
                text = args.join(' ') || 'Nyt en ymmärrä mitä sanot'
            }

            text = text.replace(regex, '\\$&').slice(0, 199)

            const detectedLanguage = await detectLanguage(text)
            const lang = argsLanguageIsValid
                ? argsLanguage
                : validLangs.includes(detectedLanguage)
                ? detectedLanguage
                : 'fi'

            const base64 = await googleTTS.getAudioBase64(text, {
                lang: lang,
                slow: false,
                host: 'https://translate.google.com',
                timeout: 10000,
            })

            const buffer = Buffer.from(base64, 'base64')
            const stream = Readable.from(buffer)

            const form = new FormData()
            form.append('chat_id', message.chat.id.toString())
            form.append('parse_mode', 'MarkdownV2')
            form.append('voice', stream, {
                filename: `voice.ogg`,
            })
            form.append('disable_notification', 'true')
            form.append('reply_to_message_id', message.message_id.toString())

            try {
                const res = await axios.post<Response & { result: Message }>(`${telegram.getBotUrl()}sendVoice`, form, {
                    headers: form.getHeaders(),
                })
            } catch (error) {
                const err = error as AxiosError
                console.log(err.response?.data)
                telegram.sendMessage(message.chat.id, 'Error generaiting TTS!')
            }
        },
    })
}
