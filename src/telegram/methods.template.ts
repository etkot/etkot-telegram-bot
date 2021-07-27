import Axios from 'axios'
import * as TG from '../types/telegram'

export abstract class TelegramMethods {
    abstract getBotUrl(): string

    /** Sends given method and returns the response */
    sendMethod(method: TG.Method): Promise<TG.ResponseResult> {
        return new Promise((resolve, reject) => {
            const methodName = method.objectName

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = method as any
            delete data.objectName

            Axios(this.getBotUrl() + methodName, { method: 'POST', data })
                .then(({ data: { ok, result, error_code, description } }: { data: TG.Response }) => {
                    if (ok && result) {
                        resolve(result)
                    } else {
                        reject(`Telegram error (${error_code}): ${description} (method: ${methodName})`)
                    }
                })
                .catch(
                    ({
                        response: {
                            status,
                            statusText,
                            data: { description },
                        },
                    }: {
                        response: { status: number; statusText: string; data: { description: string } }
                    }) => {
                        reject(`HTTP error (${status}): ${statusText} (method: ${methodName}) ${description}`)
                    }
                )
        })
    }

    /* METHOD_IMPLEMENTATIONS_HERE */
}
