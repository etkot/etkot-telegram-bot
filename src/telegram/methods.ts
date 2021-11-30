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

    /** Use this method to receive incoming updates using long polling ([wiki](https://en.wikipedia.org/wiki/Push_technology#Long_polling)). An Array of [Update](https://core.telegram.org/bots/api#update) objects is returned. */
    getUpdates(optional?: { offset?: number, limit?: number, timeout?: number, allowed_updates?: Array<string> }): Promise<Array<TG.Update>> {
        return this.sendMethod(new TG.getUpdates(optional?.offset, optional?.limit, optional?.timeout, optional?.allowed_updates)) as Promise<Array<TG.Update>>
    }

    /** Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized [Update](https://core.telegram.org/bots/api#update). In case of an unsuccessful request, we will give up after a reasonable amount of attempts. Returns True on success. If you&#39;d like to make sure that the Webhook request comes from Telegram, we recommend using a secret path in the URL, e.g. https://www.example.com/&lt;token&gt;. Since nobody else knows your bot&#39;s token, you can be pretty sure it&#39;s us. */
    setWebhook(url: string, optional?: { certificate?: TG.InputFile, ip_address?: string, max_connections?: number, allowed_updates?: Array<string>, drop_pending_updates?: boolean }): Promise<boolean> {
        return this.sendMethod(new TG.setWebhook(url, optional?.certificate, optional?.ip_address, optional?.max_connections, optional?.allowed_updates, optional?.drop_pending_updates)) as Promise<boolean>
    }

    /** Use this method to remove webhook integration if you decide to switch back to [getUpdates](https://core.telegram.org/bots/api#getupdates). Returns True on success. */
    deleteWebhook(optional?: { drop_pending_updates?: boolean }): Promise<boolean> {
        return this.sendMethod(new TG.deleteWebhook(optional?.drop_pending_updates)) as Promise<boolean>
    }

    /** Use this method to get current webhook status. Requires no parameters. On success, returns a [WebhookInfo](https://core.telegram.org/bots/api#webhookinfo) object. If the bot is using [getUpdates](https://core.telegram.org/bots/api#getupdates), will return an object with the url field empty. */
    getWebhookInfo(): Promise<TG.WebhookInfo> {
        return this.sendMethod(new TG.getWebhookInfo()) as Promise<TG.WebhookInfo>
    }

    /** A simple method for testing your bot&#39;s authentication token. Requires no parameters. Returns basic information about the bot in form of a [User](https://core.telegram.org/bots/api#user) object. */
    getMe(): Promise<TG.User> {
        return this.sendMethod(new TG.getMe()) as Promise<TG.User>
    }

    /** Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters. */
    logOut(): Promise<boolean> {
        return this.sendMethod(new TG.logOut()) as Promise<boolean>
    }

    /** Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn&#39;t launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters. */
    close(): Promise<boolean> {
        return this.sendMethod(new TG.close()) as Promise<boolean>
    }

    /** Use this method to send text messages. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendMessage(chat_id: number|string, text: string, optional?: { parse_mode?: string, entities?: Array<TG.MessageEntity>, disable_web_page_preview?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendMessage(chat_id, text, optional?.parse_mode, optional?.entities, optional?.disable_web_page_preview, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to forward messages of any kind. Service messages can&#39;t be forwarded. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    forwardMessage(chat_id: number|string, from_chat_id: number|string, message_id: number, optional?: { disable_notification?: boolean }): Promise<TG.Message> {
        return this.sendMethod(new TG.forwardMessage(chat_id, from_chat_id, message_id, optional?.disable_notification)) as Promise<TG.Message>
    }

    /** Use this method to copy messages of any kind. Service messages and invoice messages can&#39;t be copied. The method is analogous to the method [forwardMessage](https://core.telegram.org/bots/api#forwardmessage), but the copied message doesn&#39;t have a link to the original message. Returns the [MessageId](https://core.telegram.org/bots/api#messageid) of the sent message on success. */
    copyMessage(chat_id: number|string, from_chat_id: number|string, message_id: number, optional?: { caption?: string, parse_mode?: string, caption_entities?: Array<TG.MessageEntity>, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.MessageId> {
        return this.sendMethod(new TG.copyMessage(chat_id, from_chat_id, message_id, optional?.caption, optional?.parse_mode, optional?.caption_entities, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.MessageId>
    }

    /** Use this method to send photos. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendPhoto(chat_id: number|string, photo: TG.InputFile|string, optional?: { caption?: string, parse_mode?: string, caption_entities?: Array<TG.MessageEntity>, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendPhoto(chat_id, photo, optional?.caption, optional?.parse_mode, optional?.caption_entities, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future. For sending voice messages, use the [sendVoice](https://core.telegram.org/bots/api#sendvoice) method instead. */
    sendAudio(chat_id: number|string, audio: TG.InputFile|string, optional?: { caption?: string, parse_mode?: string, caption_entities?: Array<TG.MessageEntity>, duration?: number, performer?: string, title?: string, thumb?: TG.InputFile|string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendAudio(chat_id, audio, optional?.caption, optional?.parse_mode, optional?.caption_entities, optional?.duration, optional?.performer, optional?.title, optional?.thumb, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to send general files. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future. */
    sendDocument(chat_id: number|string, document: TG.InputFile|string, optional?: { thumb?: TG.InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<TG.MessageEntity>, disable_content_type_detection?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendDocument(chat_id, document, optional?.thumb, optional?.caption, optional?.parse_mode, optional?.caption_entities, optional?.disable_content_type_detection, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as [Document](https://core.telegram.org/bots/api#document)). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future. */
    sendVideo(chat_id: number|string, video: TG.InputFile|string, optional?: { duration?: number, width?: number, height?: number, thumb?: TG.InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<TG.MessageEntity>, supports_streaming?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendVideo(chat_id, video, optional?.duration, optional?.width, optional?.height, optional?.thumb, optional?.caption, optional?.parse_mode, optional?.caption_entities, optional?.supports_streaming, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future. */
    sendAnimation(chat_id: number|string, animation: TG.InputFile|string, optional?: { duration?: number, width?: number, height?: number, thumb?: TG.InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<TG.MessageEntity>, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendAnimation(chat_id, animation, optional?.duration, optional?.width, optional?.height, optional?.thumb, optional?.caption, optional?.parse_mode, optional?.caption_entities, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS (other formats may be sent as [Audio](https://core.telegram.org/bots/api#audio) or [Document](https://core.telegram.org/bots/api#document)). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future. */
    sendVoice(chat_id: number|string, voice: TG.InputFile|string, optional?: { caption?: string, parse_mode?: string, caption_entities?: Array<TG.MessageEntity>, duration?: number, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendVoice(chat_id, voice, optional?.caption, optional?.parse_mode, optional?.caption_entities, optional?.duration, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** As of [v.4.0](https://telegram.org/blog/video-messages-and-telescope), Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendVideoNote(chat_id: number|string, video_note: TG.InputFile|string, optional?: { duration?: number, length?: number, thumb?: TG.InputFile|string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendVideoNote(chat_id, video_note, optional?.duration, optional?.length, optional?.thumb, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of [Messages](https://core.telegram.org/bots/api#message) that were sent is returned. */
    sendMediaGroup(chat_id: number|string, media: Array<TG.InputMediaAudio|TG.InputMediaDocument|TG.InputMediaPhoto|TG.InputMediaVideo>, optional?: { disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean }): Promise<Array<TG.Message>> {
        return this.sendMethod(new TG.sendMediaGroup(chat_id, media, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply)) as Promise<Array<TG.Message>>
    }

    /** Use this method to send point on the map. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendLocation(chat_id: number|string, latitude: number, longitude: number, optional?: { horizontal_accuracy?: number, live_period?: number, heading?: number, proximity_alert_radius?: number, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendLocation(chat_id, latitude, longitude, optional?.horizontal_accuracy, optional?.live_period, optional?.heading, optional?.proximity_alert_radius, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation). On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
    editMessageLiveLocation(latitude: number, longitude: number, optional?: { chat_id?: number|string, message_id?: number, inline_message_id?: string, horizontal_accuracy?: number, heading?: number, proximity_alert_radius?: number, reply_markup?: TG.InlineKeyboardMarkup }): Promise<TG.Message | boolean> {
        return this.sendMethod(new TG.editMessageLiveLocation(latitude, longitude, optional?.chat_id, optional?.message_id, optional?.inline_message_id, optional?.horizontal_accuracy, optional?.heading, optional?.proximity_alert_radius, optional?.reply_markup)) as Promise<TG.Message | boolean>
    }

    /** Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
    stopMessageLiveLocation(optional?: { chat_id?: number|string, message_id?: number, inline_message_id?: string, reply_markup?: TG.InlineKeyboardMarkup }): Promise<TG.Message | boolean> {
        return this.sendMethod(new TG.stopMessageLiveLocation(optional?.chat_id, optional?.message_id, optional?.inline_message_id, optional?.reply_markup)) as Promise<TG.Message | boolean>
    }

    /** Use this method to send information about a venue. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendVenue(chat_id: number|string, latitude: number, longitude: number, title: string, address: string, optional?: { foursquare_id?: string, foursquare_type?: string, google_place_id?: string, google_place_type?: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendVenue(chat_id, latitude, longitude, title, address, optional?.foursquare_id, optional?.foursquare_type, optional?.google_place_id, optional?.google_place_type, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to send phone contacts. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendContact(chat_id: number|string, phone_number: string, first_name: string, optional?: { last_name?: string, vcard?: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendContact(chat_id, phone_number, first_name, optional?.last_name, optional?.vcard, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to send a native poll. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendPoll(chat_id: number|string, question: string, options: Array<string>, optional?: { is_anonymous?: boolean, type?: string, allows_multiple_answers?: boolean, correct_option_id?: number, explanation?: string, explanation_parse_mode?: string, explanation_entities?: Array<TG.MessageEntity>, open_period?: number, close_date?: number, is_closed?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendPoll(chat_id, question, options, optional?.is_anonymous, optional?.type, optional?.allows_multiple_answers, optional?.correct_option_id, optional?.explanation, optional?.explanation_parse_mode, optional?.explanation_entities, optional?.open_period, optional?.close_date, optional?.is_closed, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to send an animated emoji that will display a random value. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendDice(chat_id: number|string, optional?: { emoji?: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendDice(chat_id, optional?.emoji, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method when you need to tell the user that something is happening on the bot&#39;s side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success. We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive. */
    sendChatAction(chat_id: number|string, action: string): Promise<boolean> {
        return this.sendMethod(new TG.sendChatAction(chat_id, action)) as Promise<boolean>
    }

    /** Use this method to get a list of profile pictures for a user. Returns a [UserProfilePhotos](https://core.telegram.org/bots/api#userprofilephotos) object. */
    getUserProfilePhotos(user_id: number, optional?: { offset?: number, limit?: number }): Promise<TG.UserProfilePhotos> {
        return this.sendMethod(new TG.getUserProfilePhotos(user_id, optional?.offset, optional?.limit)) as Promise<TG.UserProfilePhotos>
    }

    /** Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a [File](https://core.telegram.org/bots/api#file) object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt;, where &lt;file_path&gt; is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling [getFile](https://core.telegram.org/bots/api#getfile) again. */
    getFile(file_id: string): Promise<TG.File> {
        return this.sendMethod(new TG.getFile(file_id)) as Promise<TG.File>
    }

    /** Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless [unbanned](https://core.telegram.org/bots/api#unbanchatmember) first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
    banChatMember(chat_id: number|string, user_id: number, optional?: { until_date?: number, revoke_messages?: boolean }): Promise<boolean> {
        return this.sendMethod(new TG.banChatMember(chat_id, user_id, optional?.until_date, optional?.revoke_messages)) as Promise<boolean>
    }

    /** Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don&#39;t want this, use the parameter only_if_banned. Returns True on success. */
    unbanChatMember(chat_id: number|string, user_id: number, optional?: { only_if_banned?: boolean }): Promise<boolean> {
        return this.sendMethod(new TG.unbanChatMember(chat_id, user_id, optional?.only_if_banned)) as Promise<boolean>
    }

    /** Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success. */
    restrictChatMember(chat_id: number|string, user_id: number, permissions: TG.ChatPermissions, optional?: { until_date?: number }): Promise<boolean> {
        return this.sendMethod(new TG.restrictChatMember(chat_id, user_id, permissions, optional?.until_date)) as Promise<boolean>
    }

    /** Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success. */
    promoteChatMember(chat_id: number|string, user_id: number, optional?: { is_anonymous?: boolean, can_manage_chat?: boolean, can_post_messages?: boolean, can_edit_messages?: boolean, can_delete_messages?: boolean, can_manage_voice_chats?: boolean, can_restrict_members?: boolean, can_promote_members?: boolean, can_change_info?: boolean, can_invite_users?: boolean, can_pin_messages?: boolean }): Promise<boolean> {
        return this.sendMethod(new TG.promoteChatMember(chat_id, user_id, optional?.is_anonymous, optional?.can_manage_chat, optional?.can_post_messages, optional?.can_edit_messages, optional?.can_delete_messages, optional?.can_manage_voice_chats, optional?.can_restrict_members, optional?.can_promote_members, optional?.can_change_info, optional?.can_invite_users, optional?.can_pin_messages)) as Promise<boolean>
    }

    /** Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success. */
    setChatAdministratorCustomTitle(chat_id: number|string, user_id: number, custom_title: string): Promise<boolean> {
        return this.sendMethod(new TG.setChatAdministratorCustomTitle(chat_id, user_id, custom_title)) as Promise<boolean>
    }

    /** Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success. */
    setChatPermissions(chat_id: number|string, permissions: TG.ChatPermissions): Promise<boolean> {
        return this.sendMethod(new TG.setChatPermissions(chat_id, permissions)) as Promise<boolean>
    }

    /** Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success. */
    exportChatInviteLink(chat_id: number|string): Promise<string> {
        return this.sendMethod(new TG.exportChatInviteLink(chat_id)) as Promise<string>
    }

    /** Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink). Returns the new invite link as [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object. */
    createChatInviteLink(chat_id: number|string, optional?: { name?: string, expire_date?: number, member_limit?: number, creates_join_request?: boolean }): Promise<TG.ChatInviteLink> {
        return this.sendMethod(new TG.createChatInviteLink(chat_id, optional?.name, optional?.expire_date, optional?.member_limit, optional?.creates_join_request)) as Promise<TG.ChatInviteLink>
    }

    /** Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object. */
    editChatInviteLink(chat_id: number|string, invite_link: string, optional?: { name?: string, expire_date?: number, member_limit?: number, creates_join_request?: boolean }): Promise<TG.ChatInviteLink> {
        return this.sendMethod(new TG.editChatInviteLink(chat_id, invite_link, optional?.name, optional?.expire_date, optional?.member_limit, optional?.creates_join_request)) as Promise<TG.ChatInviteLink>
    }

    /** Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object. */
    revokeChatInviteLink(chat_id: number|string, invite_link: string): Promise<TG.ChatInviteLink> {
        return this.sendMethod(new TG.revokeChatInviteLink(chat_id, invite_link)) as Promise<TG.ChatInviteLink>
    }

    /** Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success. */
    approveChatJoinRequest(chat_id: number|string, user_id: number): Promise<boolean> {
        return this.sendMethod(new TG.approveChatJoinRequest(chat_id, user_id)) as Promise<boolean>
    }

    /** Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success. */
    declineChatJoinRequest(chat_id: number|string, user_id: number): Promise<boolean> {
        return this.sendMethod(new TG.declineChatJoinRequest(chat_id, user_id)) as Promise<boolean>
    }

    /** Use this method to set a new profile photo for the chat. Photos can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
    setChatPhoto(chat_id: number|string, photo: TG.InputFile): Promise<boolean> {
        return this.sendMethod(new TG.setChatPhoto(chat_id, photo)) as Promise<boolean>
    }

    /** Use this method to delete a chat photo. Photos can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
    deleteChatPhoto(chat_id: number|string): Promise<boolean> {
        return this.sendMethod(new TG.deleteChatPhoto(chat_id)) as Promise<boolean>
    }

    /** Use this method to change the title of a chat. Titles can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
    setChatTitle(chat_id: number|string, title: string): Promise<boolean> {
        return this.sendMethod(new TG.setChatTitle(chat_id, title)) as Promise<boolean>
    }

    /** Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
    setChatDescription(chat_id: number|string, optional?: { description?: string }): Promise<boolean> {
        return this.sendMethod(new TG.setChatDescription(chat_id, optional?.description)) as Promise<boolean>
    }

    /** Use this method to add a message to the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the &#39;can_pin_messages&#39; administrator right in a supergroup or &#39;can_edit_messages&#39; administrator right in a channel. Returns True on success. */
    pinChatMessage(chat_id: number|string, message_id: number, optional?: { disable_notification?: boolean }): Promise<boolean> {
        return this.sendMethod(new TG.pinChatMessage(chat_id, message_id, optional?.disable_notification)) as Promise<boolean>
    }

    /** Use this method to remove a message from the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the &#39;can_pin_messages&#39; administrator right in a supergroup or &#39;can_edit_messages&#39; administrator right in a channel. Returns True on success. */
    unpinChatMessage(chat_id: number|string, optional?: { message_id?: number }): Promise<boolean> {
        return this.sendMethod(new TG.unpinChatMessage(chat_id, optional?.message_id)) as Promise<boolean>
    }

    /** Use this method to clear the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the &#39;can_pin_messages&#39; administrator right in a supergroup or &#39;can_edit_messages&#39; administrator right in a channel. Returns True on success. */
    unpinAllChatMessages(chat_id: number|string): Promise<boolean> {
        return this.sendMethod(new TG.unpinAllChatMessages(chat_id)) as Promise<boolean>
    }

    /** Use this method for your bot to leave a group, supergroup or channel. Returns True on success. */
    leaveChat(chat_id: number|string): Promise<boolean> {
        return this.sendMethod(new TG.leaveChat(chat_id)) as Promise<boolean>
    }

    /** Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a [Chat](https://core.telegram.org/bots/api#chat) object on success. */
    getChat(chat_id: number|string): Promise<TG.Chat> {
        return this.sendMethod(new TG.getChat(chat_id)) as Promise<TG.Chat>
    }

    /** Use this method to get a list of administrators in a chat. On success, returns an Array of [ChatMember](https://core.telegram.org/bots/api#chatmember) objects that contains information about all chat administrators except other bots. If the chat is a group or a supergroup and no administrators were appointed, only the creator will be returned. */
    getChatAdministrators(chat_id: number|string): Promise<Array<TG.ChatMember>> {
        return this.sendMethod(new TG.getChatAdministrators(chat_id)) as Promise<Array<TG.ChatMember>>
    }

    /** Use this method to get the number of members in a chat. Returns Int on success. */
    getChatMemberCount(chat_id: number|string): Promise<number> {
        return this.sendMethod(new TG.getChatMemberCount(chat_id)) as Promise<number>
    }

    /** Use this method to get information about a member of a chat. Returns a [ChatMember](https://core.telegram.org/bots/api#chatmember) object on success. */
    getChatMember(chat_id: number|string, user_id: number): Promise<TG.ChatMember> {
        return this.sendMethod(new TG.getChatMember(chat_id, user_id)) as Promise<TG.ChatMember>
    }

    /** Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in [getChat](https://core.telegram.org/bots/api#getchat) requests to check if the bot can use this method. Returns True on success. */
    setChatStickerSet(chat_id: number|string, sticker_set_name: string): Promise<boolean> {
        return this.sendMethod(new TG.setChatStickerSet(chat_id, sticker_set_name)) as Promise<boolean>
    }

    /** Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in [getChat](https://core.telegram.org/bots/api#getchat) requests to check if the bot can use this method. Returns True on success. */
    deleteChatStickerSet(chat_id: number|string): Promise<boolean> {
        return this.sendMethod(new TG.deleteChatStickerSet(chat_id)) as Promise<boolean>
    }

    /** Use this method to send answers to callback queries sent from [inline keyboards](/bots#inline-keyboards-and-on-the-fly-updating). The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned. */
    answerCallbackQuery(callback_query_id: string, optional?: { text?: string, show_alert?: boolean, url?: string, cache_time?: number }): Promise<boolean> {
        return this.sendMethod(new TG.answerCallbackQuery(callback_query_id, optional?.text, optional?.show_alert, optional?.url, optional?.cache_time)) as Promise<boolean>
    }

    /** Use this method to change the list of the bot&#39;s commands. See [https://core.telegram.org/bots#commands](https://core.telegram.org/bots#commands) for more details about bot commands. Returns True on success. */
    setMyCommands(commands: Array<TG.BotCommand>, optional?: { scope?: TG.BotCommandScope, language_code?: string }): Promise<boolean> {
        return this.sendMethod(new TG.setMyCommands(commands, optional?.scope, optional?.language_code)) as Promise<boolean>
    }

    /** Use this method to delete the list of the bot&#39;s commands for the given scope and user language. After deletion, [higher level commands](https://core.telegram.org/bots/api#determining-list-of-commands) will be shown to affected users. Returns True on success. */
    deleteMyCommands(optional?: { scope?: TG.BotCommandScope, language_code?: string }): Promise<boolean> {
        return this.sendMethod(new TG.deleteMyCommands(optional?.scope, optional?.language_code)) as Promise<boolean>
    }

    /** Use this method to get the current list of the bot&#39;s commands for the given scope and user language. Returns Array of [BotCommand](https://core.telegram.org/bots/api#botcommand) on success. If commands aren&#39;t set, an empty list is returned. */
    getMyCommands(optional?: { scope?: TG.BotCommandScope, language_code?: string }): Promise<Array<TG.BotCommand>> {
        return this.sendMethod(new TG.getMyCommands(optional?.scope, optional?.language_code)) as Promise<Array<TG.BotCommand>>
    }

    /** Use this method to edit text and [game](https://core.telegram.org/bots/api#games) messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
    editMessageText(text: string, optional?: { chat_id?: number|string, message_id?: number, inline_message_id?: string, parse_mode?: string, entities?: Array<TG.MessageEntity>, disable_web_page_preview?: boolean, reply_markup?: TG.InlineKeyboardMarkup }): Promise<TG.Message | boolean> {
        return this.sendMethod(new TG.editMessageText(text, optional?.chat_id, optional?.message_id, optional?.inline_message_id, optional?.parse_mode, optional?.entities, optional?.disable_web_page_preview, optional?.reply_markup)) as Promise<TG.Message | boolean>
    }

    /** Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
    editMessageCaption(optional?: { chat_id?: number|string, message_id?: number, inline_message_id?: string, caption?: string, parse_mode?: string, caption_entities?: Array<TG.MessageEntity>, reply_markup?: TG.InlineKeyboardMarkup }): Promise<TG.Message | boolean> {
        return this.sendMethod(new TG.editMessageCaption(optional?.chat_id, optional?.message_id, optional?.inline_message_id, optional?.caption, optional?.parse_mode, optional?.caption_entities, optional?.reply_markup)) as Promise<TG.Message | boolean>
    }

    /** Use this method to edit animation, audio, document, photo, or video messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can&#39;t be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
    editMessageMedia(media: TG.InputMedia, optional?: { chat_id?: number|string, message_id?: number, inline_message_id?: string, reply_markup?: TG.InlineKeyboardMarkup }): Promise<TG.Message | boolean> {
        return this.sendMethod(new TG.editMessageMedia(media, optional?.chat_id, optional?.message_id, optional?.inline_message_id, optional?.reply_markup)) as Promise<TG.Message | boolean>
    }

    /** Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
    editMessageReplyMarkup(optional?: { chat_id?: number|string, message_id?: number, inline_message_id?: string, reply_markup?: TG.InlineKeyboardMarkup }): Promise<TG.Message | boolean> {
        return this.sendMethod(new TG.editMessageReplyMarkup(optional?.chat_id, optional?.message_id, optional?.inline_message_id, optional?.reply_markup)) as Promise<TG.Message | boolean>
    }

    /** Use this method to stop a poll which was sent by the bot. On success, the stopped [Poll](https://core.telegram.org/bots/api#poll) is returned. */
    stopPoll(chat_id: number|string, message_id: number, optional?: { reply_markup?: TG.InlineKeyboardMarkup }): Promise<TG.Poll> {
        return this.sendMethod(new TG.stopPoll(chat_id, message_id, optional?.reply_markup)) as Promise<TG.Poll>
    }

    /** Use this method to delete a message, including service messages, with the following limitations:- A message can only be deleted if it was sent less than 48 hours ago.- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.- Bots can delete outgoing messages in private chats, groups, and supergroups.- Bots can delete incoming messages in private chats.- Bots granted can_post_messages permissions can delete outgoing messages in channels.- If the bot is an administrator of a group, it can delete any message there.- If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.Returns True on success. */
    deleteMessage(chat_id: number|string, message_id: number): Promise<boolean> {
        return this.sendMethod(new TG.deleteMessage(chat_id, message_id)) as Promise<boolean>
    }

    /** Use this method to send static .WEBP or [animated](https://telegram.org/blog/animated-stickers) .TGS stickers. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendSticker(chat_id: number|string, sticker: TG.InputFile|string, optional?: { disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup|TG.ReplyKeyboardMarkup|TG.ReplyKeyboardRemove|TG.ForceReply }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendSticker(chat_id, sticker, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to get a sticker set. On success, a [StickerSet](https://core.telegram.org/bots/api#stickerset) object is returned. */
    getStickerSet(name: string): Promise<TG.StickerSet> {
        return this.sendMethod(new TG.getStickerSet(name)) as Promise<TG.StickerSet>
    }

    /** Use this method to upload a .PNG file with a sticker for later use in createNewStickerSet and addStickerToSet methods (can be used multiple times). Returns the uploaded [File](https://core.telegram.org/bots/api#file) on success. */
    uploadStickerFile(user_id: number, png_sticker: TG.InputFile): Promise<TG.File> {
        return this.sendMethod(new TG.uploadStickerFile(user_id, png_sticker)) as Promise<TG.File>
    }

    /** Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. You must use exactly one of the fields png_sticker or tgs_sticker. Returns True on success. */
    createNewStickerSet(user_id: number, name: string, title: string, emojis: string, optional?: { png_sticker?: TG.InputFile|string, tgs_sticker?: TG.InputFile, contains_masks?: boolean, mask_position?: TG.MaskPosition }): Promise<boolean> {
        return this.sendMethod(new TG.createNewStickerSet(user_id, name, title, emojis, optional?.png_sticker, optional?.tgs_sticker, optional?.contains_masks, optional?.mask_position)) as Promise<boolean>
    }

    /** Use this method to add a new sticker to a set created by the bot. You must use exactly one of the fields png_sticker or tgs_sticker. Animated stickers can be added to animated sticker sets and only to them. Animated sticker sets can have up to 50 stickers. Static sticker sets can have up to 120 stickers. Returns True on success. */
    addStickerToSet(user_id: number, name: string, emojis: string, optional?: { png_sticker?: TG.InputFile|string, tgs_sticker?: TG.InputFile, mask_position?: TG.MaskPosition }): Promise<boolean> {
        return this.sendMethod(new TG.addStickerToSet(user_id, name, emojis, optional?.png_sticker, optional?.tgs_sticker, optional?.mask_position)) as Promise<boolean>
    }

    /** Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success. */
    setStickerPositionInSet(sticker: string, position: number): Promise<boolean> {
        return this.sendMethod(new TG.setStickerPositionInSet(sticker, position)) as Promise<boolean>
    }

    /** Use this method to delete a sticker from a set created by the bot. Returns True on success. */
    deleteStickerFromSet(sticker: string): Promise<boolean> {
        return this.sendMethod(new TG.deleteStickerFromSet(sticker)) as Promise<boolean>
    }

    /** Use this method to set the thumbnail of a sticker set. Animated thumbnails can be set for animated sticker sets only. Returns True on success. */
    setStickerSetThumb(name: string, user_id: number, optional?: { thumb?: TG.InputFile|string }): Promise<boolean> {
        return this.sendMethod(new TG.setStickerSetThumb(name, user_id, optional?.thumb)) as Promise<boolean>
    }

    /** Use this method to send answers to an inline query. On success, True is returned.No more than 50 results per query are allowed. */
    answerInlineQuery(inline_query_id: string, results: Array<TG.InlineQueryResult>, optional?: { cache_time?: number, is_personal?: boolean, next_offset?: string, switch_pm_text?: string, switch_pm_parameter?: string }): Promise<boolean> {
        return this.sendMethod(new TG.answerInlineQuery(inline_query_id, results, optional?.cache_time, optional?.is_personal, optional?.next_offset, optional?.switch_pm_text, optional?.switch_pm_parameter)) as Promise<boolean>
    }

    /** Use this method to send invoices. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendInvoice(chat_id: number|string, title: string, description: string, payload: string, provider_token: string, currency: string, prices: Array<TG.LabeledPrice>, optional?: { max_tip_amount?: number, suggested_tip_amounts?: Array<number>, start_parameter?: string, provider_data?: string, photo_url?: string, photo_size?: number, photo_width?: number, photo_height?: number, need_name?: boolean, need_phone_number?: boolean, need_email?: boolean, need_shipping_address?: boolean, send_phone_number_to_provider?: boolean, send_email_to_provider?: boolean, is_flexible?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendInvoice(chat_id, title, description, payload, provider_token, currency, prices, optional?.max_tip_amount, optional?.suggested_tip_amounts, optional?.start_parameter, optional?.provider_data, optional?.photo_url, optional?.photo_size, optional?.photo_width, optional?.photo_height, optional?.need_name, optional?.need_phone_number, optional?.need_email, optional?.need_shipping_address, optional?.send_phone_number_to_provider, optional?.send_email_to_provider, optional?.is_flexible, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an [Update](https://core.telegram.org/bots/api#update) with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned. */
    answerShippingQuery(shipping_query_id: string, ok: boolean, optional?: { shipping_options?: Array<TG.ShippingOption>, error_message?: string }): Promise<boolean> {
        return this.sendMethod(new TG.answerShippingQuery(shipping_query_id, ok, optional?.shipping_options, optional?.error_message)) as Promise<boolean>
    }

    /** Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an [Update](https://core.telegram.org/bots/api#update) with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent. */
    answerPreCheckoutQuery(pre_checkout_query_id: string, ok: boolean, optional?: { error_message?: string }): Promise<boolean> {
        return this.sendMethod(new TG.answerPreCheckoutQuery(pre_checkout_query_id, ok, optional?.error_message)) as Promise<boolean>
    }

    /** Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success. Use this if the data submitted by the user doesn&#39;t satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues. */
    setPassportDataErrors(user_id: number, errors: Array<TG.PassportElementError>): Promise<boolean> {
        return this.sendMethod(new TG.setPassportDataErrors(user_id, errors)) as Promise<boolean>
    }

    /** Use this method to send a game. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
    sendGame(chat_id: number, game_short_name: string, optional?: { disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: TG.InlineKeyboardMarkup }): Promise<TG.Message> {
        return this.sendMethod(new TG.sendGame(chat_id, game_short_name, optional?.disable_notification, optional?.reply_to_message_id, optional?.allow_sending_without_reply, optional?.reply_markup)) as Promise<TG.Message>
    }

    /** Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user&#39;s current score in the chat and force is False. */
    setGameScore(user_id: number, score: number, optional?: { force?: boolean, disable_edit_message?: boolean, chat_id?: number, message_id?: number, inline_message_id?: string }): Promise<TG.Message | true> {
        return this.sendMethod(new TG.setGameScore(user_id, score, optional?.force, optional?.disable_edit_message, optional?.chat_id, optional?.message_id, optional?.inline_message_id)) as Promise<TG.Message | true>
    }

    /** Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. On success, returns an Array of [GameHighScore](https://core.telegram.org/bots/api#gamehighscore) objects. */
    getGameHighScores(user_id: number, optional?: { chat_id?: number, message_id?: number, inline_message_id?: string }): Promise<Array<TG.GameHighScore>> {
        return this.sendMethod(new TG.getGameHighScores(user_id, optional?.chat_id, optional?.message_id, optional?.inline_message_id)) as Promise<Array<TG.GameHighScore>>
    }


}
