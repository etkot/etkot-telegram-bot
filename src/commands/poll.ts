import { Commander } from '.'
import { Telegram } from '../telegram'
import * as TG from '../types/telegram'

const animals = [
    'Supikoira',
    'Ilves',
    'Pesukarhu',
    'Juovahyeena',
    'Harjasusi',
    'Seepramangusti',
    'Vesikko',
    'Nelisormimangusti',
    'Kalastajakissa',
    'Halli',
    'harmaahylje',
    'Siperiantiikeri',
    'Lumileopardi',
    'Hietakissa',
    'Aasianleijona',
    'Aavikkoilves',
    'Jääkarhu',
    'Amurinleopardi',
    'Maakotka',
    'Kuningasmerikotka',
    'Hiirihaukka',
    'Partakorppikotka',
    'Gauri viidakkohärkä',
    'Aksishirvi',
    'Myskihärkä',
    'Kaksikyttyräinen kameli',
    'Siperian alppikauris',
    'Kaspianuriaali',
    'Nuubian vuorikauris',
    'Turkmenian kierteissarvikauris',
    'Kubaninturi',
    'Sichuanin sinilammas',
    'Kaukasianvuorikauris',
    'Bukharanuriaali',
    'Koira',
    'Kissa',
    'Bengalin Tiikeri',
    'Boolilommi',
    'Salamanteri',
    'Elefantti',
    'Leijona',
    'Karhu',
    'Hirvi',
    'Peura',
    'Valas',
    'Delfiini',
    'Jänis',
    'Rusakko',
    'Lepakko',
    'Turri',
    'Orava',
    'Tero',
    'Sorsa',
    'Hyttynen',
    'Kärpänen',
    'Hämähakki',
    'Tunturisopuli',
    'Metsäsopuli',
    'Punamyyrä',
    'Harmaakuvemyyrä',
    'Metsämyyrä',
    'Vesimyyrä',
    'Piisami',
    'Idänkenttämyyrä',
    'Kenttämyyrä',
    'Peltomyyrä',
    'Lapinmyyrä',
]

const RandomAnimal = () => animals[Math.floor(Math.random() * Math.floor(animals.length))]

const Send = (question: string, message: TG.Message, telegram: Telegram, anonymous: boolean) => {
    let reply = undefined

    if (message.reply_to_message) {
        reply = message.reply_to_message.message_id
    }

    if (question === '') {
        question = ' '
    }

    telegram.sendPoll(message.chat.id, question, ['tää', 'epätää', RandomAnimal()], {
        is_anonymous: anonymous,
        disable_notification: true,
        reply_to_message_id: reply,
    })
}

export default (commander: Commander): void => {
    commander.addCommand({
        commands: ['poll', 'p'],
        arguments: ['<question>'],
        allowReply: true,
        help: 'Lähettää pollin',

        func: (args, message, telegram) => {
            Send(args.join(' '), message, telegram, false)
        },
    })

    commander.addCommand({
        commands: ['pollanonymous', 'pollanon', 'pa'],
        arguments: ['<question>'],
        allowReply: true,
        help: 'Lähettää anonyymin pollin',

        func: (args, message, telegram) => {
            Send(args.join(' '), message, telegram, true)
        },
    })
}
