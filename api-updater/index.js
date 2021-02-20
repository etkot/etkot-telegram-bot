const axios = require('axios').default
const { parse } = require('node-html-parser')
const fs = require('fs')
const path = require('path')

/**
 * @param {HTMLElement} el
 * @param {string} target
 * @returns {HTMLElement}
 */
const next = (el, target) => {
    while (el !== null && el.tagName !== target) {
        el = el.nextElementSibling
    }
    return el
}

/**
 * @param {string} html
 */
const parseHTML = (html) => {
    return html.replace(/<\/?([A-Za-z]+?) ?(?:href="(.+?)")?.*?>(?:(.+?)<\/a>)?/gi, (match, tag, link, text) => {
        switch (tag) {
            case 'a':
                return `[${text}](${link[0] === '#' ? `https://core.telegram.org/bots/api${link}` : link})`
            case 'br':
                return ' '
            default:
                return ''
        }
    })
}

/**
 * @param {HTMLElement} el
 */
const parseObject = (el) => {
    // Create object and parse name
    const obj = {
        name: el.lastChild.rawText,
        description: '',
    }

    // Check if name has a space
    // In that case it's not a type or method so return
    if (obj.name.indexOf(' ') !== -1) return undefined

    // If name is InputFile run special case
    if (obj.name === 'InputFile') {
        obj.description =
            'This object represents a file. Can be file_id, URL or multipart/form-data post of the file. More info on https://core.telegram.org/bots/api#inputfile'
        obj.types = ['string']
        return obj
    }

    // Read object description
    const stopTags = ['H4', 'H3', 'TABLE', 'UL']
    el = el.nextElementSibling
    do {
        if (el.tagName === 'P') obj.description += parseHTML(el.innerHTML) + ' '
        el = el.nextElementSibling
    } while (!stopTags.includes(el.tagName))
    obj.description = obj.description.trim()

    // Parse fields
    if (el.tagName === 'TABLE') {
        let hasOptionColumn = el.childNodes[1].childNodes[1].childNodes.length === 9
        let rows = el.childNodes[3]

        obj.fields = []

        for (let i = 1; i < rows.childNodes.length; i += 2) {
            const node = rows.childNodes[i]

            let description = parseHTML(node.childNodes[5].innerHTML)

            let optional = false
            if (hasOptionColumn) {
                optional = description === 'Optional'
                description = node.childNodes[7].text
            } else if (description.substring(0, 8) === 'Optional') {
                description = description.substring(10)
                optional = true
            }

            obj.fields.push({
                name: node.childNodes[1].text,
                type: node.childNodes[3].text,
                description,
                optional,
            })
        }
    } else if (el.tagName === 'UL') {
        obj.types = []

        const lines = el.childNodes

        for (let i = 1; i < lines.length; i += 2) {
            const node = lines[i]
            obj.types.push(node.text)
        }
    }

    return obj
}

let tgTypes
const main = async () => {
    const { data } = await axios.get('https://core.telegram.org/bots/api')

    const root = parse(data)

    const result = []

    let el = root.querySelectorAll('h3').find((element) => element.lastChild.rawText === 'Getting updates')

    while (true) {
        el = next(el.nextElementSibling, 'H4')

        if (el === null) break

        const obj = parseObject(el)
        if (obj !== undefined) result.push(obj)
    }

    tgTypes = result

    makeTsTypeFile(result)
    makeTsMethodFile(result)
}
main()

/***************************/
/*  TS type file creation  */
/***************************/

const parseType = (type, tgPrefix) => {
    if (type === 'Integer') type = 'number'
    if (type === 'Int') type = 'number'
    if (type === 'Float') type = 'number'
    if (type === 'Float number') type = 'number'
    if (type === 'String') type = 'string'
    if (type === 'Boolean') type = 'boolean'
    if (type === 'True') type = 'boolean'

    const parseTypeRecursive = (el) => parseType(el, tgPrefix)

    if (type.indexOf(' or ') !== -1) type = type.split(' or ').map(parseTypeRecursive).join('|')
    if (type.indexOf('rray of ') !== -1) {
        let arrayType = type.replace(/Array of (.+)/gi, '$1')
        if (arrayType.indexOf(', ') !== -1 || arrayType.indexOf(' and ') !== -1 || arrayType.indexOf(' or ') !== -1)
            type = `Array<${arrayType
                .split(/(?:, )|(?: and )|(?: or )/g)
                .map(parseTypeRecursive)
                .join('|')}>`
        else type = `Array<${parseTypeRecursive(arrayType)}>`
    }

    if (!tgTypes.find((t) => t.name === type) && tgTypes.find((t) => t.name === type.substring(0, type.length - 1)))
        type = type.substring(0, type.length - 1)

    if (tgTypes.find((t) => t.name === type) && tgPrefix?.length > 0) type = `${tgPrefix}.${type}`

    return type
}

const makeTsTypeFile = (data) => {
    const tabSize = 4

    let ts = ''
    const addLine = (tabs, str) => {
        ts += ' '.repeat(tabs * tabSize) + str + '\n'
    }

    //addLine(0, 'export namespace TG {')
    addLine(0, '/** Any Telegram object */')
    addLine(0, 'export interface TGObject {')
    addLine(1, '/** Name of the interface that implements this interface */')
    addLine(1, 'objectName: string,')
    addLine(0, '}')
    addLine(0, '/** Any Telegram type */')
    addLine(0, 'export type Type = TGObject')
    addLine(0, '/** Any Telegram method */')
    addLine(0, 'export type Method = TGObject')
    addLine(0, '')

    addLine(0, '/** Possible responses from the Telegram API */')
    addLine(0, 'export type ResponseResult = Type | Array<Type> | string | number | true')
    addLine(0, '')

    addLine(0, '/** Response from a Telegram API method */')
    addLine(0, 'export interface Response {')
    addLine(1, '/** Whether the request was successful and the result*/')
    addLine(1, 'ok: boolean,')
    addLine(1, '/** Result of the query if ok is true */')
    addLine(1, 'result?: ResponseResult,')
    addLine(1, '/** Error code if ok is false */')
    addLine(1, 'error_code?: number,')
    addLine(1, '/** Human-readable description */')
    addLine(1, 'description?: string,')
    addLine(1, '/** Optional field which can help to automatically handle some error */')
    addLine(1, 'parameters?: ResponseParameters,')
    addLine(0, '}')
    addLine(0, '')

    for (let i = 0; i < data.length; i++) {
        const obj = data[i]
        const isUnion = obj.types !== undefined
        const isType = obj.name[0] === obj.name[0].toUpperCase()

        addLine(0, `/** ${obj.description} */`)

        if (isUnion) {
            addLine(0, `export type ${obj.name} = ${obj.types.join(' | ')}`)
        } else {
            addLine(0, `export class ${obj.name} implements ${isType ? 'Type' : 'Method'} {`)

            addLine(1, `/** Name of this interface as a string */`)
            addLine(1, `objectName = '${obj.name}'`)

            for (let j = 0; j < obj.fields?.length; j++) {
                const { name, optional, description, type } = obj.fields[j]

                addLine(1, `/** ${description} */`)
                addLine(1, `${name}${optional ? '?' : ''}: ${parseType(type)}`)
            }

            if (obj.fields) {
                addLine(0, '')

                let fields = [...obj.fields]
                fields.sort((a, b) => a.optional * 2 - 1 - (b.optional * 2 - 1))

                let str = 'constructor('
                for (let j = 0; j < fields.length; j++) {
                    const { name, optional, type } = fields[j]

                    str += `${name}${optional ? '?' : ''}: ${parseType(type)}, `
                }
                str = str.slice(0, -2)
                str += ') {'

                addLine(1, str)

                for (let j = 0; j < fields.length; j++) {
                    const { name } = fields[j]

                    addLine(2, `this.${name} = ${name}`)
                }

                addLine(1, '}')
            }

            addLine(0, '}')
        }

        addLine(0, '')
    }

    //addLine(0, '}')

    fs.writeFile(path.join(__dirname, '../src/types/telegram.ts'), ts, (err) => {
        if (err) throw err
        console.log('Typescript types written in types/telegram.ts')
    })
}

/*****************************/
/*  TS method file creation  */
/*****************************/

const makeTsMethodFile = (data) => {
    const tabSize = 4

    let ts = ''
    const addLine = (tabs, str) => {
        ts += ' '.repeat(tabs * tabSize) + str + '\n'
    }

    for (let i = 0; i < data.length; i++) {
        const method = data[i]

        if (method.name[0] !== method.name[0].toLowerCase()) continue

        const required = method.fields?.filter((field) => !field.optional)
        const optional = method.fields?.filter((field) => field.optional)

        const ftntsc = (field) => `${field.name}: ${parseType(field.type, 'TG')}`
        const ftnts = (field) => `${field.name}?: ${parseType(field.type, 'TG')}`
        const ftns = (field) => `${field.name}`
        const ftnso = (field) => `optional?.${field.name}`

        const hasRequired = required?.length > 0
        const hasOptional = optional?.length > 0
        const middleString = hasRequired && hasOptional ? ', ' : ''

        const requiredParamsString = hasRequired ? required.map(ftntsc).join(', ') : ''
        const optionalParamsString = hasOptional ? `optional?: { ${optional.map(ftnts).join(', ')} }` : ''

        const paramsString = requiredParamsString + middleString + optionalParamsString

        const requiredObjectString = hasRequired ? required.map(ftns).join(', ') : ''
        const optionalObjectString = hasOptional ? optional.map(ftnso).join(', ') : ''

        const objectString = requiredObjectString + middleString + optionalObjectString

        const removeMd = (text) => text.replace(/\[([A-Za-z]+?)\]\(.+?\)/g, '$1')
        const returnTypeRegex = /(?:Returns (?:the )?(?:a )?(?:an )?((?:Array of )?[A-Za-z]+))|(?:(Array of [A-Za-z]+) (?:(?:objects)|(?:that were sent)) is returned)|(?:([A-Za-z]+) (?:object )?is returned)/gi
        const returnTypeRegexOutput = [...removeMd(method.description).matchAll(returnTypeRegex)]
        let returnTypes = []
        for (let i = 0; i < returnTypeRegexOutput.length; i++) {
            const element = returnTypeRegexOutput[i]

            const returnTypeRegexOut = element[1] || element[2] || element[3]
            returnTypes.push(returnTypeRegexOut === 'True' ? 'true' : parseType(returnTypeRegexOut, 'TG'))
        }

        // Special cases where I'm not going to make the regex work
        if (method.name === 'getMe') returnTypes = ['TG.User']
        if (method.name === 'exportChatInviteLink') returnTypes = ['string']
        if (method.name === 'stopPoll') returnTypes = ['TG.Poll']
        if (method.name === 'uploadStickerFile') returnTypes = ['TG.File']
        if (method.name === 'setGameScore') returnTypes = ['TG.Message', 'true']
        if (method.name === 'getGameHighScores') returnTypes = ['Array<TG.GameHighScore>']

        addLine(1, `/** ${method.description} */`)
        addLine(1, `${method.name}(${paramsString}): Promise<${returnTypes.join(' | ')}> {`)
        addLine(
            2,
            `return this.sendMethod(new TG.${method.name}(${objectString})) as Promise<${returnTypes.join(' | ')}>`
        )
        addLine(1, '}')
        addLine(0, '')
    }

    fs.readFile(path.join(__dirname, '../src/telegram/methods.template.ts'), { encoding: 'utf-8' }, (err, data) => {
        if (err) throw err

        const file = data.replace('    /* METHOD_IMPLEMENTATIONS_HERE */', ts)
        fs.writeFile(path.join(__dirname, '../src/telegram/methods.ts'), file, (err) => {
            if (err) throw err
            console.log('Typescript types written in src/telegram/methods.ts')
        })
    })
}
