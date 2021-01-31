import Axios from 'axios'
import { TG } from '../types/telegram'

export abstract class TelegramMethods {
    abstract getBotUrl(): string

    /** Sends given method and returns the response */
    sendMethod(method: TG.Method): Promise<TG.ResponseResult> {
        return new Promise((resolve, reject) => {
            const data = method as any
            delete data.objectName

            Axios(this.getBotUrl() + method.objectName, { method: 'POST', data }).then(
                ({ data: { ok, result, error_code, description } }: { data: TG.Response }) => {
                    if (ok && result) {
                        resolve(result)
                    } else {
                        reject(`Telegram error (${error_code}): ${description} (method: ${method.objectName})`)
                    }
                }
            )
        })
    }

    /* METHOD_IMPLEMENTATIONS_HERE */
}
