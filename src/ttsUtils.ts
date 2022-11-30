import axios from 'axios'

const host = 'https://translate.google.com'
const url = '/_/TranslateWebserverUi/data/batchexecute'

const detectLanguage = async (text: string): Promise<string> => {
    const { data } = await axios({
        method: 'post',
        baseURL: host,
        url,
        data:
            'f.req=' +
            encodeURIComponent(
                JSON.stringify([[['MkEWBc', JSON.stringify([[text, 'auto', 'fi', true], [1]]), null, 'generic']]])
            ),
    })

    try {
        const json = JSON.parse(data.slice(5))[0][2]
        const response = JSON.parse(json)
        return response[0][2]
    } catch (error) {
        return 'en'
    }
}

export default detectLanguage
