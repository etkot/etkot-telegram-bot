/** Any Telegram object */
export interface TGObject {
    /** Name of the interface that implements this interface */
    objectName: string,
}
/** Any Telegram type */
export type Type = TGObject
/** Any Telegram method */
export type Method = TGObject

/** Possible responses from the Telegram API */
export type ResponseResult = Type | Array<Type> | string | number | true

/** Response from a Telegram API method */
export interface Response {
    /** Whether the request was successful and the result*/
    ok: boolean,
    /** Result of the query if ok is true */
    result?: ResponseResult,
    /** Error code if ok is false */
    error_code?: number,
    /** Human-readable description */
    description?: string,
    /** Optional field which can help to automatically handle some error */
    parameters?: ResponseParameters,
}

/** This [object](https://core.telegram.org/bots/api#available-types) represents an incoming update.At most one of the optional parameters can be present in any given update. */
export class Update implements Type {
    /** Name of this interface as a string */
    objectName = 'Update'
    /** The update&#39;s unique identifier. Update identifiers start from a certain positive number and increase sequentially. This ID becomes especially handy if you&#39;re using [Webhooks](https://core.telegram.org/bots/api#setwebhook), since it allows you to ignore repeated updates or to restore the correct update sequence, should they get out of order. If there are no new updates for at least a week, then identifier of the next update will be chosen randomly instead of sequentially. */
    update_id: number
    /** New incoming message of any kind — text, photo, sticker, etc. */
    message?: Message
    /** New version of a message that is known to the bot and was edited */
    edited_message?: Message
    /** New incoming channel post of any kind — text, photo, sticker, etc. */
    channel_post?: Message
    /** New version of a channel post that is known to the bot and was edited */
    edited_channel_post?: Message
    /** New incoming [inline](https://core.telegram.org/bots/api#inline-mode) query */
    inline_query?: InlineQuery
    /** The result of an [inline](https://core.telegram.org/bots/api#inline-mode) query that was chosen by a user and sent to their chat partner. Please see our documentation on the [feedback collecting](/bots/inline#collecting-feedback) for details on how to enable these updates for your bot. */
    chosen_inline_result?: ChosenInlineResult
    /** New incoming callback query */
    callback_query?: CallbackQuery
    /** New incoming shipping query. Only for invoices with flexible price */
    shipping_query?: ShippingQuery
    /** New incoming pre-checkout query. Contains full information about checkout */
    pre_checkout_query?: PreCheckoutQuery
    /** New poll state. Bots receive only updates about stopped polls and polls, which are sent by the bot */
    poll?: Poll
    /** A user changed their answer in a non-anonymous poll. Bots receive new votes only in polls that were sent by the bot itself. */
    poll_answer?: PollAnswer
    /** The bot&#39;s chat member status was updated in a chat. For private chats, this update is received only when the bot is blocked or unblocked by the user. */
    my_chat_member?: ChatMemberUpdated
    /** A chat member&#39;s status was updated in a chat. The bot must be an administrator in the chat and must explicitly specify “chat_member” in the list of allowed_updates to receive these updates. */
    chat_member?: ChatMemberUpdated
    /** A request to join the chat has been sent. The bot must have the can_invite_users administrator right in the chat to receive these updates. */
    chat_join_request?: ChatJoinRequest

    constructor(update_id: number, message?: Message, edited_message?: Message, channel_post?: Message, edited_channel_post?: Message, inline_query?: InlineQuery, chosen_inline_result?: ChosenInlineResult, callback_query?: CallbackQuery, shipping_query?: ShippingQuery, pre_checkout_query?: PreCheckoutQuery, poll?: Poll, poll_answer?: PollAnswer, my_chat_member?: ChatMemberUpdated, chat_member?: ChatMemberUpdated, chat_join_request?: ChatJoinRequest) {
        this.update_id = update_id
        this.message = message
        this.edited_message = edited_message
        this.channel_post = channel_post
        this.edited_channel_post = edited_channel_post
        this.inline_query = inline_query
        this.chosen_inline_result = chosen_inline_result
        this.callback_query = callback_query
        this.shipping_query = shipping_query
        this.pre_checkout_query = pre_checkout_query
        this.poll = poll
        this.poll_answer = poll_answer
        this.my_chat_member = my_chat_member
        this.chat_member = chat_member
        this.chat_join_request = chat_join_request
    }
}

/** Use this method to receive incoming updates using long polling ([wiki](https://en.wikipedia.org/wiki/Push_technology#Long_polling)). An Array of [Update](https://core.telegram.org/bots/api#update) objects is returned. */
export class getUpdates implements Method {
    /** Name of this interface as a string */
    objectName = 'getUpdates'
    /** Identifier of the first update to be returned. Must be greater by one than the highest among the identifiers of previously received updates. By default, updates starting with the earliest unconfirmed update are returned. An update is considered confirmed as soon as getUpdates is called with an offset higher than its update_id. The negative offset can be specified to retrieve updates starting from -offset update from the end of the updates queue. All previous updates will forgotten. */
    offset?: number
    /** Limits the number of updates to be retrieved. Values between 1-100 are accepted. Defaults to 100. */
    limit?: number
    /** Timeout in seconds for long polling. Defaults to 0, i.e. usual short polling. Should be positive, short polling should be used for testing purposes only. */
    timeout?: number
    /** A JSON-serialized list of the update types you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member (default). If not specified, the previous setting will be used.Please note that this parameter doesn't affect updates created before the call to the getUpdates, so unwanted updates may be received for a short period of time. */
    allowed_updates?: Array<string>

    constructor(offset?: number, limit?: number, timeout?: number, allowed_updates?: Array<string>) {
        this.offset = offset
        this.limit = limit
        this.timeout = timeout
        this.allowed_updates = allowed_updates
    }
}

/** Use this method to specify a url and receive incoming updates via an outgoing webhook. Whenever there is an update for the bot, we will send an HTTPS POST request to the specified url, containing a JSON-serialized [Update](https://core.telegram.org/bots/api#update). In case of an unsuccessful request, we will give up after a reasonable amount of attempts. Returns True on success. If you&#39;d like to make sure that the Webhook request comes from Telegram, we recommend using a secret path in the URL, e.g. https://www.example.com/&lt;token&gt;. Since nobody else knows your bot&#39;s token, you can be pretty sure it&#39;s us. */
export class setWebhook implements Method {
    /** Name of this interface as a string */
    objectName = 'setWebhook'
    /** HTTPS url to send updates to. Use an empty string to remove webhook integration */
    url: string
    /** Upload your public key certificate so that the root certificate in use can be checked. See our self-signed guide for details. */
    certificate?: InputFile
    /** The fixed IP address which will be used to send webhook requests instead of the IP address resolved through DNS */
    ip_address?: string
    /** Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery, 1-100. Defaults to 40. Use lower values to limit the load on your bot's server, and higher values to increase your bot's throughput. */
    max_connections?: number
    /** A JSON-serialized list of the update types you want your bot to receive. For example, specify [“message”, “edited_channel_post”, “callback_query”] to only receive updates of these types. See Update for a complete list of available update types. Specify an empty list to receive all update types except chat_member (default). If not specified, the previous setting will be used.Please note that this parameter doesn't affect updates created before the call to the setWebhook, so unwanted updates may be received for a short period of time. */
    allowed_updates?: Array<string>
    /** Pass True to drop all pending updates */
    drop_pending_updates?: boolean

    constructor(url: string, certificate?: InputFile, ip_address?: string, max_connections?: number, allowed_updates?: Array<string>, drop_pending_updates?: boolean) {
        this.url = url
        this.certificate = certificate
        this.ip_address = ip_address
        this.max_connections = max_connections
        this.allowed_updates = allowed_updates
        this.drop_pending_updates = drop_pending_updates
    }
}

/** Use this method to remove webhook integration if you decide to switch back to [getUpdates](https://core.telegram.org/bots/api#getupdates). Returns True on success. */
export class deleteWebhook implements Method {
    /** Name of this interface as a string */
    objectName = 'deleteWebhook'
    /** Pass True to drop all pending updates */
    drop_pending_updates?: boolean

    constructor(drop_pending_updates?: boolean) {
        this.drop_pending_updates = drop_pending_updates
    }
}

/** Use this method to get current webhook status. Requires no parameters. On success, returns a [WebhookInfo](https://core.telegram.org/bots/api#webhookinfo) object. If the bot is using [getUpdates](https://core.telegram.org/bots/api#getupdates), will return an object with the url field empty. */
export class getWebhookInfo implements Method {
    /** Name of this interface as a string */
    objectName = 'getWebhookInfo'
}

/** Contains information about the current status of a webhook. */
export class WebhookInfo implements Type {
    /** Name of this interface as a string */
    objectName = 'WebhookInfo'
    /** Webhook URL, may be empty if webhook is not set up */
    url: string
    /** True, if a custom certificate was provided for webhook certificate checks */
    has_custom_certificate: boolean
    /** Number of updates awaiting delivery */
    pending_update_count: number
    /** Currently used webhook IP address */
    ip_address?: string
    /** Unix time for the most recent error that happened when trying to deliver an update via webhook */
    last_error_date?: number
    /** Error message in human-readable format for the most recent error that happened when trying to deliver an update via webhook */
    last_error_message?: string
    /** Maximum allowed number of simultaneous HTTPS connections to the webhook for update delivery */
    max_connections?: number
    /** A list of update types the bot is subscribed to. Defaults to all update types except chat_member */
    allowed_updates?: Array<string>

    constructor(url: string, has_custom_certificate: boolean, pending_update_count: number, ip_address?: string, last_error_date?: number, last_error_message?: string, max_connections?: number, allowed_updates?: Array<string>) {
        this.url = url
        this.has_custom_certificate = has_custom_certificate
        this.pending_update_count = pending_update_count
        this.ip_address = ip_address
        this.last_error_date = last_error_date
        this.last_error_message = last_error_message
        this.max_connections = max_connections
        this.allowed_updates = allowed_updates
    }
}

/** This object represents a Telegram user or bot. */
export class User implements Type {
    /** Name of this interface as a string */
    objectName = 'User'
    /** Unique identifier for this user or bot. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. */
    id: number
    /** True, if this user is a bot */
    is_bot: boolean
    /** User&#39;s or bot&#39;s first name */
    first_name: string
    /** User&#39;s or bot&#39;s last name */
    last_name?: string
    /** User&#39;s or bot&#39;s username */
    username?: string
    /** [IETF language tag](https://en.wikipedia.org/wiki/IETF_language_tag) of the user&#39;s language */
    language_code?: string
    /** True, if the bot can be invited to groups. Returned only in [getMe](https://core.telegram.org/bots/api#getme). */
    can_join_groups?: boolean
    /** True, if [privacy mode](https://core.telegram.org/bots#privacy-mode) is disabled for the bot. Returned only in [getMe](https://core.telegram.org/bots/api#getme). */
    can_read_all_group_messages?: boolean
    /** True, if the bot supports inline queries. Returned only in [getMe](https://core.telegram.org/bots/api#getme). */
    supports_inline_queries?: boolean

    constructor(id: number, is_bot: boolean, first_name: string, last_name?: string, username?: string, language_code?: string, can_join_groups?: boolean, can_read_all_group_messages?: boolean, supports_inline_queries?: boolean) {
        this.id = id
        this.is_bot = is_bot
        this.first_name = first_name
        this.last_name = last_name
        this.username = username
        this.language_code = language_code
        this.can_join_groups = can_join_groups
        this.can_read_all_group_messages = can_read_all_group_messages
        this.supports_inline_queries = supports_inline_queries
    }
}

/** This object represents a chat. */
export class Chat implements Type {
    /** Name of this interface as a string */
    objectName = 'Chat'
    /** Unique identifier for this chat. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
    id: number
    /** Type of chat, can be either “private”, “group”, “supergroup” or “channel” */
    type: string
    /** Title, for supergroups, channels and group chats */
    title?: string
    /** Username, for private chats, supergroups and channels if available */
    username?: string
    /** First name of the other party in a private chat */
    first_name?: string
    /** Last name of the other party in a private chat */
    last_name?: string
    /** Chat photo. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    photo?: ChatPhoto
    /** Bio of the other party in a private chat. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    bio?: string
    /** Description, for groups, supergroups and channel chats. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    description?: string
    /** Primary invite link, for groups, supergroups and channel chats. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    invite_link?: string
    /** The most recent pinned message (by sending date). Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    pinned_message?: Message
    /** Default chat member permissions, for groups and supergroups. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    permissions?: ChatPermissions
    /** For supergroups, the minimum allowed delay between consecutive messages sent by each unpriviledged user; in seconds. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    slow_mode_delay?: number
    /** The time after which all messages sent to the chat will be automatically deleted; in seconds. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    message_auto_delete_time?: number
    /** For supergroups, name of group sticker set. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    sticker_set_name?: string
    /** True, if the bot can change the group sticker set. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    can_set_sticker_set?: boolean
    /** Unique identifier for the linked chat, i.e. the discussion group identifier for a channel and vice versa; for supergroups and channel chats. This identifier may be greater than 32 bits and some programming languages may have difficulty/silent defects in interpreting it. But it is smaller than 52 bits, so a signed 64 bit integer or double-precision float type are safe for storing this identifier. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    linked_chat_id?: number
    /** For supergroups, the location to which the supergroup is connected. Returned only in [getChat](https://core.telegram.org/bots/api#getchat). */
    location?: ChatLocation

    constructor(id: number, type: string, title?: string, username?: string, first_name?: string, last_name?: string, photo?: ChatPhoto, bio?: string, description?: string, invite_link?: string, pinned_message?: Message, permissions?: ChatPermissions, slow_mode_delay?: number, message_auto_delete_time?: number, sticker_set_name?: string, can_set_sticker_set?: boolean, linked_chat_id?: number, location?: ChatLocation) {
        this.id = id
        this.type = type
        this.title = title
        this.username = username
        this.first_name = first_name
        this.last_name = last_name
        this.photo = photo
        this.bio = bio
        this.description = description
        this.invite_link = invite_link
        this.pinned_message = pinned_message
        this.permissions = permissions
        this.slow_mode_delay = slow_mode_delay
        this.message_auto_delete_time = message_auto_delete_time
        this.sticker_set_name = sticker_set_name
        this.can_set_sticker_set = can_set_sticker_set
        this.linked_chat_id = linked_chat_id
        this.location = location
    }
}

/** This object represents a message. */
export class Message implements Type {
    /** Name of this interface as a string */
    objectName = 'Message'
    /** Unique message identifier inside this chat */
    message_id: number
    /** Sender, empty for messages sent to channels */
    from?: User
    /** Sender of the message, sent on behalf of a chat. The channel itself for channel messages. The supergroup itself for messages from anonymous group administrators. The linked channel for messages automatically forwarded to the discussion group */
    sender_chat?: Chat
    /** Date the message was sent in Unix time */
    date: number
    /** Conversation the message belongs to */
    chat: Chat
    /** For forwarded messages, sender of the original message */
    forward_from?: User
    /** For messages forwarded from channels or from anonymous administrators, information about the original sender chat */
    forward_from_chat?: Chat
    /** For messages forwarded from channels, identifier of the original message in the channel */
    forward_from_message_id?: number
    /** For messages forwarded from channels, signature of the post author if present */
    forward_signature?: string
    /** Sender&#39;s name for messages forwarded from users who disallow adding a link to their account in forwarded messages */
    forward_sender_name?: string
    /** For forwarded messages, date the original message was sent in Unix time */
    forward_date?: number
    /** For replies, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply. */
    reply_to_message?: Message
    /** Bot through which the message was sent */
    via_bot?: User
    /** Date the message was last edited in Unix time */
    edit_date?: number
    /** The unique identifier of a media message group this message belongs to */
    media_group_id?: string
    /** Signature of the post author for messages in channels, or the custom title of an anonymous group administrator */
    author_signature?: string
    /** For text messages, the actual UTF-8 text of the message, 0-4096 characters */
    text?: string
    /** For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text */
    entities?: Array<MessageEntity>
    /** Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set */
    animation?: Animation
    /** Message is an audio file, information about the file */
    audio?: Audio
    /** Message is a general file, information about the file */
    document?: Document
    /** Message is a photo, available sizes of the photo */
    photo?: Array<PhotoSize>
    /** Message is a sticker, information about the sticker */
    sticker?: Sticker
    /** Message is a video, information about the video */
    video?: Video
    /** Message is a [video note](https://telegram.org/blog/video-messages-and-telescope), information about the video message */
    video_note?: VideoNote
    /** Message is a voice message, information about the file */
    voice?: Voice
    /** Caption for the animation, audio, document, photo, video or voice, 0-1024 characters */
    caption?: string
    /** For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption */
    caption_entities?: Array<MessageEntity>
    /** Message is a shared contact, information about the contact */
    contact?: Contact
    /** Message is a dice with random value */
    dice?: Dice
    /** Message is a game, information about the game. [More about games »](https://core.telegram.org/bots/api#games) */
    game?: Game
    /** Message is a native poll, information about the poll */
    poll?: Poll
    /** Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set */
    venue?: Venue
    /** Message is a shared location, information about the location */
    location?: Location
    /** New members that were added to the group or supergroup and information about them (the bot itself may be one of these members) */
    new_chat_members?: Array<User>
    /** A member was removed from the group, information about them (this member may be the bot itself) */
    left_chat_member?: User
    /** A chat title was changed to this value */
    new_chat_title?: string
    /** A chat photo was change to this value */
    new_chat_photo?: Array<PhotoSize>
    /** Service message: the chat photo was deleted */
    delete_chat_photo?: boolean
    /** Service message: the group has been created */
    group_chat_created?: boolean
    /** Service message: the supergroup has been created. This field can&#39;t be received in a message coming through updates, because bot can&#39;t be a member of a supergroup when it is created. It can only be found in reply_to_message if someone replies to a very first message in a directly created supergroup. */
    supergroup_chat_created?: boolean
    /** Service message: the channel has been created. This field can&#39;t be received in a message coming through updates, because bot can&#39;t be a member of a channel when it is created. It can only be found in reply_to_message if someone replies to a very first message in a channel. */
    channel_chat_created?: boolean
    /** Service message: auto-delete timer settings changed in the chat */
    message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged
    /** The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
    migrate_to_chat_id?: number
    /** The supergroup has been migrated from a group with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
    migrate_from_chat_id?: number
    /** Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it is itself a reply. */
    pinned_message?: Message
    /** Message is an invoice for a [payment](https://core.telegram.org/bots/api#payments), information about the invoice. [More about payments »](https://core.telegram.org/bots/api#payments) */
    invoice?: Invoice
    /** Message is a service message about a successful payment, information about the payment. [More about payments »](https://core.telegram.org/bots/api#payments) */
    successful_payment?: SuccessfulPayment
    /** The domain name of the website on which the user has logged in. [More about Telegram Login »](/widgets/login) */
    connected_website?: string
    /** Telegram Passport data */
    passport_data?: PassportData
    /** Service message. A user in the chat triggered another user&#39;s proximity alert while sharing Live Location. */
    proximity_alert_triggered?: ProximityAlertTriggered
    /** Service message: voice chat scheduled */
    voice_chat_scheduled?: VoiceChatScheduled
    /** Service message: voice chat started */
    voice_chat_started?: VoiceChatStarted
    /** Service message: voice chat ended */
    voice_chat_ended?: VoiceChatEnded
    /** Service message: new participants invited to a voice chat */
    voice_chat_participants_invited?: VoiceChatParticipantsInvited
    /** Inline keyboard attached to the message. login_url buttons are represented as ordinary url buttons. */
    reply_markup?: InlineKeyboardMarkup

    constructor(message_id: number, date: number, chat: Chat, from?: User, sender_chat?: Chat, forward_from?: User, forward_from_chat?: Chat, forward_from_message_id?: number, forward_signature?: string, forward_sender_name?: string, forward_date?: number, reply_to_message?: Message, via_bot?: User, edit_date?: number, media_group_id?: string, author_signature?: string, text?: string, entities?: Array<MessageEntity>, animation?: Animation, audio?: Audio, document?: Document, photo?: Array<PhotoSize>, sticker?: Sticker, video?: Video, video_note?: VideoNote, voice?: Voice, caption?: string, caption_entities?: Array<MessageEntity>, contact?: Contact, dice?: Dice, game?: Game, poll?: Poll, venue?: Venue, location?: Location, new_chat_members?: Array<User>, left_chat_member?: User, new_chat_title?: string, new_chat_photo?: Array<PhotoSize>, delete_chat_photo?: boolean, group_chat_created?: boolean, supergroup_chat_created?: boolean, channel_chat_created?: boolean, message_auto_delete_timer_changed?: MessageAutoDeleteTimerChanged, migrate_to_chat_id?: number, migrate_from_chat_id?: number, pinned_message?: Message, invoice?: Invoice, successful_payment?: SuccessfulPayment, connected_website?: string, passport_data?: PassportData, proximity_alert_triggered?: ProximityAlertTriggered, voice_chat_scheduled?: VoiceChatScheduled, voice_chat_started?: VoiceChatStarted, voice_chat_ended?: VoiceChatEnded, voice_chat_participants_invited?: VoiceChatParticipantsInvited, reply_markup?: InlineKeyboardMarkup) {
        this.message_id = message_id
        this.date = date
        this.chat = chat
        this.from = from
        this.sender_chat = sender_chat
        this.forward_from = forward_from
        this.forward_from_chat = forward_from_chat
        this.forward_from_message_id = forward_from_message_id
        this.forward_signature = forward_signature
        this.forward_sender_name = forward_sender_name
        this.forward_date = forward_date
        this.reply_to_message = reply_to_message
        this.via_bot = via_bot
        this.edit_date = edit_date
        this.media_group_id = media_group_id
        this.author_signature = author_signature
        this.text = text
        this.entities = entities
        this.animation = animation
        this.audio = audio
        this.document = document
        this.photo = photo
        this.sticker = sticker
        this.video = video
        this.video_note = video_note
        this.voice = voice
        this.caption = caption
        this.caption_entities = caption_entities
        this.contact = contact
        this.dice = dice
        this.game = game
        this.poll = poll
        this.venue = venue
        this.location = location
        this.new_chat_members = new_chat_members
        this.left_chat_member = left_chat_member
        this.new_chat_title = new_chat_title
        this.new_chat_photo = new_chat_photo
        this.delete_chat_photo = delete_chat_photo
        this.group_chat_created = group_chat_created
        this.supergroup_chat_created = supergroup_chat_created
        this.channel_chat_created = channel_chat_created
        this.message_auto_delete_timer_changed = message_auto_delete_timer_changed
        this.migrate_to_chat_id = migrate_to_chat_id
        this.migrate_from_chat_id = migrate_from_chat_id
        this.pinned_message = pinned_message
        this.invoice = invoice
        this.successful_payment = successful_payment
        this.connected_website = connected_website
        this.passport_data = passport_data
        this.proximity_alert_triggered = proximity_alert_triggered
        this.voice_chat_scheduled = voice_chat_scheduled
        this.voice_chat_started = voice_chat_started
        this.voice_chat_ended = voice_chat_ended
        this.voice_chat_participants_invited = voice_chat_participants_invited
        this.reply_markup = reply_markup
    }
}

/** This object represents a unique message identifier. */
export class MessageId implements Type {
    /** Name of this interface as a string */
    objectName = 'MessageId'
    /** Unique message identifier */
    message_id: number

    constructor(message_id: number) {
        this.message_id = message_id
    }
}

/** This object represents one special entity in a text message. For example, hashtags, usernames, URLs, etc. */
export class MessageEntity implements Type {
    /** Name of this interface as a string */
    objectName = 'MessageEntity'
    /** Type of the entity. Can be “mention” (@username), “hashtag” (#hashtag), “cashtag” ($USD), “bot_command” (/start@jobs_bot), “url” (https://telegram.org), “email” (do-not-reply@telegram.org), “phone_number” (+1-212-555-0123), “bold” (bold text), “italic” (italic text), “underline” (underlined text), “strikethrough” (strikethrough text), “code” (monowidth string), “pre” (monowidth block), “text_link” (for clickable text URLs), “text_mention” (for users [without usernames](https://telegram.org/blog/edit#new-mentions)) */
    type: string
    /** Offset in UTF-16 code units to the start of the entity */
    offset: number
    /** Length of the entity in UTF-16 code units */
    length: number
    /** For “text_link” only, url that will be opened after user taps on the text */
    url?: string
    /** For “text_mention” only, the mentioned user */
    user?: User
    /** For “pre” only, the programming language of the entity text */
    language?: string

    constructor(type: string, offset: number, length: number, url?: string, user?: User, language?: string) {
        this.type = type
        this.offset = offset
        this.length = length
        this.url = url
        this.user = user
        this.language = language
    }
}

/** This object represents one size of a photo or a [file](https://core.telegram.org/bots/api#document) / [sticker](https://core.telegram.org/bots/api#sticker) thumbnail. */
export class PhotoSize implements Type {
    /** Name of this interface as a string */
    objectName = 'PhotoSize'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** Photo width */
    width: number
    /** Photo height */
    height: number
    /** File size in bytes */
    file_size?: number

    constructor(file_id: string, file_unique_id: string, width: number, height: number, file_size?: number) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.width = width
        this.height = height
        this.file_size = file_size
    }
}

/** This object represents an animation file (GIF or H.264/MPEG-4 AVC video without sound). */
export class Animation implements Type {
    /** Name of this interface as a string */
    objectName = 'Animation'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** Video width as defined by sender */
    width: number
    /** Video height as defined by sender */
    height: number
    /** Duration of the video in seconds as defined by sender */
    duration: number
    /** Animation thumbnail as defined by sender */
    thumb?: PhotoSize
    /** Original animation filename as defined by sender */
    file_name?: string
    /** MIME type of the file as defined by sender */
    mime_type?: string
    /** File size in bytes */
    file_size?: number

    constructor(file_id: string, file_unique_id: string, width: number, height: number, duration: number, thumb?: PhotoSize, file_name?: string, mime_type?: string, file_size?: number) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.width = width
        this.height = height
        this.duration = duration
        this.thumb = thumb
        this.file_name = file_name
        this.mime_type = mime_type
        this.file_size = file_size
    }
}

/** This object represents an audio file to be treated as music by the Telegram clients. */
export class Audio implements Type {
    /** Name of this interface as a string */
    objectName = 'Audio'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** Duration of the audio in seconds as defined by sender */
    duration: number
    /** Performer of the audio as defined by sender or by audio tags */
    performer?: string
    /** Title of the audio as defined by sender or by audio tags */
    title?: string
    /** Original filename as defined by sender */
    file_name?: string
    /** MIME type of the file as defined by sender */
    mime_type?: string
    /** File size in bytes */
    file_size?: number
    /** Thumbnail of the album cover to which the music file belongs */
    thumb?: PhotoSize

    constructor(file_id: string, file_unique_id: string, duration: number, performer?: string, title?: string, file_name?: string, mime_type?: string, file_size?: number, thumb?: PhotoSize) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.duration = duration
        this.performer = performer
        this.title = title
        this.file_name = file_name
        this.mime_type = mime_type
        this.file_size = file_size
        this.thumb = thumb
    }
}

/** This object represents a general file (as opposed to [photos](https://core.telegram.org/bots/api#photosize), [voice messages](https://core.telegram.org/bots/api#voice) and [audio files](https://core.telegram.org/bots/api#audio)). */
export class Document implements Type {
    /** Name of this interface as a string */
    objectName = 'Document'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** Document thumbnail as defined by sender */
    thumb?: PhotoSize
    /** Original filename as defined by sender */
    file_name?: string
    /** MIME type of the file as defined by sender */
    mime_type?: string
    /** File size in bytes */
    file_size?: number

    constructor(file_id: string, file_unique_id: string, thumb?: PhotoSize, file_name?: string, mime_type?: string, file_size?: number) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.thumb = thumb
        this.file_name = file_name
        this.mime_type = mime_type
        this.file_size = file_size
    }
}

/** This object represents a video file. */
export class Video implements Type {
    /** Name of this interface as a string */
    objectName = 'Video'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** Video width as defined by sender */
    width: number
    /** Video height as defined by sender */
    height: number
    /** Duration of the video in seconds as defined by sender */
    duration: number
    /** Video thumbnail */
    thumb?: PhotoSize
    /** Original filename as defined by sender */
    file_name?: string
    /** Mime type of a file as defined by sender */
    mime_type?: string
    /** File size in bytes */
    file_size?: number

    constructor(file_id: string, file_unique_id: string, width: number, height: number, duration: number, thumb?: PhotoSize, file_name?: string, mime_type?: string, file_size?: number) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.width = width
        this.height = height
        this.duration = duration
        this.thumb = thumb
        this.file_name = file_name
        this.mime_type = mime_type
        this.file_size = file_size
    }
}

/** This object represents a [video message](https://telegram.org/blog/video-messages-and-telescope) (available in Telegram apps as of [v.4.0](https://telegram.org/blog/video-messages-and-telescope)). */
export class VideoNote implements Type {
    /** Name of this interface as a string */
    objectName = 'VideoNote'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** Video width and height (diameter of the video message) as defined by sender */
    length: number
    /** Duration of the video in seconds as defined by sender */
    duration: number
    /** Video thumbnail */
    thumb?: PhotoSize
    /** File size in bytes */
    file_size?: number

    constructor(file_id: string, file_unique_id: string, length: number, duration: number, thumb?: PhotoSize, file_size?: number) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.length = length
        this.duration = duration
        this.thumb = thumb
        this.file_size = file_size
    }
}

/** This object represents a voice note. */
export class Voice implements Type {
    /** Name of this interface as a string */
    objectName = 'Voice'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** Duration of the audio in seconds as defined by sender */
    duration: number
    /** MIME type of the file as defined by sender */
    mime_type?: string
    /** File size in bytes */
    file_size?: number

    constructor(file_id: string, file_unique_id: string, duration: number, mime_type?: string, file_size?: number) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.duration = duration
        this.mime_type = mime_type
        this.file_size = file_size
    }
}

/** This object represents a phone contact. */
export class Contact implements Type {
    /** Name of this interface as a string */
    objectName = 'Contact'
    /** Contact&#39;s phone number */
    phone_number: string
    /** Contact&#39;s first name */
    first_name: string
    /** Contact&#39;s last name */
    last_name?: string
    /** Contact&#39;s user identifier in Telegram. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a 64-bit integer or double-precision float type are safe for storing this identifier. */
    user_id?: number
    /** Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard) */
    vcard?: string

    constructor(phone_number: string, first_name: string, last_name?: string, user_id?: number, vcard?: string) {
        this.phone_number = phone_number
        this.first_name = first_name
        this.last_name = last_name
        this.user_id = user_id
        this.vcard = vcard
    }
}

/** This object represents an animated emoji that displays a random value. */
export class Dice implements Type {
    /** Name of this interface as a string */
    objectName = 'Dice'
    /** Emoji on which the dice throw animation is based */
    emoji: string
    /** Value of the dice, 1-6 for “”, “” and “” base emoji, 1-5 for “” and “” base emoji, 1-64 for “” base emoji */
    value: number

    constructor(emoji: string, value: number) {
        this.emoji = emoji
        this.value = value
    }
}

/** This object contains information about one answer option in a poll. */
export class PollOption implements Type {
    /** Name of this interface as a string */
    objectName = 'PollOption'
    /** Option text, 1-100 characters */
    text: string
    /** Number of users that voted for this option */
    voter_count: number

    constructor(text: string, voter_count: number) {
        this.text = text
        this.voter_count = voter_count
    }
}

/** This object represents an answer of a user in a non-anonymous poll. */
export class PollAnswer implements Type {
    /** Name of this interface as a string */
    objectName = 'PollAnswer'
    /** Unique poll identifier */
    poll_id: string
    /** The user, who changed the answer to the poll */
    user: User
    /** 0-based identifiers of answer options, chosen by the user. May be empty if the user retracted their vote. */
    option_ids: Array<number>

    constructor(poll_id: string, user: User, option_ids: Array<number>) {
        this.poll_id = poll_id
        this.user = user
        this.option_ids = option_ids
    }
}

/** This object contains information about a poll. */
export class Poll implements Type {
    /** Name of this interface as a string */
    objectName = 'Poll'
    /** Unique poll identifier */
    id: string
    /** Poll question, 1-300 characters */
    question: string
    /** List of poll options */
    options: Array<PollOption>
    /** Total number of users that voted in the poll */
    total_voter_count: number
    /** True, if the poll is closed */
    is_closed: boolean
    /** True, if the poll is anonymous */
    is_anonymous: boolean
    /** Poll type, currently can be “regular” or “quiz” */
    type: string
    /** True, if the poll allows multiple answers */
    allows_multiple_answers: boolean
    /** 0-based identifier of the correct answer option. Available only for polls in the quiz mode, which are closed, or was sent (not forwarded) by the bot or to the private chat with the bot. */
    correct_option_id?: number
    /** Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters */
    explanation?: string
    /** Special entities like usernames, URLs, bot commands, etc. that appear in the explanation */
    explanation_entities?: Array<MessageEntity>
    /** Amount of time in seconds the poll will be active after creation */
    open_period?: number
    /** Point in time (Unix timestamp) when the poll will be automatically closed */
    close_date?: number

    constructor(id: string, question: string, options: Array<PollOption>, total_voter_count: number, is_closed: boolean, is_anonymous: boolean, type: string, allows_multiple_answers: boolean, correct_option_id?: number, explanation?: string, explanation_entities?: Array<MessageEntity>, open_period?: number, close_date?: number) {
        this.id = id
        this.question = question
        this.options = options
        this.total_voter_count = total_voter_count
        this.is_closed = is_closed
        this.is_anonymous = is_anonymous
        this.type = type
        this.allows_multiple_answers = allows_multiple_answers
        this.correct_option_id = correct_option_id
        this.explanation = explanation
        this.explanation_entities = explanation_entities
        this.open_period = open_period
        this.close_date = close_date
    }
}

/** This object represents a point on the map. */
export class Location implements Type {
    /** Name of this interface as a string */
    objectName = 'Location'
    /** Longitude as defined by sender */
    longitude: number
    /** Latitude as defined by sender */
    latitude: number
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number
    /** Time relative to the message sending date, during which the location can be updated; in seconds. For active live locations only. */
    live_period?: number
    /** The direction in which user is moving, in degrees; 1-360. For active live locations only. */
    heading?: number
    /** Maximum distance for proximity alerts about approaching another chat member, in meters. For sent live locations only. */
    proximity_alert_radius?: number

    constructor(longitude: number, latitude: number, horizontal_accuracy?: number, live_period?: number, heading?: number, proximity_alert_radius?: number) {
        this.longitude = longitude
        this.latitude = latitude
        this.horizontal_accuracy = horizontal_accuracy
        this.live_period = live_period
        this.heading = heading
        this.proximity_alert_radius = proximity_alert_radius
    }
}

/** This object represents a venue. */
export class Venue implements Type {
    /** Name of this interface as a string */
    objectName = 'Venue'
    /** Venue location. Can&#39;t be a live location */
    location: Location
    /** Name of the venue */
    title: string
    /** Address of the venue */
    address: string
    /** Foursquare identifier of the venue */
    foursquare_id?: string
    /** Foursquare type of the venue. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) */
    foursquare_type?: string
    /** Google Places identifier of the venue */
    google_place_id?: string
    /** Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).) */
    google_place_type?: string

    constructor(location: Location, title: string, address: string, foursquare_id?: string, foursquare_type?: string, google_place_id?: string, google_place_type?: string) {
        this.location = location
        this.title = title
        this.address = address
        this.foursquare_id = foursquare_id
        this.foursquare_type = foursquare_type
        this.google_place_id = google_place_id
        this.google_place_type = google_place_type
    }
}

/** This object represents the content of a service message, sent whenever a user in the chat triggers a proximity alert set by another user. */
export class ProximityAlertTriggered implements Type {
    /** Name of this interface as a string */
    objectName = 'ProximityAlertTriggered'
    /** User that triggered the alert */
    traveler: User
    /** User that set the alert */
    watcher: User
    /** The distance between the users */
    distance: number

    constructor(traveler: User, watcher: User, distance: number) {
        this.traveler = traveler
        this.watcher = watcher
        this.distance = distance
    }
}

/** This object represents a service message about a change in auto-delete timer settings. */
export class MessageAutoDeleteTimerChanged implements Type {
    /** Name of this interface as a string */
    objectName = 'MessageAutoDeleteTimerChanged'
    /** New auto-delete time for messages in the chat; in seconds */
    message_auto_delete_time: number

    constructor(message_auto_delete_time: number) {
        this.message_auto_delete_time = message_auto_delete_time
    }
}

/** This object represents a service message about a voice chat scheduled in the chat. */
export class VoiceChatScheduled implements Type {
    /** Name of this interface as a string */
    objectName = 'VoiceChatScheduled'
    /** Point in time (Unix timestamp) when the voice chat is supposed to be started by a chat administrator */
    start_date: number

    constructor(start_date: number) {
        this.start_date = start_date
    }
}

/** This object represents a service message about a voice chat started in the chat. Currently holds no information. */
export class VoiceChatStarted implements Type {
    /** Name of this interface as a string */
    objectName = 'VoiceChatStarted'
}

/** This object represents a service message about a voice chat ended in the chat. */
export class VoiceChatEnded implements Type {
    /** Name of this interface as a string */
    objectName = 'VoiceChatEnded'
    /** Voice chat duration in seconds */
    duration: number

    constructor(duration: number) {
        this.duration = duration
    }
}

/** This object represents a service message about new members invited to a voice chat. */
export class VoiceChatParticipantsInvited implements Type {
    /** Name of this interface as a string */
    objectName = 'VoiceChatParticipantsInvited'
    /** New members that were invited to the voice chat */
    users?: Array<User>

    constructor(users?: Array<User>) {
        this.users = users
    }
}

/** This object represent a user&#39;s profile pictures. */
export class UserProfilePhotos implements Type {
    /** Name of this interface as a string */
    objectName = 'UserProfilePhotos'
    /** Total number of profile pictures the target user has */
    total_count: number
    /** Requested profile pictures (in up to 4 sizes each) */
    photos: Array<Array<PhotoSize>>

    constructor(total_count: number, photos: Array<Array<PhotoSize>>) {
        this.total_count = total_count
        this.photos = photos
    }
}

/** This object represents a file ready to be downloaded. The file can be downloaded via the link https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt;. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling [getFile](https://core.telegram.org/bots/api#getfile). */
export class File implements Type {
    /** Name of this interface as a string */
    objectName = 'File'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** File size in bytes, if known */
    file_size?: number
    /** File path. Use https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt; to get the file. */
    file_path?: string

    constructor(file_id: string, file_unique_id: string, file_size?: number, file_path?: string) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.file_size = file_size
        this.file_path = file_path
    }
}

/** This object represents a [custom keyboard](https://core.telegram.org/bots#keyboards) with reply options (see [Introduction to bots](https://core.telegram.org/bots#keyboards) for details and examples). */
export class ReplyKeyboardMarkup implements Type {
    /** Name of this interface as a string */
    objectName = 'ReplyKeyboardMarkup'
    /** Array of button rows, each represented by an Array of [KeyboardButton](https://core.telegram.org/bots/api#keyboardbutton) objects */
    keyboard: Array<Array<KeyboardButton>>
    /** Requests clients to resize the keyboard vertically for optimal fit (e.g., make the keyboard smaller if there are just two rows of buttons). Defaults to false, in which case the custom keyboard is always of the same height as the app&#39;s standard keyboard. */
    resize_keyboard?: boolean
    /** Requests clients to hide the keyboard as soon as it&#39;s been used. The keyboard will still be available, but clients will automatically display the usual letter-keyboard in the chat – the user can press a special button in the input field to see the custom keyboard again. Defaults to false. */
    one_time_keyboard?: boolean
    /** The placeholder to be shown in the input field when the keyboard is active; 1-64 characters */
    input_field_placeholder?: string
    /** Use this parameter if you want to show the keyboard to specific users only. Targets: 1) users that are @mentioned in the text of the [Message](https://core.telegram.org/bots/api#message) object; 2) if the bot&#39;s message is a reply (has reply_to_message_id), sender of the original message.Example: A user requests to change the bot&#39;s language, bot replies to the request with a keyboard to select the new language. Other users in the group don&#39;t see the keyboard. */
    selective?: boolean

    constructor(keyboard: Array<Array<KeyboardButton>>, resize_keyboard?: boolean, one_time_keyboard?: boolean, input_field_placeholder?: string, selective?: boolean) {
        this.keyboard = keyboard
        this.resize_keyboard = resize_keyboard
        this.one_time_keyboard = one_time_keyboard
        this.input_field_placeholder = input_field_placeholder
        this.selective = selective
    }
}

/** This object represents one button of the reply keyboard. For simple text buttons String can be used instead of this object to specify text of the button. Optional fields request_contact, request_location, and request_poll are mutually exclusive. */
export class KeyboardButton implements Type {
    /** Name of this interface as a string */
    objectName = 'KeyboardButton'
    /** Text of the button. If none of the optional fields are used, it will be sent as a message when the button is pressed */
    text: string
    /** If True, the user&#39;s phone number will be sent as a contact when the button is pressed. Available in private chats only */
    request_contact?: boolean
    /** If True, the user&#39;s current location will be sent when the button is pressed. Available in private chats only */
    request_location?: boolean
    /** If specified, the user will be asked to create a poll and send it to the bot when the button is pressed. Available in private chats only */
    request_poll?: KeyboardButtonPollType

    constructor(text: string, request_contact?: boolean, request_location?: boolean, request_poll?: KeyboardButtonPollType) {
        this.text = text
        this.request_contact = request_contact
        this.request_location = request_location
        this.request_poll = request_poll
    }
}

/** This object represents type of a poll, which is allowed to be created and sent when the corresponding button is pressed. */
export class KeyboardButtonPollType implements Type {
    /** Name of this interface as a string */
    objectName = 'KeyboardButtonPollType'
    /** If quiz is passed, the user will be allowed to create only polls in the quiz mode. If regular is passed, only regular polls will be allowed. Otherwise, the user will be allowed to create a poll of any type. */
    type?: string

    constructor(type?: string) {
        this.type = type
    }
}

/** Upon receiving a message with this object, Telegram clients will remove the current custom keyboard and display the default letter-keyboard. By default, custom keyboards are displayed until a new keyboard is sent by a bot. An exception is made for one-time keyboards that are hidden immediately after the user presses a button (see [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup)). */
export class ReplyKeyboardRemove implements Type {
    /** Name of this interface as a string */
    objectName = 'ReplyKeyboardRemove'
    /** Requests clients to remove the custom keyboard (user will not be able to summon this keyboard; if you want to hide the keyboard from sight but keep it accessible, use one_time_keyboard in [ReplyKeyboardMarkup](https://core.telegram.org/bots/api#replykeyboardmarkup)) */
    remove_keyboard: boolean
    /** Use this parameter if you want to remove the keyboard for specific users only. Targets: 1) users that are @mentioned in the text of the [Message](https://core.telegram.org/bots/api#message) object; 2) if the bot&#39;s message is a reply (has reply_to_message_id), sender of the original message.Example: A user votes in a poll, bot returns confirmation message in reply to the vote and removes the keyboard for that user, while still showing the keyboard with poll options to users who haven&#39;t voted yet. */
    selective?: boolean

    constructor(remove_keyboard: boolean, selective?: boolean) {
        this.remove_keyboard = remove_keyboard
        this.selective = selective
    }
}

/** This object represents an [inline keyboard](https://core.telegram.org/bots#inline-keyboards-and-on-the-fly-updating) that appears right next to the message it belongs to. */
export class InlineKeyboardMarkup implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineKeyboardMarkup'
    /** Array of button rows, each represented by an Array of [InlineKeyboardButton](https://core.telegram.org/bots/api#inlinekeyboardbutton) objects */
    inline_keyboard: Array<Array<InlineKeyboardButton>>

    constructor(inline_keyboard: Array<Array<InlineKeyboardButton>>) {
        this.inline_keyboard = inline_keyboard
    }
}

/** This object represents one button of an inline keyboard. You must use exactly one of the optional fields. */
export class InlineKeyboardButton implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineKeyboardButton'
    /** Label text on the button */
    text: string
    /** HTTP or tg:// url to be opened when button is pressed */
    url?: string
    /** An HTTP URL used to automatically authorize the user. Can be used as a replacement for the [Telegram Login Widget](https://core.telegram.org/widgets/login). */
    login_url?: LoginUrl
    /** Data to be sent in a [callback query](https://core.telegram.org/bots/api#callbackquery) to the bot when button is pressed, 1-64 bytes */
    callback_data?: string
    /** If set, pressing the button will prompt the user to select one of their chats, open that chat and insert the bot&#39;s username and the specified inline query in the input field. Can be empty, in which case just the bot&#39;s username will be inserted.Note: This offers an easy way for users to start using your bot in [inline mode](/bots/inline) when they are currently in a private chat with it. Especially useful when combined with [switch_pm…](https://core.telegram.org/bots/api#answerinlinequery) actions – in this case the user will be automatically returned to the chat they switched from, skipping the chat selection screen. */
    switch_inline_query?: string
    /** If set, pressing the button will insert the bot&#39;s username and the specified inline query in the current chat&#39;s input field. Can be empty, in which case only the bot&#39;s username will be inserted.This offers a quick way for the user to open your bot in inline mode in the same chat – good for selecting something from multiple options. */
    switch_inline_query_current_chat?: string
    /** Description of the game that will be launched when the user presses the button.NOTE: This type of button must always be the first button in the first row. */
    callback_game?: CallbackGame
    /** Specify True, to send a [Pay button](https://core.telegram.org/bots/api#payments).NOTE: This type of button must always be the first button in the first row. */
    pay?: boolean

    constructor(text: string, url?: string, login_url?: LoginUrl, callback_data?: string, switch_inline_query?: string, switch_inline_query_current_chat?: string, callback_game?: CallbackGame, pay?: boolean) {
        this.text = text
        this.url = url
        this.login_url = login_url
        this.callback_data = callback_data
        this.switch_inline_query = switch_inline_query
        this.switch_inline_query_current_chat = switch_inline_query_current_chat
        this.callback_game = callback_game
        this.pay = pay
    }
}

/** This object represents a parameter of the inline keyboard button used to automatically authorize a user. Serves as a great replacement for the [Telegram Login Widget](https://core.telegram.org/widgets/login) when the user is coming from Telegram. All the user needs to do is tap/click a button and confirm that they want to log in: Telegram apps support these buttons as of [version 5.7](https://telegram.org/blog/privacy-discussions-web-bots#meet-seamless-web-bots). */
export class LoginUrl implements Type {
    /** Name of this interface as a string */
    objectName = 'LoginUrl'
    /** An HTTP URL to be opened with user authorization data added to the query string when the button is pressed. If the user refuses to provide authorization data, the original URL without information about the user will be opened. The data added is the same as described in [Receiving authorization data](https://core.telegram.org/widgets/login#receiving-authorization-data).NOTE: You must always check the hash of the received data to verify the authentication and the integrity of the data as described in [Checking authorization](https://core.telegram.org/widgets/login#checking-authorization). */
    url: string
    /** New text of the button in forwarded messages. */
    forward_text?: string
    /** Username of a bot, which will be used for user authorization. See [Setting up a bot](https://core.telegram.org/widgets/login#setting-up-a-bot) for more details. If not specified, the current bot&#39;s username will be assumed. The url&#39;s domain must be the same as the domain linked with the bot. See [Linking your domain to the bot](https://core.telegram.org/widgets/login#linking-your-domain-to-the-bot) for more details. */
    bot_username?: string
    /** Pass True to request the permission for your bot to send messages to the user. */
    request_write_access?: boolean

    constructor(url: string, forward_text?: string, bot_username?: string, request_write_access?: boolean) {
        this.url = url
        this.forward_text = forward_text
        this.bot_username = bot_username
        this.request_write_access = request_write_access
    }
}

/** This object represents an incoming callback query from a callback button in an [inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating). If the button that originated the query was attached to a message sent by the bot, the field message will be present. If the button was attached to a message sent via the bot (in [inline mode](https://core.telegram.org/bots/api#inline-mode)), the field inline_message_id will be present. Exactly one of the fields data or game_short_name will be present. */
export class CallbackQuery implements Type {
    /** Name of this interface as a string */
    objectName = 'CallbackQuery'
    /** Unique identifier for this query */
    id: string
    /** Sender */
    from: User
    /** Message with the callback button that originated the query. Note that message content and message date will not be available if the message is too old */
    message?: Message
    /** Identifier of the message sent via the bot in inline mode, that originated the query. */
    inline_message_id?: string
    /** Global identifier, uniquely corresponding to the chat to which the message with the callback button was sent. Useful for high scores in [games](https://core.telegram.org/bots/api#games). */
    chat_instance: string
    /** Data associated with the callback button. Be aware that a bad client can send arbitrary data in this field. */
    data?: string
    /** Short name of a [Game](https://core.telegram.org/bots/api#games) to be returned, serves as the unique identifier for the game */
    game_short_name?: string

    constructor(id: string, from: User, chat_instance: string, message?: Message, inline_message_id?: string, data?: string, game_short_name?: string) {
        this.id = id
        this.from = from
        this.chat_instance = chat_instance
        this.message = message
        this.inline_message_id = inline_message_id
        this.data = data
        this.game_short_name = game_short_name
    }
}

/** Upon receiving a message with this object, Telegram clients will display a reply interface to the user (act as if the user has selected the bot&#39;s message and tapped &#39;Reply&#39;). This can be extremely useful if you want to create user-friendly step-by-step interfaces without having to sacrifice [privacy mode](/bots#privacy-mode). */
export class ForceReply implements Type {
    /** Name of this interface as a string */
    objectName = 'ForceReply'
    /** Shows reply interface to the user, as if they manually selected the bot&#39;s message and tapped &#39;Reply&#39; */
    force_reply: boolean
    /** The placeholder to be shown in the input field when the reply is active; 1-64 characters */
    input_field_placeholder?: string
    /** Use this parameter if you want to force reply from specific users only. Targets: 1) users that are @mentioned in the text of the [Message](https://core.telegram.org/bots/api#message) object; 2) if the bot&#39;s message is a reply (has reply_to_message_id), sender of the original message. */
    selective?: boolean

    constructor(force_reply: boolean, input_field_placeholder?: string, selective?: boolean) {
        this.force_reply = force_reply
        this.input_field_placeholder = input_field_placeholder
        this.selective = selective
    }
}

/** This object represents a chat photo. */
export class ChatPhoto implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatPhoto'
    /** File identifier of small (160x160) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed. */
    small_file_id: string
    /** Unique file identifier of small (160x160) chat photo, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    small_file_unique_id: string
    /** File identifier of big (640x640) chat photo. This file_id can be used only for photo download and only for as long as the photo is not changed. */
    big_file_id: string
    /** Unique file identifier of big (640x640) chat photo, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    big_file_unique_id: string

    constructor(small_file_id: string, small_file_unique_id: string, big_file_id: string, big_file_unique_id: string) {
        this.small_file_id = small_file_id
        this.small_file_unique_id = small_file_unique_id
        this.big_file_id = big_file_id
        this.big_file_unique_id = big_file_unique_id
    }
}

/** Represents an invite link for a chat. */
export class ChatInviteLink implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatInviteLink'
    /** The invite link. If the link was created by another chat administrator, then the second part of the link will be replaced with “…”. */
    invite_link: string
    /** Creator of the link */
    creator: User
    /** True, if users joining the chat via the link need to be approved by chat administrators */
    creates_join_request: boolean
    /** True, if the link is primary */
    is_primary: boolean
    /** True, if the link is revoked */
    is_revoked: boolean
    /** Invite link name */
    name?: string
    /** Point in time (Unix timestamp) when the link will expire or has been expired */
    expire_date?: number
    /** Maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 */
    member_limit?: number
    /** Number of pending join requests created using this link */
    pending_join_request_count?: number

    constructor(invite_link: string, creator: User, creates_join_request: boolean, is_primary: boolean, is_revoked: boolean, name?: string, expire_date?: number, member_limit?: number, pending_join_request_count?: number) {
        this.invite_link = invite_link
        this.creator = creator
        this.creates_join_request = creates_join_request
        this.is_primary = is_primary
        this.is_revoked = is_revoked
        this.name = name
        this.expire_date = expire_date
        this.member_limit = member_limit
        this.pending_join_request_count = pending_join_request_count
    }
}

/** This object contains information about one member of a chat. Currently, the following 6 types of chat members are supported: */
export type ChatMember = ChatMemberOwner | ChatMemberAdministrator | ChatMemberMember | ChatMemberRestricted | ChatMemberLeft | ChatMemberBanned

/** Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that owns the chat and has all administrator privileges. */
export class ChatMemberOwner implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatMemberOwner'
    /** The member&#39;s status in the chat, always “creator” */
    status: string
    /** Information about the user */
    user: User
    /** True, if the user&#39;s presence in the chat is hidden */
    is_anonymous: boolean
    /** Custom title for this user */
    custom_title?: string

    constructor(status: string, user: User, is_anonymous: boolean, custom_title?: string) {
        this.status = status
        this.user = user
        this.is_anonymous = is_anonymous
        this.custom_title = custom_title
    }
}

/** Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that has some additional privileges. */
export class ChatMemberAdministrator implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatMemberAdministrator'
    /** The member&#39;s status in the chat, always “administrator” */
    status: string
    /** Information about the user */
    user: User
    /** True, if the bot is allowed to edit administrator privileges of that user */
    can_be_edited: boolean
    /** True, if the user&#39;s presence in the chat is hidden */
    is_anonymous: boolean
    /** True, if the administrator can access the chat event log, chat statistics, message statistics in channels, see channel members, see anonymous administrators in supergroups and ignore slow mode. Implied by any other administrator privilege */
    can_manage_chat: boolean
    /** True, if the administrator can delete messages of other users */
    can_delete_messages: boolean
    /** True, if the administrator can manage voice chats */
    can_manage_voice_chats: boolean
    /** True, if the administrator can restrict, ban or unban chat members */
    can_restrict_members: boolean
    /** True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by the user) */
    can_promote_members: boolean
    /** True, if the user is allowed to change the chat title, photo and other settings */
    can_change_info: boolean
    /** True, if the user is allowed to invite new users to the chat */
    can_invite_users: boolean
    /** True, if the administrator can post in the channel; channels only */
    can_post_messages?: boolean
    /** True, if the administrator can edit messages of other users and can pin messages; channels only */
    can_edit_messages?: boolean
    /** True, if the user is allowed to pin messages; groups and supergroups only */
    can_pin_messages?: boolean
    /** Custom title for this user */
    custom_title?: string

    constructor(status: string, user: User, can_be_edited: boolean, is_anonymous: boolean, can_manage_chat: boolean, can_delete_messages: boolean, can_manage_voice_chats: boolean, can_restrict_members: boolean, can_promote_members: boolean, can_change_info: boolean, can_invite_users: boolean, can_post_messages?: boolean, can_edit_messages?: boolean, can_pin_messages?: boolean, custom_title?: string) {
        this.status = status
        this.user = user
        this.can_be_edited = can_be_edited
        this.is_anonymous = is_anonymous
        this.can_manage_chat = can_manage_chat
        this.can_delete_messages = can_delete_messages
        this.can_manage_voice_chats = can_manage_voice_chats
        this.can_restrict_members = can_restrict_members
        this.can_promote_members = can_promote_members
        this.can_change_info = can_change_info
        this.can_invite_users = can_invite_users
        this.can_post_messages = can_post_messages
        this.can_edit_messages = can_edit_messages
        this.can_pin_messages = can_pin_messages
        this.custom_title = custom_title
    }
}

/** Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that has no additional privileges or restrictions. */
export class ChatMemberMember implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatMemberMember'
    /** The member&#39;s status in the chat, always “member” */
    status: string
    /** Information about the user */
    user: User

    constructor(status: string, user: User) {
        this.status = status
        this.user = user
    }
}

/** Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that is under certain restrictions in the chat. Supergroups only. */
export class ChatMemberRestricted implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatMemberRestricted'
    /** The member&#39;s status in the chat, always “restricted” */
    status: string
    /** Information about the user */
    user: User
    /** True, if the user is a member of the chat at the moment of the request */
    is_member: boolean
    /** True, if the user is allowed to change the chat title, photo and other settings */
    can_change_info: boolean
    /** True, if the user is allowed to invite new users to the chat */
    can_invite_users: boolean
    /** True, if the user is allowed to pin messages */
    can_pin_messages: boolean
    /** True, if the user is allowed to send text messages, contacts, locations and venues */
    can_send_messages: boolean
    /** True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes */
    can_send_media_messages: boolean
    /** True, if the user is allowed to send polls */
    can_send_polls: boolean
    /** True, if the user is allowed to send animations, games, stickers and use inline bots */
    can_send_other_messages: boolean
    /** True, if the user is allowed to add web page previews to their messages */
    can_add_web_page_previews: boolean
    /** Date when restrictions will be lifted for this user; unix time. If 0, then the user is restricted forever */
    until_date: number

    constructor(status: string, user: User, is_member: boolean, can_change_info: boolean, can_invite_users: boolean, can_pin_messages: boolean, can_send_messages: boolean, can_send_media_messages: boolean, can_send_polls: boolean, can_send_other_messages: boolean, can_add_web_page_previews: boolean, until_date: number) {
        this.status = status
        this.user = user
        this.is_member = is_member
        this.can_change_info = can_change_info
        this.can_invite_users = can_invite_users
        this.can_pin_messages = can_pin_messages
        this.can_send_messages = can_send_messages
        this.can_send_media_messages = can_send_media_messages
        this.can_send_polls = can_send_polls
        this.can_send_other_messages = can_send_other_messages
        this.can_add_web_page_previews = can_add_web_page_previews
        this.until_date = until_date
    }
}

/** Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that isn&#39;t currently a member of the chat, but may join it themselves. */
export class ChatMemberLeft implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatMemberLeft'
    /** The member&#39;s status in the chat, always “left” */
    status: string
    /** Information about the user */
    user: User

    constructor(status: string, user: User) {
        this.status = status
        this.user = user
    }
}

/** Represents a [chat member](https://core.telegram.org/bots/api#chatmember) that was banned in the chat and can&#39;t return to the chat or view chat messages. */
export class ChatMemberBanned implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatMemberBanned'
    /** The member&#39;s status in the chat, always “kicked” */
    status: string
    /** Information about the user */
    user: User
    /** Date when restrictions will be lifted for this user; unix time. If 0, then the user is banned forever */
    until_date: number

    constructor(status: string, user: User, until_date: number) {
        this.status = status
        this.user = user
        this.until_date = until_date
    }
}

/** This object represents changes in the status of a chat member. */
export class ChatMemberUpdated implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatMemberUpdated'
    /** Chat the user belongs to */
    chat: Chat
    /** Performer of the action, which resulted in the change */
    from: User
    /** Date the change was done in Unix time */
    date: number
    /** Previous information about the chat member */
    old_chat_member: ChatMember
    /** New information about the chat member */
    new_chat_member: ChatMember
    /** Chat invite link, which was used by the user to join the chat; for joining by invite link events only. */
    invite_link?: ChatInviteLink

    constructor(chat: Chat, from: User, date: number, old_chat_member: ChatMember, new_chat_member: ChatMember, invite_link?: ChatInviteLink) {
        this.chat = chat
        this.from = from
        this.date = date
        this.old_chat_member = old_chat_member
        this.new_chat_member = new_chat_member
        this.invite_link = invite_link
    }
}

/** Represents a join request sent to a chat. */
export class ChatJoinRequest implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatJoinRequest'
    /** Chat to which the request was sent */
    chat: Chat
    /** User that sent the join request */
    from: User
    /** Date the request was sent in Unix time */
    date: number
    /** Bio of the user. */
    bio?: string
    /** Chat invite link that was used by the user to send the join request */
    invite_link?: ChatInviteLink

    constructor(chat: Chat, from: User, date: number, bio?: string, invite_link?: ChatInviteLink) {
        this.chat = chat
        this.from = from
        this.date = date
        this.bio = bio
        this.invite_link = invite_link
    }
}

/** Describes actions that a non-administrator user is allowed to take in a chat. */
export class ChatPermissions implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatPermissions'
    /** True, if the user is allowed to send text messages, contacts, locations and venues */
    can_send_messages?: boolean
    /** True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages */
    can_send_media_messages?: boolean
    /** True, if the user is allowed to send polls, implies can_send_messages */
    can_send_polls?: boolean
    /** True, if the user is allowed to send animations, games, stickers and use inline bots, implies can_send_media_messages */
    can_send_other_messages?: boolean
    /** True, if the user is allowed to add web page previews to their messages, implies can_send_media_messages */
    can_add_web_page_previews?: boolean
    /** True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups */
    can_change_info?: boolean
    /** True, if the user is allowed to invite new users to the chat */
    can_invite_users?: boolean
    /** True, if the user is allowed to pin messages. Ignored in public supergroups */
    can_pin_messages?: boolean

    constructor(can_send_messages?: boolean, can_send_media_messages?: boolean, can_send_polls?: boolean, can_send_other_messages?: boolean, can_add_web_page_previews?: boolean, can_change_info?: boolean, can_invite_users?: boolean, can_pin_messages?: boolean) {
        this.can_send_messages = can_send_messages
        this.can_send_media_messages = can_send_media_messages
        this.can_send_polls = can_send_polls
        this.can_send_other_messages = can_send_other_messages
        this.can_add_web_page_previews = can_add_web_page_previews
        this.can_change_info = can_change_info
        this.can_invite_users = can_invite_users
        this.can_pin_messages = can_pin_messages
    }
}

/** Represents a location to which a chat is connected. */
export class ChatLocation implements Type {
    /** Name of this interface as a string */
    objectName = 'ChatLocation'
    /** The location to which the supergroup is connected. Can&#39;t be a live location. */
    location: Location
    /** Location address; 1-64 characters, as defined by the chat owner */
    address: string

    constructor(location: Location, address: string) {
        this.location = location
        this.address = address
    }
}

/** This object represents a bot command. */
export class BotCommand implements Type {
    /** Name of this interface as a string */
    objectName = 'BotCommand'
    /** Text of the command, 1-32 characters. Can contain only lowercase English letters, digits and underscores. */
    command: string
    /** Description of the command, 3-256 characters. */
    description: string

    constructor(command: string, description: string) {
        this.command = command
        this.description = description
    }
}

/** This object represents the scope to which bot commands are applied. Currently, the following 7 scopes are supported: */
export type BotCommandScope = BotCommandScopeDefault | BotCommandScopeAllPrivateChats | BotCommandScopeAllGroupChats | BotCommandScopeAllChatAdministrators | BotCommandScopeChat | BotCommandScopeChatAdministrators | BotCommandScopeChatMember

/** Represents the default [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands. Default commands are used if no commands with a [narrower scope](https://core.telegram.org/bots/api#determining-list-of-commands) are specified for the user. */
export class BotCommandScopeDefault implements Type {
    /** Name of this interface as a string */
    objectName = 'BotCommandScopeDefault'
    /** Scope type, must be default */
    type: string

    constructor(type: string) {
        this.type = type
    }
}

/** Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering all private chats. */
export class BotCommandScopeAllPrivateChats implements Type {
    /** Name of this interface as a string */
    objectName = 'BotCommandScopeAllPrivateChats'
    /** Scope type, must be all_private_chats */
    type: string

    constructor(type: string) {
        this.type = type
    }
}

/** Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering all group and supergroup chats. */
export class BotCommandScopeAllGroupChats implements Type {
    /** Name of this interface as a string */
    objectName = 'BotCommandScopeAllGroupChats'
    /** Scope type, must be all_group_chats */
    type: string

    constructor(type: string) {
        this.type = type
    }
}

/** Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering all group and supergroup chat administrators. */
export class BotCommandScopeAllChatAdministrators implements Type {
    /** Name of this interface as a string */
    objectName = 'BotCommandScopeAllChatAdministrators'
    /** Scope type, must be all_chat_administrators */
    type: string

    constructor(type: string) {
        this.type = type
    }
}

/** Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering a specific chat. */
export class BotCommandScopeChat implements Type {
    /** Name of this interface as a string */
    objectName = 'BotCommandScopeChat'
    /** Scope type, must be chat */
    type: string
    /** Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername) */
    chat_id: number|string

    constructor(type: string, chat_id: number|string) {
        this.type = type
        this.chat_id = chat_id
    }
}

/** Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering all administrators of a specific group or supergroup chat. */
export class BotCommandScopeChatAdministrators implements Type {
    /** Name of this interface as a string */
    objectName = 'BotCommandScopeChatAdministrators'
    /** Scope type, must be chat_administrators */
    type: string
    /** Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername) */
    chat_id: number|string

    constructor(type: string, chat_id: number|string) {
        this.type = type
        this.chat_id = chat_id
    }
}

/** Represents the [scope](https://core.telegram.org/bots/api#botcommandscope) of bot commands, covering a specific member of a group or supergroup chat. */
export class BotCommandScopeChatMember implements Type {
    /** Name of this interface as a string */
    objectName = 'BotCommandScopeChatMember'
    /** Scope type, must be chat_member */
    type: string
    /** Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername) */
    chat_id: number|string
    /** Unique identifier of the target user */
    user_id: number

    constructor(type: string, chat_id: number|string, user_id: number) {
        this.type = type
        this.chat_id = chat_id
        this.user_id = user_id
    }
}

/** Contains information about why a request was unsuccessful. */
export class ResponseParameters implements Type {
    /** Name of this interface as a string */
    objectName = 'ResponseParameters'
    /** The group has been migrated to a supergroup with the specified identifier. This number may have more than 32 significant bits and some programming languages may have difficulty/silent defects in interpreting it. But it has at most 52 significant bits, so a signed 64-bit integer or double-precision float type are safe for storing this identifier. */
    migrate_to_chat_id?: number
    /** In case of exceeding flood control, the number of seconds left to wait before the request can be repeated */
    retry_after?: number

    constructor(migrate_to_chat_id?: number, retry_after?: number) {
        this.migrate_to_chat_id = migrate_to_chat_id
        this.retry_after = retry_after
    }
}

/** This object represents the content of a media message to be sent. It should be one of */
export type InputMedia = InputMediaAnimation | InputMediaDocument | InputMediaAudio | InputMediaPhoto | InputMediaVideo

/** Represents a photo to be sent. */
export class InputMediaPhoto implements Type {
    /** Name of this interface as a string */
    objectName = 'InputMediaPhoto'
    /** Type of the result, must be photo */
    type: string
    /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. [More info on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    media: string
    /** Caption of the photo to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>

    constructor(type: string, media: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>) {
        this.type = type
        this.media = media
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
    }
}

/** Represents a video to be sent. */
export class InputMediaVideo implements Type {
    /** Name of this interface as a string */
    objectName = 'InputMediaVideo'
    /** Type of the result, must be video */
    type: string
    /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. [More info on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    media: string
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. [More info on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    thumb?: InputFile|string
    /** Caption of the video to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Video width */
    width?: number
    /** Video height */
    height?: number
    /** Video duration in seconds */
    duration?: number
    /** Pass True, if the uploaded video is suitable for streaming */
    supports_streaming?: boolean

    constructor(type: string, media: string, thumb?: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, width?: number, height?: number, duration?: number, supports_streaming?: boolean) {
        this.type = type
        this.media = media
        this.thumb = thumb
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.width = width
        this.height = height
        this.duration = duration
        this.supports_streaming = supports_streaming
    }
}

/** Represents an animation file (GIF or H.264/MPEG-4 AVC video without sound) to be sent. */
export class InputMediaAnimation implements Type {
    /** Name of this interface as a string */
    objectName = 'InputMediaAnimation'
    /** Type of the result, must be animation */
    type: string
    /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. [More info on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    media: string
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. [More info on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    thumb?: InputFile|string
    /** Caption of the animation to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the animation caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Animation width */
    width?: number
    /** Animation height */
    height?: number
    /** Animation duration in seconds */
    duration?: number

    constructor(type: string, media: string, thumb?: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, width?: number, height?: number, duration?: number) {
        this.type = type
        this.media = media
        this.thumb = thumb
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.width = width
        this.height = height
        this.duration = duration
    }
}

/** Represents an audio file to be treated as music to be sent. */
export class InputMediaAudio implements Type {
    /** Name of this interface as a string */
    objectName = 'InputMediaAudio'
    /** Type of the result, must be audio */
    type: string
    /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. [More info on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    media: string
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. [More info on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    thumb?: InputFile|string
    /** Caption of the audio to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Duration of the audio in seconds */
    duration?: number
    /** Performer of the audio */
    performer?: string
    /** Title of the audio */
    title?: string

    constructor(type: string, media: string, thumb?: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, duration?: number, performer?: string, title?: string) {
        this.type = type
        this.media = media
        this.thumb = thumb
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.duration = duration
        this.performer = performer
        this.title = title
    }
}

/** Represents a general file to be sent. */
export class InputMediaDocument implements Type {
    /** Name of this interface as a string */
    objectName = 'InputMediaDocument'
    /** Type of the result, must be document */
    type: string
    /** File to send. Pass a file_id to send a file that exists on the Telegram servers (recommended), pass an HTTP URL for Telegram to get a file from the Internet, or pass “attach://&lt;file_attach_name&gt;” to upload a new one using multipart/form-data under &lt;file_attach_name&gt; name. [More info on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    media: string
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail&#39;s width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can&#39;t be reused and can be only uploaded as a new file, so you can pass “attach://&lt;file_attach_name&gt;” if the thumbnail was uploaded using multipart/form-data under &lt;file_attach_name&gt;. [More info on Sending Files »](https://core.telegram.org/bots/api#sending-files) */
    thumb?: InputFile|string
    /** Caption of the document to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Disables automatic server-side content type detection for files uploaded using multipart/form-data. Always True, if the document is sent as part of an album. */
    disable_content_type_detection?: boolean

    constructor(type: string, media: string, thumb?: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, disable_content_type_detection?: boolean) {
        this.type = type
        this.media = media
        this.thumb = thumb
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.disable_content_type_detection = disable_content_type_detection
    }
}

/** This object represents a file. Can be file_id, URL or multipart/form-data post of the file. More info on https://core.telegram.org/bots/api#inputfile */
export type InputFile = string

/** A simple method for testing your bot&#39;s authentication token. Requires no parameters. Returns basic information about the bot in form of a [User](https://core.telegram.org/bots/api#user) object. */
export class getMe implements Method {
    /** Name of this interface as a string */
    objectName = 'getMe'
}

/** Use this method to log out from the cloud Bot API server before launching the bot locally. You must log out the bot before running it locally, otherwise there is no guarantee that the bot will receive updates. After a successful call, you can immediately log in on a local server, but will not be able to log in back to the cloud Bot API server for 10 minutes. Returns True on success. Requires no parameters. */
export class logOut implements Method {
    /** Name of this interface as a string */
    objectName = 'logOut'
}

/** Use this method to close the bot instance before moving it from one local server to another. You need to delete the webhook before calling this method to ensure that the bot isn&#39;t launched again after server restart. The method will return error 429 in the first 10 minutes after the bot is launched. Returns True on success. Requires no parameters. */
export class close implements Method {
    /** Name of this interface as a string */
    objectName = 'close'
}

/** Use this method to send text messages. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendMessage implements Method {
    /** Name of this interface as a string */
    objectName = 'sendMessage'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Text of the message to be sent, 1-4096 characters after entities parsing */
    text: string
    /** Mode for parsing entities in the message text. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode */
    entities?: Array<MessageEntity>
    /** Disables link previews for links in this message */
    disable_web_page_preview?: boolean
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, text: string, parse_mode?: string, entities?: Array<MessageEntity>, disable_web_page_preview?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.text = text
        this.parse_mode = parse_mode
        this.entities = entities
        this.disable_web_page_preview = disable_web_page_preview
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to forward messages of any kind. Service messages can&#39;t be forwarded. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class forwardMessage implements Method {
    /** Name of this interface as a string */
    objectName = 'forwardMessage'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername) */
    from_chat_id: number|string
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** Message identifier in the chat specified in from_chat_id */
    message_id: number

    constructor(chat_id: number|string, from_chat_id: number|string, message_id: number, disable_notification?: boolean) {
        this.chat_id = chat_id
        this.from_chat_id = from_chat_id
        this.message_id = message_id
        this.disable_notification = disable_notification
    }
}

/** Use this method to copy messages of any kind. Service messages and invoice messages can&#39;t be copied. The method is analogous to the method [forwardMessage](https://core.telegram.org/bots/api#forwardmessage), but the copied message doesn&#39;t have a link to the original message. Returns the [MessageId](https://core.telegram.org/bots/api#messageid) of the sent message on success. */
export class copyMessage implements Method {
    /** Name of this interface as a string */
    objectName = 'copyMessage'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Unique identifier for the chat where the original message was sent (or channel username in the format @channelusername) */
    from_chat_id: number|string
    /** Message identifier in the chat specified in from_chat_id */
    message_id: number
    /** New caption for media, 0-1024 characters after entities parsing. If not specified, the original caption is kept */
    caption?: string
    /** Mode for parsing entities in the new caption. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in the new caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, from_chat_id: number|string, message_id: number, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.from_chat_id = from_chat_id
        this.message_id = message_id
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send photos. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendPhoto implements Method {
    /** Name of this interface as a string */
    objectName = 'sendPhoto'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Photo to send. Pass a file_id as String to send a photo that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a photo from the Internet, or upload a new photo using multipart/form-data. The photo must be at most 10 MB in size. The photo's width and height must not exceed 10000 in total. Width and height ratio must be at most 20. More info on Sending Files » */
    photo: InputFile|string
    /** Photo caption (may also be used when resending photos by file_id), 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the photo caption. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, photo: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.photo = photo
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send audio files, if you want Telegram clients to display them in the music player. Your audio must be in the .MP3 or .M4A format. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send audio files of up to 50 MB in size, this limit may be changed in the future. For sending voice messages, use the [sendVoice](https://core.telegram.org/bots/api#sendvoice) method instead. */
export class sendAudio implements Method {
    /** Name of this interface as a string */
    objectName = 'sendAudio'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Audio file to send. Pass a file_id as String to send an audio file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an audio file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files » */
    audio: InputFile|string
    /** Audio caption, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the audio caption. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Duration of the audio in seconds */
    duration?: number
    /** Performer */
    performer?: string
    /** Track name */
    title?: string
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More info on Sending Files » */
    thumb?: InputFile|string
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, audio: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, duration?: number, performer?: string, title?: string, thumb?: InputFile|string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.audio = audio
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.duration = duration
        this.performer = performer
        this.title = title
        this.thumb = thumb
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send general files. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send files of any type of up to 50 MB in size, this limit may be changed in the future. */
export class sendDocument implements Method {
    /** Name of this interface as a string */
    objectName = 'sendDocument'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** File to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files » */
    document: InputFile|string
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More info on Sending Files » */
    thumb?: InputFile|string
    /** Document caption (may also be used when resending documents by file_id), 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the document caption. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Disables automatic server-side content type detection for files uploaded using multipart/form-data */
    disable_content_type_detection?: boolean
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, document: InputFile|string, thumb?: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, disable_content_type_detection?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.document = document
        this.thumb = thumb
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.disable_content_type_detection = disable_content_type_detection
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send video files, Telegram clients support mp4 videos (other formats may be sent as [Document](https://core.telegram.org/bots/api#document)). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send video files of up to 50 MB in size, this limit may be changed in the future. */
export class sendVideo implements Method {
    /** Name of this interface as a string */
    objectName = 'sendVideo'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Video to send. Pass a file_id as String to send a video that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a video from the Internet, or upload a new video using multipart/form-data. More info on Sending Files » */
    video: InputFile|string
    /** Duration of sent video in seconds */
    duration?: number
    /** Video width */
    width?: number
    /** Video height */
    height?: number
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More info on Sending Files » */
    thumb?: InputFile|string
    /** Video caption (may also be used when resending videos by file_id), 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the video caption. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Pass True, if the uploaded video is suitable for streaming */
    supports_streaming?: boolean
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, video: InputFile|string, duration?: number, width?: number, height?: number, thumb?: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, supports_streaming?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.video = video
        this.duration = duration
        this.width = width
        this.height = height
        this.thumb = thumb
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.supports_streaming = supports_streaming
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send animation files (GIF or H.264/MPEG-4 AVC video without sound). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send animation files of up to 50 MB in size, this limit may be changed in the future. */
export class sendAnimation implements Method {
    /** Name of this interface as a string */
    objectName = 'sendAnimation'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Animation to send. Pass a file_id as String to send an animation that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get an animation from the Internet, or upload a new animation using multipart/form-data. More info on Sending Files » */
    animation: InputFile|string
    /** Duration of sent animation in seconds */
    duration?: number
    /** Animation width */
    width?: number
    /** Animation height */
    height?: number
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More info on Sending Files » */
    thumb?: InputFile|string
    /** Animation caption (may also be used when resending animation by file_id), 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the animation caption. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, animation: InputFile|string, duration?: number, width?: number, height?: number, thumb?: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.animation = animation
        this.duration = duration
        this.width = width
        this.height = height
        this.thumb = thumb
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send audio files, if you want Telegram clients to display the file as a playable voice message. For this to work, your audio must be in an .OGG file encoded with OPUS (other formats may be sent as [Audio](https://core.telegram.org/bots/api#audio) or [Document](https://core.telegram.org/bots/api#document)). On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. Bots can currently send voice messages of up to 50 MB in size, this limit may be changed in the future. */
export class sendVoice implements Method {
    /** Name of this interface as a string */
    objectName = 'sendVoice'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Audio file to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files » */
    voice: InputFile|string
    /** Voice message caption, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the voice message caption. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Duration of the voice message in seconds */
    duration?: number
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, voice: InputFile|string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, duration?: number, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.voice = voice
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.duration = duration
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** As of [v.4.0](https://telegram.org/blog/video-messages-and-telescope), Telegram clients support rounded square mp4 videos of up to 1 minute long. Use this method to send video messages. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendVideoNote implements Method {
    /** Name of this interface as a string */
    objectName = 'sendVideoNote'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Video note to send. Pass a file_id as String to send a video note that exists on the Telegram servers (recommended) or upload a new video using multipart/form-data. More info on Sending Files ». Sending video notes by a URL is currently unsupported */
    video_note: InputFile|string
    /** Duration of sent video in seconds */
    duration?: number
    /** Video width and height, i.e. diameter of the video message */
    length?: number
    /** Thumbnail of the file sent; can be ignored if thumbnail generation for the file is supported server-side. The thumbnail should be in JPEG format and less than 200 kB in size. A thumbnail's width and height should not exceed 320. Ignored if the file is not uploaded using multipart/form-data. Thumbnails can't be reused and can be only uploaded as a new file, so you can pass “attach://<file_attach_name>” if the thumbnail was uploaded using multipart/form-data under <file_attach_name>. More info on Sending Files » */
    thumb?: InputFile|string
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, video_note: InputFile|string, duration?: number, length?: number, thumb?: InputFile|string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.video_note = video_note
        this.duration = duration
        this.length = length
        this.thumb = thumb
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send a group of photos, videos, documents or audios as an album. Documents and audio files can be only grouped in an album with messages of the same type. On success, an array of [Messages](https://core.telegram.org/bots/api#message) that were sent is returned. */
export class sendMediaGroup implements Method {
    /** Name of this interface as a string */
    objectName = 'sendMediaGroup'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** A JSON-serialized array describing messages to be sent, must include 2-10 items */
    media: Array<InputMediaAudio|InputMediaDocument|InputMediaPhoto|InputMediaVideo>
    /** Sends messages silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the messages are a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean

    constructor(chat_id: number|string, media: Array<InputMediaAudio|InputMediaDocument|InputMediaPhoto|InputMediaVideo>, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean) {
        this.chat_id = chat_id
        this.media = media
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
    }
}

/** Use this method to send point on the map. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendLocation implements Method {
    /** Name of this interface as a string */
    objectName = 'sendLocation'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Latitude of the location */
    latitude: number
    /** Longitude of the location */
    longitude: number
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number
    /** Period in seconds for which the location will be updated (see Live Locations, should be between 60 and 86400. */
    live_period?: number
    /** For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
    heading?: number
    /** For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
    proximity_alert_radius?: number
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, latitude: number, longitude: number, horizontal_accuracy?: number, live_period?: number, heading?: number, proximity_alert_radius?: number, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.latitude = latitude
        this.longitude = longitude
        this.horizontal_accuracy = horizontal_accuracy
        this.live_period = live_period
        this.heading = heading
        this.proximity_alert_radius = proximity_alert_radius
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to edit live location messages. A location can be edited until its live_period expires or editing is explicitly disabled by a call to [stopMessageLiveLocation](https://core.telegram.org/bots/api#stopmessagelivelocation). On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
export class editMessageLiveLocation implements Method {
    /** Name of this interface as a string */
    objectName = 'editMessageLiveLocation'
    /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id?: number|string
    /** Required if inline_message_id is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if chat_id and message_id are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** Latitude of new location */
    latitude: number
    /** Longitude of new location */
    longitude: number
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number
    /** Direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
    heading?: number
    /** Maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
    proximity_alert_radius?: number
    /** A JSON-serialized object for a new inline keyboard. */
    reply_markup?: InlineKeyboardMarkup

    constructor(latitude: number, longitude: number, chat_id?: number|string, message_id?: number, inline_message_id?: string, horizontal_accuracy?: number, heading?: number, proximity_alert_radius?: number, reply_markup?: InlineKeyboardMarkup) {
        this.latitude = latitude
        this.longitude = longitude
        this.chat_id = chat_id
        this.message_id = message_id
        this.inline_message_id = inline_message_id
        this.horizontal_accuracy = horizontal_accuracy
        this.heading = heading
        this.proximity_alert_radius = proximity_alert_radius
        this.reply_markup = reply_markup
    }
}

/** Use this method to stop updating a live location message before live_period expires. On success, if the message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
export class stopMessageLiveLocation implements Method {
    /** Name of this interface as a string */
    objectName = 'stopMessageLiveLocation'
    /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id?: number|string
    /** Required if inline_message_id is not specified. Identifier of the message with live location to stop */
    message_id?: number
    /** Required if chat_id and message_id are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** A JSON-serialized object for a new inline keyboard. */
    reply_markup?: InlineKeyboardMarkup

    constructor(chat_id?: number|string, message_id?: number, inline_message_id?: string, reply_markup?: InlineKeyboardMarkup) {
        this.chat_id = chat_id
        this.message_id = message_id
        this.inline_message_id = inline_message_id
        this.reply_markup = reply_markup
    }
}

/** Use this method to send information about a venue. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendVenue implements Method {
    /** Name of this interface as a string */
    objectName = 'sendVenue'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Latitude of the venue */
    latitude: number
    /** Longitude of the venue */
    longitude: number
    /** Name of the venue */
    title: string
    /** Address of the venue */
    address: string
    /** Foursquare identifier of the venue */
    foursquare_id?: string
    /** Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) */
    foursquare_type?: string
    /** Google Places identifier of the venue */
    google_place_id?: string
    /** Google Places type of the venue. (See supported types.) */
    google_place_type?: string
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, latitude: number, longitude: number, title: string, address: string, foursquare_id?: string, foursquare_type?: string, google_place_id?: string, google_place_type?: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.latitude = latitude
        this.longitude = longitude
        this.title = title
        this.address = address
        this.foursquare_id = foursquare_id
        this.foursquare_type = foursquare_type
        this.google_place_id = google_place_id
        this.google_place_type = google_place_type
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send phone contacts. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendContact implements Method {
    /** Name of this interface as a string */
    objectName = 'sendContact'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Contact's phone number */
    phone_number: string
    /** Contact's first name */
    first_name: string
    /** Contact's last name */
    last_name?: string
    /** Additional data about the contact in the form of a vCard, 0-2048 bytes */
    vcard?: string
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, phone_number: string, first_name: string, last_name?: string, vcard?: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.phone_number = phone_number
        this.first_name = first_name
        this.last_name = last_name
        this.vcard = vcard
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send a native poll. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendPoll implements Method {
    /** Name of this interface as a string */
    objectName = 'sendPoll'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Poll question, 1-300 characters */
    question: string
    /** A JSON-serialized list of answer options, 2-10 strings 1-100 characters each */
    options: Array<string>
    /** True, if the poll needs to be anonymous, defaults to True */
    is_anonymous?: boolean
    /** Poll type, “quiz” or “regular”, defaults to “regular” */
    type?: string
    /** True, if the poll allows multiple answers, ignored for polls in quiz mode, defaults to False */
    allows_multiple_answers?: boolean
    /** 0-based identifier of the correct answer option, required for polls in quiz mode */
    correct_option_id?: number
    /** Text that is shown when a user chooses an incorrect answer or taps on the lamp icon in a quiz-style poll, 0-200 characters with at most 2 line feeds after entities parsing */
    explanation?: string
    /** Mode for parsing entities in the explanation. See formatting options for more details. */
    explanation_parse_mode?: string
    /** A JSON-serialized list of special entities that appear in the poll explanation, which can be specified instead of parse_mode */
    explanation_entities?: Array<MessageEntity>
    /** Amount of time in seconds the poll will be active after creation, 5-600. Can't be used together with close_date. */
    open_period?: number
    /** Point in time (Unix timestamp) when the poll will be automatically closed. Must be at least 5 and no more than 600 seconds in the future. Can't be used together with open_period. */
    close_date?: number
    /** Pass True, if the poll needs to be immediately closed. This can be useful for poll preview. */
    is_closed?: boolean
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, question: string, options: Array<string>, is_anonymous?: boolean, type?: string, allows_multiple_answers?: boolean, correct_option_id?: number, explanation?: string, explanation_parse_mode?: string, explanation_entities?: Array<MessageEntity>, open_period?: number, close_date?: number, is_closed?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.question = question
        this.options = options
        this.is_anonymous = is_anonymous
        this.type = type
        this.allows_multiple_answers = allows_multiple_answers
        this.correct_option_id = correct_option_id
        this.explanation = explanation
        this.explanation_parse_mode = explanation_parse_mode
        this.explanation_entities = explanation_entities
        this.open_period = open_period
        this.close_date = close_date
        this.is_closed = is_closed
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to send an animated emoji that will display a random value. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendDice implements Method {
    /** Name of this interface as a string */
    objectName = 'sendDice'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Emoji on which the dice throw animation is based. Currently, must be one of “”, “”, “”, “”, “”, or “”. Dice can have values 1-6 for “”, “” and “”, values 1-5 for “” and “”, and values 1-64 for “”. Defaults to “” */
    emoji?: string
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, emoji?: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.emoji = emoji
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method when you need to tell the user that something is happening on the bot&#39;s side. The status is set for 5 seconds or less (when a message arrives from your bot, Telegram clients clear its typing status). Returns True on success. We only recommend using this method when a response from the bot will take a noticeable amount of time to arrive. */
export class sendChatAction implements Method {
    /** Name of this interface as a string */
    objectName = 'sendChatAction'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Type of action to broadcast. Choose one, depending on what the user is about to receive: typing for text messages, upload_photo for photos, record_video or upload_video for videos, record_voice or upload_voice for voice notes, upload_document for general files, choose_sticker for stickers, find_location for location data, record_video_note or upload_video_note for video notes. */
    action: string

    constructor(chat_id: number|string, action: string) {
        this.chat_id = chat_id
        this.action = action
    }
}

/** Use this method to get a list of profile pictures for a user. Returns a [UserProfilePhotos](https://core.telegram.org/bots/api#userprofilephotos) object. */
export class getUserProfilePhotos implements Method {
    /** Name of this interface as a string */
    objectName = 'getUserProfilePhotos'
    /** Unique identifier of the target user */
    user_id: number
    /** Sequential number of the first photo to be returned. By default, all photos are returned. */
    offset?: number
    /** Limits the number of photos to be retrieved. Values between 1-100 are accepted. Defaults to 100. */
    limit?: number

    constructor(user_id: number, offset?: number, limit?: number) {
        this.user_id = user_id
        this.offset = offset
        this.limit = limit
    }
}

/** Use this method to get basic info about a file and prepare it for downloading. For the moment, bots can download files of up to 20MB in size. On success, a [File](https://core.telegram.org/bots/api#file) object is returned. The file can then be downloaded via the link https://api.telegram.org/file/bot&lt;token&gt;/&lt;file_path&gt;, where &lt;file_path&gt; is taken from the response. It is guaranteed that the link will be valid for at least 1 hour. When the link expires, a new one can be requested by calling [getFile](https://core.telegram.org/bots/api#getfile) again. */
export class getFile implements Method {
    /** Name of this interface as a string */
    objectName = 'getFile'
    /** File identifier to get info about */
    file_id: string

    constructor(file_id: string) {
        this.file_id = file_id
    }
}

/** Use this method to ban a user in a group, a supergroup or a channel. In the case of supergroups and channels, the user will not be able to return to the chat on their own using invite links, etc., unless [unbanned](https://core.telegram.org/bots/api#unbanchatmember) first. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
export class banChatMember implements Method {
    /** Name of this interface as a string */
    objectName = 'banChatMember'
    /** Unique identifier for the target group or username of the target supergroup or channel (in the format @channelusername) */
    chat_id: number|string
    /** Unique identifier of the target user */
    user_id: number
    /** Date when the user will be unbanned, unix time. If user is banned for more than 366 days or less than 30 seconds from the current time they are considered to be banned forever. Applied for supergroups and channels only. */
    until_date?: number
    /** Pass True to delete all messages from the chat for the user that is being removed. If False, the user will be able to see messages in the group that were sent before the user was removed. Always True for supergroups and channels. */
    revoke_messages?: boolean

    constructor(chat_id: number|string, user_id: number, until_date?: number, revoke_messages?: boolean) {
        this.chat_id = chat_id
        this.user_id = user_id
        this.until_date = until_date
        this.revoke_messages = revoke_messages
    }
}

/** Use this method to unban a previously banned user in a supergroup or channel. The user will not return to the group or channel automatically, but will be able to join via link, etc. The bot must be an administrator for this to work. By default, this method guarantees that after the call the user is not a member of the chat, but will be able to join it. So if the user is a member of the chat they will also be removed from the chat. If you don&#39;t want this, use the parameter only_if_banned. Returns True on success. */
export class unbanChatMember implements Method {
    /** Name of this interface as a string */
    objectName = 'unbanChatMember'
    /** Unique identifier for the target group or username of the target supergroup or channel (in the format @username) */
    chat_id: number|string
    /** Unique identifier of the target user */
    user_id: number
    /** Do nothing if the user is not banned */
    only_if_banned?: boolean

    constructor(chat_id: number|string, user_id: number, only_if_banned?: boolean) {
        this.chat_id = chat_id
        this.user_id = user_id
        this.only_if_banned = only_if_banned
    }
}

/** Use this method to restrict a user in a supergroup. The bot must be an administrator in the supergroup for this to work and must have the appropriate administrator rights. Pass True for all permissions to lift restrictions from a user. Returns True on success. */
export class restrictChatMember implements Method {
    /** Name of this interface as a string */
    objectName = 'restrictChatMember'
    /** Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername) */
    chat_id: number|string
    /** Unique identifier of the target user */
    user_id: number
    /** A JSON-serialized object for new user permissions */
    permissions: ChatPermissions
    /** Date when restrictions will be lifted for the user, unix time. If user is restricted for more than 366 days or less than 30 seconds from the current time, they are considered to be restricted forever */
    until_date?: number

    constructor(chat_id: number|string, user_id: number, permissions: ChatPermissions, until_date?: number) {
        this.chat_id = chat_id
        this.user_id = user_id
        this.permissions = permissions
        this.until_date = until_date
    }
}

/** Use this method to promote or demote a user in a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Pass False for all boolean parameters to demote a user. Returns True on success. */
export class promoteChatMember implements Method {
    /** Name of this interface as a string */
    objectName = 'promoteChatMember'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Unique identifier of the target user */
    user_id: number
    /** Pass True, if the administrator's presence in the chat is hidden */
    is_anonymous?: boolean
    /** Pass True, if the administrator can access the chat event log, chat statistics, message statistics in channels, see channel members, see anonymous administrators in supergroups and ignore slow mode. Implied by any other administrator privilege */
    can_manage_chat?: boolean
    /** Pass True, if the administrator can create channel posts, channels only */
    can_post_messages?: boolean
    /** Pass True, if the administrator can edit messages of other users and can pin messages, channels only */
    can_edit_messages?: boolean
    /** Pass True, if the administrator can delete messages of other users */
    can_delete_messages?: boolean
    /** Pass True, if the administrator can manage voice chats */
    can_manage_voice_chats?: boolean
    /** Pass True, if the administrator can restrict, ban or unban chat members */
    can_restrict_members?: boolean
    /** Pass True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by him) */
    can_promote_members?: boolean
    /** Pass True, if the administrator can change chat title, photo and other settings */
    can_change_info?: boolean
    /** Pass True, if the administrator can invite new users to the chat */
    can_invite_users?: boolean
    /** Pass True, if the administrator can pin messages, supergroups only */
    can_pin_messages?: boolean

    constructor(chat_id: number|string, user_id: number, is_anonymous?: boolean, can_manage_chat?: boolean, can_post_messages?: boolean, can_edit_messages?: boolean, can_delete_messages?: boolean, can_manage_voice_chats?: boolean, can_restrict_members?: boolean, can_promote_members?: boolean, can_change_info?: boolean, can_invite_users?: boolean, can_pin_messages?: boolean) {
        this.chat_id = chat_id
        this.user_id = user_id
        this.is_anonymous = is_anonymous
        this.can_manage_chat = can_manage_chat
        this.can_post_messages = can_post_messages
        this.can_edit_messages = can_edit_messages
        this.can_delete_messages = can_delete_messages
        this.can_manage_voice_chats = can_manage_voice_chats
        this.can_restrict_members = can_restrict_members
        this.can_promote_members = can_promote_members
        this.can_change_info = can_change_info
        this.can_invite_users = can_invite_users
        this.can_pin_messages = can_pin_messages
    }
}

/** Use this method to set a custom title for an administrator in a supergroup promoted by the bot. Returns True on success. */
export class setChatAdministratorCustomTitle implements Method {
    /** Name of this interface as a string */
    objectName = 'setChatAdministratorCustomTitle'
    /** Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername) */
    chat_id: number|string
    /** Unique identifier of the target user */
    user_id: number
    /** New custom title for the administrator; 0-16 characters, emoji are not allowed */
    custom_title: string

    constructor(chat_id: number|string, user_id: number, custom_title: string) {
        this.chat_id = chat_id
        this.user_id = user_id
        this.custom_title = custom_title
    }
}

/** Use this method to set default chat permissions for all members. The bot must be an administrator in the group or a supergroup for this to work and must have the can_restrict_members administrator rights. Returns True on success. */
export class setChatPermissions implements Method {
    /** Name of this interface as a string */
    objectName = 'setChatPermissions'
    /** Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername) */
    chat_id: number|string
    /** A JSON-serialized object for new default chat permissions */
    permissions: ChatPermissions

    constructor(chat_id: number|string, permissions: ChatPermissions) {
        this.chat_id = chat_id
        this.permissions = permissions
    }
}

/** Use this method to generate a new primary invite link for a chat; any previously generated primary link is revoked. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the new invite link as String on success. */
export class exportChatInviteLink implements Method {
    /** Name of this interface as a string */
    objectName = 'exportChatInviteLink'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string

    constructor(chat_id: number|string) {
        this.chat_id = chat_id
    }
}

/** Use this method to create an additional invite link for a chat. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. The link can be revoked using the method [revokeChatInviteLink](https://core.telegram.org/bots/api#revokechatinvitelink). Returns the new invite link as [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object. */
export class createChatInviteLink implements Method {
    /** Name of this interface as a string */
    objectName = 'createChatInviteLink'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Invite link name; 0-32 characters */
    name?: string
    /** Point in time (Unix timestamp) when the link will expire */
    expire_date?: number
    /** Maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 */
    member_limit?: number
    /** True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified */
    creates_join_request?: boolean

    constructor(chat_id: number|string, name?: string, expire_date?: number, member_limit?: number, creates_join_request?: boolean) {
        this.chat_id = chat_id
        this.name = name
        this.expire_date = expire_date
        this.member_limit = member_limit
        this.creates_join_request = creates_join_request
    }
}

/** Use this method to edit a non-primary invite link created by the bot. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the edited invite link as a [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object. */
export class editChatInviteLink implements Method {
    /** Name of this interface as a string */
    objectName = 'editChatInviteLink'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** The invite link to edit */
    invite_link: string
    /** Invite link name; 0-32 characters */
    name?: string
    /** Point in time (Unix timestamp) when the link will expire */
    expire_date?: number
    /** Maximum number of users that can be members of the chat simultaneously after joining the chat via this invite link; 1-99999 */
    member_limit?: number
    /** True, if users joining the chat via the link need to be approved by chat administrators. If True, member_limit can't be specified */
    creates_join_request?: boolean

    constructor(chat_id: number|string, invite_link: string, name?: string, expire_date?: number, member_limit?: number, creates_join_request?: boolean) {
        this.chat_id = chat_id
        this.invite_link = invite_link
        this.name = name
        this.expire_date = expire_date
        this.member_limit = member_limit
        this.creates_join_request = creates_join_request
    }
}

/** Use this method to revoke an invite link created by the bot. If the primary link is revoked, a new link is automatically generated. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns the revoked invite link as [ChatInviteLink](https://core.telegram.org/bots/api#chatinvitelink) object. */
export class revokeChatInviteLink implements Method {
    /** Name of this interface as a string */
    objectName = 'revokeChatInviteLink'
    /** Unique identifier of the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** The invite link to revoke */
    invite_link: string

    constructor(chat_id: number|string, invite_link: string) {
        this.chat_id = chat_id
        this.invite_link = invite_link
    }
}

/** Use this method to approve a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success. */
export class approveChatJoinRequest implements Method {
    /** Name of this interface as a string */
    objectName = 'approveChatJoinRequest'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Unique identifier of the target user */
    user_id: number

    constructor(chat_id: number|string, user_id: number) {
        this.chat_id = chat_id
        this.user_id = user_id
    }
}

/** Use this method to decline a chat join request. The bot must be an administrator in the chat for this to work and must have the can_invite_users administrator right. Returns True on success. */
export class declineChatJoinRequest implements Method {
    /** Name of this interface as a string */
    objectName = 'declineChatJoinRequest'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Unique identifier of the target user */
    user_id: number

    constructor(chat_id: number|string, user_id: number) {
        this.chat_id = chat_id
        this.user_id = user_id
    }
}

/** Use this method to set a new profile photo for the chat. Photos can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
export class setChatPhoto implements Method {
    /** Name of this interface as a string */
    objectName = 'setChatPhoto'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** New chat photo, uploaded using multipart/form-data */
    photo: InputFile

    constructor(chat_id: number|string, photo: InputFile) {
        this.chat_id = chat_id
        this.photo = photo
    }
}

/** Use this method to delete a chat photo. Photos can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
export class deleteChatPhoto implements Method {
    /** Name of this interface as a string */
    objectName = 'deleteChatPhoto'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string

    constructor(chat_id: number|string) {
        this.chat_id = chat_id
    }
}

/** Use this method to change the title of a chat. Titles can&#39;t be changed for private chats. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
export class setChatTitle implements Method {
    /** Name of this interface as a string */
    objectName = 'setChatTitle'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** New chat title, 1-255 characters */
    title: string

    constructor(chat_id: number|string, title: string) {
        this.chat_id = chat_id
        this.title = title
    }
}

/** Use this method to change the description of a group, a supergroup or a channel. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Returns True on success. */
export class setChatDescription implements Method {
    /** Name of this interface as a string */
    objectName = 'setChatDescription'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** New chat description, 0-255 characters */
    description?: string

    constructor(chat_id: number|string, description?: string) {
        this.chat_id = chat_id
        this.description = description
    }
}

/** Use this method to add a message to the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the &#39;can_pin_messages&#39; administrator right in a supergroup or &#39;can_edit_messages&#39; administrator right in a channel. Returns True on success. */
export class pinChatMessage implements Method {
    /** Name of this interface as a string */
    objectName = 'pinChatMessage'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Identifier of a message to pin */
    message_id: number
    /** Pass True, if it is not necessary to send a notification to all chat members about the new pinned message. Notifications are always disabled in channels and private chats. */
    disable_notification?: boolean

    constructor(chat_id: number|string, message_id: number, disable_notification?: boolean) {
        this.chat_id = chat_id
        this.message_id = message_id
        this.disable_notification = disable_notification
    }
}

/** Use this method to remove a message from the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the &#39;can_pin_messages&#39; administrator right in a supergroup or &#39;can_edit_messages&#39; administrator right in a channel. Returns True on success. */
export class unpinChatMessage implements Method {
    /** Name of this interface as a string */
    objectName = 'unpinChatMessage'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Identifier of a message to unpin. If not specified, the most recent pinned message (by sending date) will be unpinned. */
    message_id?: number

    constructor(chat_id: number|string, message_id?: number) {
        this.chat_id = chat_id
        this.message_id = message_id
    }
}

/** Use this method to clear the list of pinned messages in a chat. If the chat is not a private chat, the bot must be an administrator in the chat for this to work and must have the &#39;can_pin_messages&#39; administrator right in a supergroup or &#39;can_edit_messages&#39; administrator right in a channel. Returns True on success. */
export class unpinAllChatMessages implements Method {
    /** Name of this interface as a string */
    objectName = 'unpinAllChatMessages'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string

    constructor(chat_id: number|string) {
        this.chat_id = chat_id
    }
}

/** Use this method for your bot to leave a group, supergroup or channel. Returns True on success. */
export class leaveChat implements Method {
    /** Name of this interface as a string */
    objectName = 'leaveChat'
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername) */
    chat_id: number|string

    constructor(chat_id: number|string) {
        this.chat_id = chat_id
    }
}

/** Use this method to get up to date information about the chat (current name of the user for one-on-one conversations, current username of a user, group or channel, etc.). Returns a [Chat](https://core.telegram.org/bots/api#chat) object on success. */
export class getChat implements Method {
    /** Name of this interface as a string */
    objectName = 'getChat'
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername) */
    chat_id: number|string

    constructor(chat_id: number|string) {
        this.chat_id = chat_id
    }
}

/** Use this method to get a list of administrators in a chat. On success, returns an Array of [ChatMember](https://core.telegram.org/bots/api#chatmember) objects that contains information about all chat administrators except other bots. If the chat is a group or a supergroup and no administrators were appointed, only the creator will be returned. */
export class getChatAdministrators implements Method {
    /** Name of this interface as a string */
    objectName = 'getChatAdministrators'
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername) */
    chat_id: number|string

    constructor(chat_id: number|string) {
        this.chat_id = chat_id
    }
}

/** Use this method to get the number of members in a chat. Returns Int on success. */
export class getChatMemberCount implements Method {
    /** Name of this interface as a string */
    objectName = 'getChatMemberCount'
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername) */
    chat_id: number|string

    constructor(chat_id: number|string) {
        this.chat_id = chat_id
    }
}

/** Use this method to get information about a member of a chat. Returns a [ChatMember](https://core.telegram.org/bots/api#chatmember) object on success. */
export class getChatMember implements Method {
    /** Name of this interface as a string */
    objectName = 'getChatMember'
    /** Unique identifier for the target chat or username of the target supergroup or channel (in the format @channelusername) */
    chat_id: number|string
    /** Unique identifier of the target user */
    user_id: number

    constructor(chat_id: number|string, user_id: number) {
        this.chat_id = chat_id
        this.user_id = user_id
    }
}

/** Use this method to set a new group sticker set for a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in [getChat](https://core.telegram.org/bots/api#getchat) requests to check if the bot can use this method. Returns True on success. */
export class setChatStickerSet implements Method {
    /** Name of this interface as a string */
    objectName = 'setChatStickerSet'
    /** Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername) */
    chat_id: number|string
    /** Name of the sticker set to be set as the group sticker set */
    sticker_set_name: string

    constructor(chat_id: number|string, sticker_set_name: string) {
        this.chat_id = chat_id
        this.sticker_set_name = sticker_set_name
    }
}

/** Use this method to delete a group sticker set from a supergroup. The bot must be an administrator in the chat for this to work and must have the appropriate administrator rights. Use the field can_set_sticker_set optionally returned in [getChat](https://core.telegram.org/bots/api#getchat) requests to check if the bot can use this method. Returns True on success. */
export class deleteChatStickerSet implements Method {
    /** Name of this interface as a string */
    objectName = 'deleteChatStickerSet'
    /** Unique identifier for the target chat or username of the target supergroup (in the format @supergroupusername) */
    chat_id: number|string

    constructor(chat_id: number|string) {
        this.chat_id = chat_id
    }
}

/** Use this method to send answers to callback queries sent from [inline keyboards](/bots#inline-keyboards-and-on-the-fly-updating). The answer will be displayed to the user as a notification at the top of the chat screen or as an alert. On success, True is returned. */
export class answerCallbackQuery implements Method {
    /** Name of this interface as a string */
    objectName = 'answerCallbackQuery'
    /** Unique identifier for the query to be answered */
    callback_query_id: string
    /** Text of the notification. If not specified, nothing will be shown to the user, 0-200 characters */
    text?: string
    /** If True, an alert will be shown by the client instead of a notification at the top of the chat screen. Defaults to false. */
    show_alert?: boolean
    /** URL that will be opened by the user's client. If you have created a Game and accepted the conditions via @Botfather, specify the URL that opens your game — note that this will only work if the query comes from a callback_game button.Otherwise, you may use links like t.me/your_bot?start=XXXX that open your bot with a parameter. */
    url?: string
    /** The maximum amount of time in seconds that the result of the callback query may be cached client-side. Telegram apps will support caching starting in version 3.14. Defaults to 0. */
    cache_time?: number

    constructor(callback_query_id: string, text?: string, show_alert?: boolean, url?: string, cache_time?: number) {
        this.callback_query_id = callback_query_id
        this.text = text
        this.show_alert = show_alert
        this.url = url
        this.cache_time = cache_time
    }
}

/** Use this method to change the list of the bot&#39;s commands. See [https://core.telegram.org/bots#commands](https://core.telegram.org/bots#commands) for more details about bot commands. Returns True on success. */
export class setMyCommands implements Method {
    /** Name of this interface as a string */
    objectName = 'setMyCommands'
    /** A JSON-serialized list of bot commands to be set as the list of the bot's commands. At most 100 commands can be specified. */
    commands: Array<BotCommand>
    /** A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault. */
    scope?: BotCommandScope
    /** A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands */
    language_code?: string

    constructor(commands: Array<BotCommand>, scope?: BotCommandScope, language_code?: string) {
        this.commands = commands
        this.scope = scope
        this.language_code = language_code
    }
}

/** Use this method to delete the list of the bot&#39;s commands for the given scope and user language. After deletion, [higher level commands](https://core.telegram.org/bots/api#determining-list-of-commands) will be shown to affected users. Returns True on success. */
export class deleteMyCommands implements Method {
    /** Name of this interface as a string */
    objectName = 'deleteMyCommands'
    /** A JSON-serialized object, describing scope of users for which the commands are relevant. Defaults to BotCommandScopeDefault. */
    scope?: BotCommandScope
    /** A two-letter ISO 639-1 language code. If empty, commands will be applied to all users from the given scope, for whose language there are no dedicated commands */
    language_code?: string

    constructor(scope?: BotCommandScope, language_code?: string) {
        this.scope = scope
        this.language_code = language_code
    }
}

/** Use this method to get the current list of the bot&#39;s commands for the given scope and user language. Returns Array of [BotCommand](https://core.telegram.org/bots/api#botcommand) on success. If commands aren&#39;t set, an empty list is returned. */
export class getMyCommands implements Method {
    /** Name of this interface as a string */
    objectName = 'getMyCommands'
    /** A JSON-serialized object, describing scope of users. Defaults to BotCommandScopeDefault. */
    scope?: BotCommandScope
    /** A two-letter ISO 639-1 language code or an empty string */
    language_code?: string

    constructor(scope?: BotCommandScope, language_code?: string) {
        this.scope = scope
        this.language_code = language_code
    }
}

/** Use this method to edit text and [game](https://core.telegram.org/bots/api#games) messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
export class editMessageText implements Method {
    /** Name of this interface as a string */
    objectName = 'editMessageText'
    /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id?: number|string
    /** Required if inline_message_id is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if chat_id and message_id are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** New text of the message, 1-4096 characters after entities parsing */
    text: string
    /** Mode for parsing entities in the message text. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in message text, which can be specified instead of parse_mode */
    entities?: Array<MessageEntity>
    /** Disables link previews for links in this message */
    disable_web_page_preview?: boolean
    /** A JSON-serialized object for an inline keyboard. */
    reply_markup?: InlineKeyboardMarkup

    constructor(text: string, chat_id?: number|string, message_id?: number, inline_message_id?: string, parse_mode?: string, entities?: Array<MessageEntity>, disable_web_page_preview?: boolean, reply_markup?: InlineKeyboardMarkup) {
        this.text = text
        this.chat_id = chat_id
        this.message_id = message_id
        this.inline_message_id = inline_message_id
        this.parse_mode = parse_mode
        this.entities = entities
        this.disable_web_page_preview = disable_web_page_preview
        this.reply_markup = reply_markup
    }
}

/** Use this method to edit captions of messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
export class editMessageCaption implements Method {
    /** Name of this interface as a string */
    objectName = 'editMessageCaption'
    /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id?: number|string
    /** Required if inline_message_id is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if chat_id and message_id are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** New caption of the message, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the message caption. See formatting options for more details. */
    parse_mode?: string
    /** A JSON-serialized list of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** A JSON-serialized object for an inline keyboard. */
    reply_markup?: InlineKeyboardMarkup

    constructor(chat_id?: number|string, message_id?: number, inline_message_id?: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup) {
        this.chat_id = chat_id
        this.message_id = message_id
        this.inline_message_id = inline_message_id
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
    }
}

/** Use this method to edit animation, audio, document, photo, or video messages. If a message is part of a message album, then it can be edited only to an audio for audio albums, only to a document for document albums and to a photo or a video otherwise. When an inline message is edited, a new file can&#39;t be uploaded; use a previously uploaded file via its file_id or specify a URL. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
export class editMessageMedia implements Method {
    /** Name of this interface as a string */
    objectName = 'editMessageMedia'
    /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id?: number|string
    /** Required if inline_message_id is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if chat_id and message_id are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** A JSON-serialized object for a new media content of the message */
    media: InputMedia
    /** A JSON-serialized object for a new inline keyboard. */
    reply_markup?: InlineKeyboardMarkup

    constructor(media: InputMedia, chat_id?: number|string, message_id?: number, inline_message_id?: string, reply_markup?: InlineKeyboardMarkup) {
        this.media = media
        this.chat_id = chat_id
        this.message_id = message_id
        this.inline_message_id = inline_message_id
        this.reply_markup = reply_markup
    }
}

/** Use this method to edit only the reply markup of messages. On success, if the edited message is not an inline message, the edited [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. */
export class editMessageReplyMarkup implements Method {
    /** Name of this interface as a string */
    objectName = 'editMessageReplyMarkup'
    /** Required if inline_message_id is not specified. Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id?: number|string
    /** Required if inline_message_id is not specified. Identifier of the message to edit */
    message_id?: number
    /** Required if chat_id and message_id are not specified. Identifier of the inline message */
    inline_message_id?: string
    /** A JSON-serialized object for an inline keyboard. */
    reply_markup?: InlineKeyboardMarkup

    constructor(chat_id?: number|string, message_id?: number, inline_message_id?: string, reply_markup?: InlineKeyboardMarkup) {
        this.chat_id = chat_id
        this.message_id = message_id
        this.inline_message_id = inline_message_id
        this.reply_markup = reply_markup
    }
}

/** Use this method to stop a poll which was sent by the bot. On success, the stopped [Poll](https://core.telegram.org/bots/api#poll) is returned. */
export class stopPoll implements Method {
    /** Name of this interface as a string */
    objectName = 'stopPoll'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Identifier of the original message with the poll */
    message_id: number
    /** A JSON-serialized object for a new message inline keyboard. */
    reply_markup?: InlineKeyboardMarkup

    constructor(chat_id: number|string, message_id: number, reply_markup?: InlineKeyboardMarkup) {
        this.chat_id = chat_id
        this.message_id = message_id
        this.reply_markup = reply_markup
    }
}

/** Use this method to delete a message, including service messages, with the following limitations:- A message can only be deleted if it was sent less than 48 hours ago.- A dice message in a private chat can only be deleted if it was sent more than 24 hours ago.- Bots can delete outgoing messages in private chats, groups, and supergroups.- Bots can delete incoming messages in private chats.- Bots granted can_post_messages permissions can delete outgoing messages in channels.- If the bot is an administrator of a group, it can delete any message there.- If the bot has can_delete_messages permission in a supergroup or a channel, it can delete any message there.Returns True on success. */
export class deleteMessage implements Method {
    /** Name of this interface as a string */
    objectName = 'deleteMessage'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Identifier of the message to delete */
    message_id: number

    constructor(chat_id: number|string, message_id: number) {
        this.chat_id = chat_id
        this.message_id = message_id
    }
}

/** This object represents a sticker. */
export class Sticker implements Type {
    /** Name of this interface as a string */
    objectName = 'Sticker'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** Sticker width */
    width: number
    /** Sticker height */
    height: number
    /** True, if the sticker is [animated](https://telegram.org/blog/animated-stickers) */
    is_animated: boolean
    /** Sticker thumbnail in the .WEBP or .JPG format */
    thumb?: PhotoSize
    /** Emoji associated with the sticker */
    emoji?: string
    /** Name of the sticker set to which the sticker belongs */
    set_name?: string
    /** For mask stickers, the position where the mask should be placed */
    mask_position?: MaskPosition
    /** File size in bytes */
    file_size?: number

    constructor(file_id: string, file_unique_id: string, width: number, height: number, is_animated: boolean, thumb?: PhotoSize, emoji?: string, set_name?: string, mask_position?: MaskPosition, file_size?: number) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.width = width
        this.height = height
        this.is_animated = is_animated
        this.thumb = thumb
        this.emoji = emoji
        this.set_name = set_name
        this.mask_position = mask_position
        this.file_size = file_size
    }
}

/** This object represents a sticker set. */
export class StickerSet implements Type {
    /** Name of this interface as a string */
    objectName = 'StickerSet'
    /** Sticker set name */
    name: string
    /** Sticker set title */
    title: string
    /** True, if the sticker set contains [animated stickers](https://telegram.org/blog/animated-stickers) */
    is_animated: boolean
    /** True, if the sticker set contains masks */
    contains_masks: boolean
    /** List of all set stickers */
    stickers: Array<Sticker>
    /** Sticker set thumbnail in the .WEBP or .TGS format */
    thumb?: PhotoSize

    constructor(name: string, title: string, is_animated: boolean, contains_masks: boolean, stickers: Array<Sticker>, thumb?: PhotoSize) {
        this.name = name
        this.title = title
        this.is_animated = is_animated
        this.contains_masks = contains_masks
        this.stickers = stickers
        this.thumb = thumb
    }
}

/** This object describes the position on faces where a mask should be placed by default. */
export class MaskPosition implements Type {
    /** Name of this interface as a string */
    objectName = 'MaskPosition'
    /** The part of the face relative to which the mask should be placed. One of “forehead”, “eyes”, “mouth”, or “chin”. */
    point: string
    /** Shift by X-axis measured in widths of the mask scaled to the face size, from left to right. For example, choosing -1.0 will place mask just to the left of the default mask position. */
    x_shift: number
    /** Shift by Y-axis measured in heights of the mask scaled to the face size, from top to bottom. For example, 1.0 will place the mask just below the default mask position. */
    y_shift: number
    /** Mask scaling coefficient. For example, 2.0 means double size. */
    scale: number

    constructor(point: string, x_shift: number, y_shift: number, scale: number) {
        this.point = point
        this.x_shift = x_shift
        this.y_shift = y_shift
        this.scale = scale
    }
}

/** Use this method to send static .WEBP or [animated](https://telegram.org/blog/animated-stickers) .TGS stickers. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendSticker implements Method {
    /** Name of this interface as a string */
    objectName = 'sendSticker'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Sticker to send. Pass a file_id as String to send a file that exists on the Telegram servers (recommended), pass an HTTP URL as a String for Telegram to get a .WEBP file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files » */
    sticker: InputFile|string
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** Additional interface options. A JSON-serialized object for an inline keyboard, custom reply keyboard, instructions to remove reply keyboard or to force a reply from the user. */
    reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply

    constructor(chat_id: number|string, sticker: InputFile|string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup|ReplyKeyboardMarkup|ReplyKeyboardRemove|ForceReply) {
        this.chat_id = chat_id
        this.sticker = sticker
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** Use this method to get a sticker set. On success, a [StickerSet](https://core.telegram.org/bots/api#stickerset) object is returned. */
export class getStickerSet implements Method {
    /** Name of this interface as a string */
    objectName = 'getStickerSet'
    /** Name of the sticker set */
    name: string

    constructor(name: string) {
        this.name = name
    }
}

/** Use this method to upload a .PNG file with a sticker for later use in createNewStickerSet and addStickerToSet methods (can be used multiple times). Returns the uploaded [File](https://core.telegram.org/bots/api#file) on success. */
export class uploadStickerFile implements Method {
    /** Name of this interface as a string */
    objectName = 'uploadStickerFile'
    /** User identifier of sticker file owner */
    user_id: number
    /** PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. More info on Sending Files » */
    png_sticker: InputFile

    constructor(user_id: number, png_sticker: InputFile) {
        this.user_id = user_id
        this.png_sticker = png_sticker
    }
}

/** Use this method to create a new sticker set owned by a user. The bot will be able to edit the sticker set thus created. You must use exactly one of the fields png_sticker or tgs_sticker. Returns True on success. */
export class createNewStickerSet implements Method {
    /** Name of this interface as a string */
    objectName = 'createNewStickerSet'
    /** User identifier of created sticker set owner */
    user_id: number
    /** Short name of sticker set, to be used in t.me/addstickers/ URLs (e.g., animals). Can contain only english letters, digits and underscores. Must begin with a letter, can't contain consecutive underscores and must end in “_by_<bot username>”. <bot_username> is case insensitive. 1-64 characters. */
    name: string
    /** Sticker set title, 1-64 characters */
    title: string
    /** PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files » */
    png_sticker?: InputFile|string
    /** TGS animation with the sticker, uploaded using multipart/form-data. See https://core.telegram.org/animated_stickers#technical-requirements for technical requirements */
    tgs_sticker?: InputFile
    /** One or more emoji corresponding to the sticker */
    emojis: string
    /** Pass True, if a set of mask stickers should be created */
    contains_masks?: boolean
    /** A JSON-serialized object for position where the mask should be placed on faces */
    mask_position?: MaskPosition

    constructor(user_id: number, name: string, title: string, emojis: string, png_sticker?: InputFile|string, tgs_sticker?: InputFile, contains_masks?: boolean, mask_position?: MaskPosition) {
        this.user_id = user_id
        this.name = name
        this.title = title
        this.emojis = emojis
        this.png_sticker = png_sticker
        this.tgs_sticker = tgs_sticker
        this.contains_masks = contains_masks
        this.mask_position = mask_position
    }
}

/** Use this method to add a new sticker to a set created by the bot. You must use exactly one of the fields png_sticker or tgs_sticker. Animated stickers can be added to animated sticker sets and only to them. Animated sticker sets can have up to 50 stickers. Static sticker sets can have up to 120 stickers. Returns True on success. */
export class addStickerToSet implements Method {
    /** Name of this interface as a string */
    objectName = 'addStickerToSet'
    /** User identifier of sticker set owner */
    user_id: number
    /** Sticker set name */
    name: string
    /** PNG image with the sticker, must be up to 512 kilobytes in size, dimensions must not exceed 512px, and either width or height must be exactly 512px. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files » */
    png_sticker?: InputFile|string
    /** TGS animation with the sticker, uploaded using multipart/form-data. See https://core.telegram.org/animated_stickers#technical-requirements for technical requirements */
    tgs_sticker?: InputFile
    /** One or more emoji corresponding to the sticker */
    emojis: string
    /** A JSON-serialized object for position where the mask should be placed on faces */
    mask_position?: MaskPosition

    constructor(user_id: number, name: string, emojis: string, png_sticker?: InputFile|string, tgs_sticker?: InputFile, mask_position?: MaskPosition) {
        this.user_id = user_id
        this.name = name
        this.emojis = emojis
        this.png_sticker = png_sticker
        this.tgs_sticker = tgs_sticker
        this.mask_position = mask_position
    }
}

/** Use this method to move a sticker in a set created by the bot to a specific position. Returns True on success. */
export class setStickerPositionInSet implements Method {
    /** Name of this interface as a string */
    objectName = 'setStickerPositionInSet'
    /** File identifier of the sticker */
    sticker: string
    /** New sticker position in the set, zero-based */
    position: number

    constructor(sticker: string, position: number) {
        this.sticker = sticker
        this.position = position
    }
}

/** Use this method to delete a sticker from a set created by the bot. Returns True on success. */
export class deleteStickerFromSet implements Method {
    /** Name of this interface as a string */
    objectName = 'deleteStickerFromSet'
    /** File identifier of the sticker */
    sticker: string

    constructor(sticker: string) {
        this.sticker = sticker
    }
}

/** Use this method to set the thumbnail of a sticker set. Animated thumbnails can be set for animated sticker sets only. Returns True on success. */
export class setStickerSetThumb implements Method {
    /** Name of this interface as a string */
    objectName = 'setStickerSetThumb'
    /** Sticker set name */
    name: string
    /** User identifier of the sticker set owner */
    user_id: number
    /** A PNG image with the thumbnail, must be up to 128 kilobytes in size and have width and height exactly 100px, or a TGS animation with the thumbnail up to 32 kilobytes in size; see https://core.telegram.org/animated_stickers#technical-requirements for animated sticker technical requirements. Pass a file_id as a String to send a file that already exists on the Telegram servers, pass an HTTP URL as a String for Telegram to get a file from the Internet, or upload a new one using multipart/form-data. More info on Sending Files ». Animated sticker set thumbnail can't be uploaded via HTTP URL. */
    thumb?: InputFile|string

    constructor(name: string, user_id: number, thumb?: InputFile|string) {
        this.name = name
        this.user_id = user_id
        this.thumb = thumb
    }
}

/** This object represents an incoming inline query. When the user sends an empty query, your bot could return some default or trending results. */
export class InlineQuery implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQuery'
    /** Unique identifier for this query */
    id: string
    /** Sender */
    from: User
    /** Text of the query (up to 256 characters) */
    query: string
    /** Offset of the results to be returned, can be controlled by the bot */
    offset: string
    /** Type of the chat, from which the inline query was sent. Can be either “sender” for a private chat with the inline query sender, “private”, “group”, “supergroup”, or “channel”. The chat type should be always known for requests sent from official clients and most third-party clients, unless the request was sent from a secret chat */
    chat_type?: string
    /** Sender location, only for bots that request user location */
    location?: Location

    constructor(id: string, from: User, query: string, offset: string, chat_type?: string, location?: Location) {
        this.id = id
        this.from = from
        this.query = query
        this.offset = offset
        this.chat_type = chat_type
        this.location = location
    }
}

/** Use this method to send answers to an inline query. On success, True is returned.No more than 50 results per query are allowed. */
export class answerInlineQuery implements Method {
    /** Name of this interface as a string */
    objectName = 'answerInlineQuery'
    /** Unique identifier for the answered query */
    inline_query_id: string
    /** A JSON-serialized array of results for the inline query */
    results: Array<InlineQueryResult>
    /** The maximum amount of time in seconds that the result of the inline query may be cached on the server. Defaults to 300. */
    cache_time?: number
    /** Pass True, if results may be cached on the server side only for the user that sent the query. By default, results may be returned to any user who sends the same query */
    is_personal?: boolean
    /** Pass the offset that a client should send in the next query with the same text to receive more results. Pass an empty string if there are no more results or if you don't support pagination. Offset length can't exceed 64 bytes. */
    next_offset?: string
    /** If passed, clients will display a button with specified text that switches the user to a private chat with the bot and sends the bot a start message with the parameter switch_pm_parameter */
    switch_pm_text?: string
    /** Deep-linking parameter for the /start message sent to the bot when user presses the switch button. 1-64 characters, only A-Z, a-z, 0-9, _ and - are allowed.Example: An inline bot that sends YouTube videos can ask the user to connect the bot to their YouTube account to adapt search results accordingly. To do this, it displays a 'Connect your YouTube account' button above the results, or even before showing any. The user presses the button, switches to a private chat with the bot and, in doing so, passes a start parameter that instructs the bot to return an OAuth link. Once done, the bot can offer a switch_inline button so that the user can easily return to the chat where they wanted to use the bot's inline capabilities. */
    switch_pm_parameter?: string

    constructor(inline_query_id: string, results: Array<InlineQueryResult>, cache_time?: number, is_personal?: boolean, next_offset?: string, switch_pm_text?: string, switch_pm_parameter?: string) {
        this.inline_query_id = inline_query_id
        this.results = results
        this.cache_time = cache_time
        this.is_personal = is_personal
        this.next_offset = next_offset
        this.switch_pm_text = switch_pm_text
        this.switch_pm_parameter = switch_pm_parameter
    }
}

/** This object represents one result of an inline query. Telegram clients currently support results of the following 20 types: */
export type InlineQueryResult = InlineQueryResultCachedAudio | InlineQueryResultCachedDocument | InlineQueryResultCachedGif | InlineQueryResultCachedMpeg4Gif | InlineQueryResultCachedPhoto | InlineQueryResultCachedSticker | InlineQueryResultCachedVideo | InlineQueryResultCachedVoice | InlineQueryResultArticle | InlineQueryResultAudio | InlineQueryResultContact | InlineQueryResultGame | InlineQueryResultDocument | InlineQueryResultGif | InlineQueryResultLocation | InlineQueryResultMpeg4Gif | InlineQueryResultPhoto | InlineQueryResultVenue | InlineQueryResultVideo | InlineQueryResultVoice

/** Represents a link to an article or web page. */
export class InlineQueryResultArticle implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultArticle'
    /** Type of the result, must be article */
    type: string
    /** Unique identifier for this result, 1-64 Bytes */
    id: string
    /** Title of the result */
    title: string
    /** Content of the message to be sent */
    input_message_content: InputMessageContent
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** URL of the result */
    url?: string
    /** Pass True, if you don&#39;t want the URL to be shown in the message */
    hide_url?: boolean
    /** Short description of the result */
    description?: string
    /** Url of the thumbnail for the result */
    thumb_url?: string
    /** Thumbnail width */
    thumb_width?: number
    /** Thumbnail height */
    thumb_height?: number

    constructor(type: string, id: string, title: string, input_message_content: InputMessageContent, reply_markup?: InlineKeyboardMarkup, url?: string, hide_url?: boolean, description?: string, thumb_url?: string, thumb_width?: number, thumb_height?: number) {
        this.type = type
        this.id = id
        this.title = title
        this.input_message_content = input_message_content
        this.reply_markup = reply_markup
        this.url = url
        this.hide_url = hide_url
        this.description = description
        this.thumb_url = thumb_url
        this.thumb_width = thumb_width
        this.thumb_height = thumb_height
    }
}

/** Represents a link to a photo. By default, this photo will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo. */
export class InlineQueryResultPhoto implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultPhoto'
    /** Type of the result, must be photo */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid URL of the photo. Photo must be in JPEG format. Photo size must not exceed 5MB */
    photo_url: string
    /** URL of the thumbnail for the photo */
    thumb_url: string
    /** Width of the photo */
    photo_width?: number
    /** Height of the photo */
    photo_height?: number
    /** Title for the result */
    title?: string
    /** Short description of the result */
    description?: string
    /** Caption of the photo to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the photo */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, photo_url: string, thumb_url: string, photo_width?: number, photo_height?: number, title?: string, description?: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.photo_url = photo_url
        this.thumb_url = thumb_url
        this.photo_width = photo_width
        this.photo_height = photo_height
        this.title = title
        this.description = description
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to an animated GIF file. By default, this animated GIF file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation. */
export class InlineQueryResultGif implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultGif'
    /** Type of the result, must be gif */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid URL for the GIF file. File size must not exceed 1MB */
    gif_url: string
    /** Width of the GIF */
    gif_width?: number
    /** Height of the GIF */
    gif_height?: number
    /** Duration of the GIF in seconds */
    gif_duration?: number
    /** URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result */
    thumb_url: string
    /** MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg” */
    thumb_mime_type?: string
    /** Title for the result */
    title?: string
    /** Caption of the GIF file to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the GIF animation */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, gif_url: string, thumb_url: string, gif_width?: number, gif_height?: number, gif_duration?: number, thumb_mime_type?: string, title?: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.gif_url = gif_url
        this.thumb_url = thumb_url
        this.gif_width = gif_width
        this.gif_height = gif_height
        this.gif_duration = gif_duration
        this.thumb_mime_type = thumb_mime_type
        this.title = title
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to a video animation (H.264/MPEG-4 AVC video without sound). By default, this animated MPEG-4 file will be sent by the user with optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation. */
export class InlineQueryResultMpeg4Gif implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultMpeg4Gif'
    /** Type of the result, must be mpeg4_gif */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid URL for the MP4 file. File size must not exceed 1MB */
    mpeg4_url: string
    /** Video width */
    mpeg4_width?: number
    /** Video height */
    mpeg4_height?: number
    /** Video duration in seconds */
    mpeg4_duration?: number
    /** URL of the static (JPEG or GIF) or animated (MPEG4) thumbnail for the result */
    thumb_url: string
    /** MIME type of the thumbnail, must be one of “image/jpeg”, “image/gif”, or “video/mp4”. Defaults to “image/jpeg” */
    thumb_mime_type?: string
    /** Title for the result */
    title?: string
    /** Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the video animation */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, mpeg4_url: string, thumb_url: string, mpeg4_width?: number, mpeg4_height?: number, mpeg4_duration?: number, thumb_mime_type?: string, title?: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.mpeg4_url = mpeg4_url
        this.thumb_url = thumb_url
        this.mpeg4_width = mpeg4_width
        this.mpeg4_height = mpeg4_height
        this.mpeg4_duration = mpeg4_duration
        this.thumb_mime_type = thumb_mime_type
        this.title = title
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to a page containing an embedded video player or a video file. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video. */
export class InlineQueryResultVideo implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultVideo'
    /** Type of the result, must be video */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid URL for the embedded video player or video file */
    video_url: string
    /** Mime type of the content of video url, “text/html” or “video/mp4” */
    mime_type: string
    /** URL of the thumbnail (JPEG only) for the video */
    thumb_url: string
    /** Title for the result */
    title: string
    /** Caption of the video to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Video width */
    video_width?: number
    /** Video height */
    video_height?: number
    /** Video duration in seconds */
    video_duration?: number
    /** Short description of the result */
    description?: string
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the video. This field is required if InlineQueryResultVideo is used to send an HTML-page as a result (e.g., a YouTube video). */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, video_url: string, mime_type: string, thumb_url: string, title: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, video_width?: number, video_height?: number, video_duration?: number, description?: string, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.video_url = video_url
        this.mime_type = mime_type
        this.thumb_url = thumb_url
        this.title = title
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.video_width = video_width
        this.video_height = video_height
        this.video_duration = video_duration
        this.description = description
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to an MP3 audio file. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio. */
export class InlineQueryResultAudio implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultAudio'
    /** Type of the result, must be audio */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid URL for the audio file */
    audio_url: string
    /** Title */
    title: string
    /** Caption, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Performer */
    performer?: string
    /** Audio duration in seconds */
    audio_duration?: number
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the audio */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, audio_url: string, title: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, performer?: string, audio_duration?: number, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.audio_url = audio_url
        this.title = title
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.performer = performer
        this.audio_duration = audio_duration
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to a voice recording in an .OGG container encoded with OPUS. By default, this voice recording will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the the voice message. */
export class InlineQueryResultVoice implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultVoice'
    /** Type of the result, must be voice */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid URL for the voice recording */
    voice_url: string
    /** Recording title */
    title: string
    /** Caption, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the voice message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** Recording duration in seconds */
    voice_duration?: number
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the voice recording */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, voice_url: string, title: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, voice_duration?: number, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.voice_url = voice_url
        this.title = title
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.voice_duration = voice_duration
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to a file. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. Currently, only .PDF and .ZIP files can be sent using this method. */
export class InlineQueryResultDocument implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultDocument'
    /** Type of the result, must be document */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** Title for the result */
    title: string
    /** Caption of the document to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** A valid URL for the file */
    document_url: string
    /** Mime type of the content of the file, either “application/pdf” or “application/zip” */
    mime_type: string
    /** Short description of the result */
    description?: string
    /** Inline keyboard attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the file */
    input_message_content?: InputMessageContent
    /** URL of the thumbnail (JPEG only) for the file */
    thumb_url?: string
    /** Thumbnail width */
    thumb_width?: number
    /** Thumbnail height */
    thumb_height?: number

    constructor(type: string, id: string, title: string, document_url: string, mime_type: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, description?: string, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent, thumb_url?: string, thumb_width?: number, thumb_height?: number) {
        this.type = type
        this.id = id
        this.title = title
        this.document_url = document_url
        this.mime_type = mime_type
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.description = description
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
        this.thumb_url = thumb_url
        this.thumb_width = thumb_width
        this.thumb_height = thumb_height
    }
}

/** Represents a location on a map. By default, the location will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the location. */
export class InlineQueryResultLocation implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultLocation'
    /** Type of the result, must be location */
    type: string
    /** Unique identifier for this result, 1-64 Bytes */
    id: string
    /** Location latitude in degrees */
    latitude: number
    /** Location longitude in degrees */
    longitude: number
    /** Location title */
    title: string
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number
    /** Period in seconds for which the location can be updated, should be between 60 and 86400. */
    live_period?: number
    /** For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
    heading?: number
    /** For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
    proximity_alert_radius?: number
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the location */
    input_message_content?: InputMessageContent
    /** Url of the thumbnail for the result */
    thumb_url?: string
    /** Thumbnail width */
    thumb_width?: number
    /** Thumbnail height */
    thumb_height?: number

    constructor(type: string, id: string, latitude: number, longitude: number, title: string, horizontal_accuracy?: number, live_period?: number, heading?: number, proximity_alert_radius?: number, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent, thumb_url?: string, thumb_width?: number, thumb_height?: number) {
        this.type = type
        this.id = id
        this.latitude = latitude
        this.longitude = longitude
        this.title = title
        this.horizontal_accuracy = horizontal_accuracy
        this.live_period = live_period
        this.heading = heading
        this.proximity_alert_radius = proximity_alert_radius
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
        this.thumb_url = thumb_url
        this.thumb_width = thumb_width
        this.thumb_height = thumb_height
    }
}

/** Represents a venue. By default, the venue will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the venue. */
export class InlineQueryResultVenue implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultVenue'
    /** Type of the result, must be venue */
    type: string
    /** Unique identifier for this result, 1-64 Bytes */
    id: string
    /** Latitude of the venue location in degrees */
    latitude: number
    /** Longitude of the venue location in degrees */
    longitude: number
    /** Title of the venue */
    title: string
    /** Address of the venue */
    address: string
    /** Foursquare identifier of the venue if known */
    foursquare_id?: string
    /** Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) */
    foursquare_type?: string
    /** Google Places identifier of the venue */
    google_place_id?: string
    /** Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).) */
    google_place_type?: string
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the venue */
    input_message_content?: InputMessageContent
    /** Url of the thumbnail for the result */
    thumb_url?: string
    /** Thumbnail width */
    thumb_width?: number
    /** Thumbnail height */
    thumb_height?: number

    constructor(type: string, id: string, latitude: number, longitude: number, title: string, address: string, foursquare_id?: string, foursquare_type?: string, google_place_id?: string, google_place_type?: string, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent, thumb_url?: string, thumb_width?: number, thumb_height?: number) {
        this.type = type
        this.id = id
        this.latitude = latitude
        this.longitude = longitude
        this.title = title
        this.address = address
        this.foursquare_id = foursquare_id
        this.foursquare_type = foursquare_type
        this.google_place_id = google_place_id
        this.google_place_type = google_place_type
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
        this.thumb_url = thumb_url
        this.thumb_width = thumb_width
        this.thumb_height = thumb_height
    }
}

/** Represents a contact with a phone number. By default, this contact will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the contact. */
export class InlineQueryResultContact implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultContact'
    /** Type of the result, must be contact */
    type: string
    /** Unique identifier for this result, 1-64 Bytes */
    id: string
    /** Contact&#39;s phone number */
    phone_number: string
    /** Contact&#39;s first name */
    first_name: string
    /** Contact&#39;s last name */
    last_name?: string
    /** Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard), 0-2048 bytes */
    vcard?: string
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the contact */
    input_message_content?: InputMessageContent
    /** Url of the thumbnail for the result */
    thumb_url?: string
    /** Thumbnail width */
    thumb_width?: number
    /** Thumbnail height */
    thumb_height?: number

    constructor(type: string, id: string, phone_number: string, first_name: string, last_name?: string, vcard?: string, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent, thumb_url?: string, thumb_width?: number, thumb_height?: number) {
        this.type = type
        this.id = id
        this.phone_number = phone_number
        this.first_name = first_name
        this.last_name = last_name
        this.vcard = vcard
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
        this.thumb_url = thumb_url
        this.thumb_width = thumb_width
        this.thumb_height = thumb_height
    }
}

/** Represents a [Game](https://core.telegram.org/bots/api#games). */
export class InlineQueryResultGame implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultGame'
    /** Type of the result, must be game */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** Short name of the game */
    game_short_name: string
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup

    constructor(type: string, id: string, game_short_name: string, reply_markup?: InlineKeyboardMarkup) {
        this.type = type
        this.id = id
        this.game_short_name = game_short_name
        this.reply_markup = reply_markup
    }
}

/** Represents a link to a photo stored on the Telegram servers. By default, this photo will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the photo. */
export class InlineQueryResultCachedPhoto implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultCachedPhoto'
    /** Type of the result, must be photo */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid file identifier of the photo */
    photo_file_id: string
    /** Title for the result */
    title?: string
    /** Short description of the result */
    description?: string
    /** Caption of the photo to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the photo caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the photo */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, photo_file_id: string, title?: string, description?: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.photo_file_id = photo_file_id
        this.title = title
        this.description = description
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to an animated GIF file stored on the Telegram servers. By default, this animated GIF file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with specified content instead of the animation. */
export class InlineQueryResultCachedGif implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultCachedGif'
    /** Type of the result, must be gif */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid file identifier for the GIF file */
    gif_file_id: string
    /** Title for the result */
    title?: string
    /** Caption of the GIF file to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the GIF animation */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, gif_file_id: string, title?: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.gif_file_id = gif_file_id
        this.title = title
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to a video animation (H.264/MPEG-4 AVC video without sound) stored on the Telegram servers. By default, this animated MPEG-4 file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the animation. */
export class InlineQueryResultCachedMpeg4Gif implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultCachedMpeg4Gif'
    /** Type of the result, must be mpeg4_gif */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid file identifier for the MP4 file */
    mpeg4_file_id: string
    /** Title for the result */
    title?: string
    /** Caption of the MPEG-4 file to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the video animation */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, mpeg4_file_id: string, title?: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.mpeg4_file_id = mpeg4_file_id
        this.title = title
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to a sticker stored on the Telegram servers. By default, this sticker will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the sticker. */
export class InlineQueryResultCachedSticker implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultCachedSticker'
    /** Type of the result, must be sticker */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid file identifier of the sticker */
    sticker_file_id: string
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the sticker */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, sticker_file_id: string, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.sticker_file_id = sticker_file_id
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to a file stored on the Telegram servers. By default, this file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the file. */
export class InlineQueryResultCachedDocument implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultCachedDocument'
    /** Type of the result, must be document */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** Title for the result */
    title: string
    /** A valid file identifier for the file */
    document_file_id: string
    /** Short description of the result */
    description?: string
    /** Caption of the document to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the document caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the file */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, title: string, document_file_id: string, description?: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.title = title
        this.document_file_id = document_file_id
        this.description = description
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to a video file stored on the Telegram servers. By default, this video file will be sent by the user with an optional caption. Alternatively, you can use input_message_content to send a message with the specified content instead of the video. */
export class InlineQueryResultCachedVideo implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultCachedVideo'
    /** Type of the result, must be video */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid file identifier for the video file */
    video_file_id: string
    /** Title for the result */
    title: string
    /** Short description of the result */
    description?: string
    /** Caption of the video to be sent, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the video caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the video */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, video_file_id: string, title: string, description?: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.video_file_id = video_file_id
        this.title = title
        this.description = description
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to a voice message stored on the Telegram servers. By default, this voice message will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the voice message. */
export class InlineQueryResultCachedVoice implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultCachedVoice'
    /** Type of the result, must be voice */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid file identifier for the voice message */
    voice_file_id: string
    /** Voice message title */
    title: string
    /** Caption, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the voice message caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the voice message */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, voice_file_id: string, title: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.voice_file_id = voice_file_id
        this.title = title
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** Represents a link to an MP3 audio file stored on the Telegram servers. By default, this audio file will be sent by the user. Alternatively, you can use input_message_content to send a message with the specified content instead of the audio. */
export class InlineQueryResultCachedAudio implements Type {
    /** Name of this interface as a string */
    objectName = 'InlineQueryResultCachedAudio'
    /** Type of the result, must be audio */
    type: string
    /** Unique identifier for this result, 1-64 bytes */
    id: string
    /** A valid file identifier for the audio file */
    audio_file_id: string
    /** Caption, 0-1024 characters after entities parsing */
    caption?: string
    /** Mode for parsing entities in the audio caption. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in the caption, which can be specified instead of parse_mode */
    caption_entities?: Array<MessageEntity>
    /** [Inline keyboard](/bots#inline-keyboards-and-on-the-fly-updating) attached to the message */
    reply_markup?: InlineKeyboardMarkup
    /** Content of the message to be sent instead of the audio */
    input_message_content?: InputMessageContent

    constructor(type: string, id: string, audio_file_id: string, caption?: string, parse_mode?: string, caption_entities?: Array<MessageEntity>, reply_markup?: InlineKeyboardMarkup, input_message_content?: InputMessageContent) {
        this.type = type
        this.id = id
        this.audio_file_id = audio_file_id
        this.caption = caption
        this.parse_mode = parse_mode
        this.caption_entities = caption_entities
        this.reply_markup = reply_markup
        this.input_message_content = input_message_content
    }
}

/** This object represents the content of a message to be sent as a result of an inline query. Telegram clients currently support the following 5 types: */
export type InputMessageContent = InputTextMessageContent | InputLocationMessageContent | InputVenueMessageContent | InputContactMessageContent | InputInvoiceMessageContent

/** Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a text message to be sent as the result of an inline query. */
export class InputTextMessageContent implements Type {
    /** Name of this interface as a string */
    objectName = 'InputTextMessageContent'
    /** Text of the message to be sent, 1-4096 characters */
    message_text: string
    /** Mode for parsing entities in the message text. See [formatting options](https://core.telegram.org/bots/api#formatting-options) for more details. */
    parse_mode?: string
    /** List of special entities that appear in message text, which can be specified instead of parse_mode */
    entities?: Array<MessageEntity>
    /** Disables link previews for links in the sent message */
    disable_web_page_preview?: boolean

    constructor(message_text: string, parse_mode?: string, entities?: Array<MessageEntity>, disable_web_page_preview?: boolean) {
        this.message_text = message_text
        this.parse_mode = parse_mode
        this.entities = entities
        this.disable_web_page_preview = disable_web_page_preview
    }
}

/** Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a location message to be sent as the result of an inline query. */
export class InputLocationMessageContent implements Type {
    /** Name of this interface as a string */
    objectName = 'InputLocationMessageContent'
    /** Latitude of the location in degrees */
    latitude: number
    /** Longitude of the location in degrees */
    longitude: number
    /** The radius of uncertainty for the location, measured in meters; 0-1500 */
    horizontal_accuracy?: number
    /** Period in seconds for which the location can be updated, should be between 60 and 86400. */
    live_period?: number
    /** For live locations, a direction in which the user is moving, in degrees. Must be between 1 and 360 if specified. */
    heading?: number
    /** For live locations, a maximum distance for proximity alerts about approaching another chat member, in meters. Must be between 1 and 100000 if specified. */
    proximity_alert_radius?: number

    constructor(latitude: number, longitude: number, horizontal_accuracy?: number, live_period?: number, heading?: number, proximity_alert_radius?: number) {
        this.latitude = latitude
        this.longitude = longitude
        this.horizontal_accuracy = horizontal_accuracy
        this.live_period = live_period
        this.heading = heading
        this.proximity_alert_radius = proximity_alert_radius
    }
}

/** Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a venue message to be sent as the result of an inline query. */
export class InputVenueMessageContent implements Type {
    /** Name of this interface as a string */
    objectName = 'InputVenueMessageContent'
    /** Latitude of the venue in degrees */
    latitude: number
    /** Longitude of the venue in degrees */
    longitude: number
    /** Name of the venue */
    title: string
    /** Address of the venue */
    address: string
    /** Foursquare identifier of the venue, if known */
    foursquare_id?: string
    /** Foursquare type of the venue, if known. (For example, “arts_entertainment/default”, “arts_entertainment/aquarium” or “food/icecream”.) */
    foursquare_type?: string
    /** Google Places identifier of the venue */
    google_place_id?: string
    /** Google Places type of the venue. (See [supported types](https://developers.google.com/places/web-service/supported_types).) */
    google_place_type?: string

    constructor(latitude: number, longitude: number, title: string, address: string, foursquare_id?: string, foursquare_type?: string, google_place_id?: string, google_place_type?: string) {
        this.latitude = latitude
        this.longitude = longitude
        this.title = title
        this.address = address
        this.foursquare_id = foursquare_id
        this.foursquare_type = foursquare_type
        this.google_place_id = google_place_id
        this.google_place_type = google_place_type
    }
}

/** Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of a contact message to be sent as the result of an inline query. */
export class InputContactMessageContent implements Type {
    /** Name of this interface as a string */
    objectName = 'InputContactMessageContent'
    /** Contact&#39;s phone number */
    phone_number: string
    /** Contact&#39;s first name */
    first_name: string
    /** Contact&#39;s last name */
    last_name?: string
    /** Additional data about the contact in the form of a [vCard](https://en.wikipedia.org/wiki/VCard), 0-2048 bytes */
    vcard?: string

    constructor(phone_number: string, first_name: string, last_name?: string, vcard?: string) {
        this.phone_number = phone_number
        this.first_name = first_name
        this.last_name = last_name
        this.vcard = vcard
    }
}

/** Represents the [content](https://core.telegram.org/bots/api#inputmessagecontent) of an invoice message to be sent as the result of an inline query. */
export class InputInvoiceMessageContent implements Type {
    /** Name of this interface as a string */
    objectName = 'InputInvoiceMessageContent'
    /** Product name, 1-32 characters */
    title: string
    /** Product description, 1-255 characters */
    description: string
    /** Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes. */
    payload: string
    /** Payment provider token, obtained via [Botfather](https://t.me/botfather) */
    provider_token: string
    /** Three-letter ISO 4217 currency code, see [more on currencies](/bots/payments#supported-currencies) */
    currency: string
    /** Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.) */
    prices: Array<LabeledPrice>
    /** The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0 */
    max_tip_amount?: number
    /** A JSON-serialized array of suggested amounts of tip in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. */
    suggested_tip_amounts?: Array<number>
    /** A JSON-serialized object for data about the invoice, which will be shared with the payment provider. A detailed description of the required fields should be provided by the payment provider. */
    provider_data?: string
    /** URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for. */
    photo_url?: string
    /** Photo size */
    photo_size?: number
    /** Photo width */
    photo_width?: number
    /** Photo height */
    photo_height?: number
    /** Pass True, if you require the user&#39;s full name to complete the order */
    need_name?: boolean
    /** Pass True, if you require the user&#39;s phone number to complete the order */
    need_phone_number?: boolean
    /** Pass True, if you require the user&#39;s email address to complete the order */
    need_email?: boolean
    /** Pass True, if you require the user&#39;s shipping address to complete the order */
    need_shipping_address?: boolean
    /** Pass True, if user&#39;s phone number should be sent to provider */
    send_phone_number_to_provider?: boolean
    /** Pass True, if user&#39;s email address should be sent to provider */
    send_email_to_provider?: boolean
    /** Pass True, if the final price depends on the shipping method */
    is_flexible?: boolean

    constructor(title: string, description: string, payload: string, provider_token: string, currency: string, prices: Array<LabeledPrice>, max_tip_amount?: number, suggested_tip_amounts?: Array<number>, provider_data?: string, photo_url?: string, photo_size?: number, photo_width?: number, photo_height?: number, need_name?: boolean, need_phone_number?: boolean, need_email?: boolean, need_shipping_address?: boolean, send_phone_number_to_provider?: boolean, send_email_to_provider?: boolean, is_flexible?: boolean) {
        this.title = title
        this.description = description
        this.payload = payload
        this.provider_token = provider_token
        this.currency = currency
        this.prices = prices
        this.max_tip_amount = max_tip_amount
        this.suggested_tip_amounts = suggested_tip_amounts
        this.provider_data = provider_data
        this.photo_url = photo_url
        this.photo_size = photo_size
        this.photo_width = photo_width
        this.photo_height = photo_height
        this.need_name = need_name
        this.need_phone_number = need_phone_number
        this.need_email = need_email
        this.need_shipping_address = need_shipping_address
        this.send_phone_number_to_provider = send_phone_number_to_provider
        this.send_email_to_provider = send_email_to_provider
        this.is_flexible = is_flexible
    }
}

/** Represents a [result](https://core.telegram.org/bots/api#inlinequeryresult) of an inline query that was chosen by the user and sent to their chat partner. */
export class ChosenInlineResult implements Type {
    /** Name of this interface as a string */
    objectName = 'ChosenInlineResult'
    /** The unique identifier for the result that was chosen */
    result_id: string
    /** The user that chose the result */
    from: User
    /** Sender location, only for bots that require user location */
    location?: Location
    /** Identifier of the sent inline message. Available only if there is an [inline keyboard](https://core.telegram.org/bots/api#inlinekeyboardmarkup) attached to the message. Will be also received in [callback queries](https://core.telegram.org/bots/api#callbackquery) and can be used to [edit](https://core.telegram.org/bots/api#updating-messages) the message. */
    inline_message_id?: string
    /** The query that was used to obtain the result */
    query: string

    constructor(result_id: string, from: User, query: string, location?: Location, inline_message_id?: string) {
        this.result_id = result_id
        this.from = from
        this.query = query
        this.location = location
        this.inline_message_id = inline_message_id
    }
}

/** Use this method to send invoices. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendInvoice implements Method {
    /** Name of this interface as a string */
    objectName = 'sendInvoice'
    /** Unique identifier for the target chat or username of the target channel (in the format @channelusername) */
    chat_id: number|string
    /** Product name, 1-32 characters */
    title: string
    /** Product description, 1-255 characters */
    description: string
    /** Bot-defined invoice payload, 1-128 bytes. This will not be displayed to the user, use for your internal processes. */
    payload: string
    /** Payments provider token, obtained via Botfather */
    provider_token: string
    /** Three-letter ISO 4217 currency code, see more on currencies */
    currency: string
    /** Price breakdown, a JSON-serialized list of components (e.g. product price, tax, discount, delivery cost, delivery tax, bonus, etc.) */
    prices: Array<LabeledPrice>
    /** The maximum accepted amount for tips in the smallest units of the currency (integer, not float/double). For example, for a maximum tip of US$ 1.45 pass max_tip_amount = 145. See the exp parameter in currencies.json, it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). Defaults to 0 */
    max_tip_amount?: number
    /** A JSON-serialized array of suggested amounts of tips in the smallest units of the currency (integer, not float/double). At most 4 suggested tip amounts can be specified. The suggested tip amounts must be positive, passed in a strictly increased order and must not exceed max_tip_amount. */
    suggested_tip_amounts?: Array<number>
    /** Unique deep-linking parameter. If left empty, forwarded copies of the sent message will have a Pay button, allowing multiple users to pay directly from the forwarded message, using the same invoice. If non-empty, forwarded copies of the sent message will have a URL button with a deep link to the bot (instead of a Pay button), with the value used as the start parameter */
    start_parameter?: string
    /** A JSON-serialized data about the invoice, which will be shared with the payment provider. A detailed description of required fields should be provided by the payment provider. */
    provider_data?: string
    /** URL of the product photo for the invoice. Can be a photo of the goods or a marketing image for a service. People like it better when they see what they are paying for. */
    photo_url?: string
    /** Photo size */
    photo_size?: number
    /** Photo width */
    photo_width?: number
    /** Photo height */
    photo_height?: number
    /** Pass True, if you require the user's full name to complete the order */
    need_name?: boolean
    /** Pass True, if you require the user's phone number to complete the order */
    need_phone_number?: boolean
    /** Pass True, if you require the user's email address to complete the order */
    need_email?: boolean
    /** Pass True, if you require the user's shipping address to complete the order */
    need_shipping_address?: boolean
    /** Pass True, if user's phone number should be sent to provider */
    send_phone_number_to_provider?: boolean
    /** Pass True, if user's email address should be sent to provider */
    send_email_to_provider?: boolean
    /** Pass True, if the final price depends on the shipping method */
    is_flexible?: boolean
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** A JSON-serialized object for an inline keyboard. If empty, one 'Pay total price' button will be shown. If not empty, the first button must be a Pay button. */
    reply_markup?: InlineKeyboardMarkup

    constructor(chat_id: number|string, title: string, description: string, payload: string, provider_token: string, currency: string, prices: Array<LabeledPrice>, max_tip_amount?: number, suggested_tip_amounts?: Array<number>, start_parameter?: string, provider_data?: string, photo_url?: string, photo_size?: number, photo_width?: number, photo_height?: number, need_name?: boolean, need_phone_number?: boolean, need_email?: boolean, need_shipping_address?: boolean, send_phone_number_to_provider?: boolean, send_email_to_provider?: boolean, is_flexible?: boolean, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup) {
        this.chat_id = chat_id
        this.title = title
        this.description = description
        this.payload = payload
        this.provider_token = provider_token
        this.currency = currency
        this.prices = prices
        this.max_tip_amount = max_tip_amount
        this.suggested_tip_amounts = suggested_tip_amounts
        this.start_parameter = start_parameter
        this.provider_data = provider_data
        this.photo_url = photo_url
        this.photo_size = photo_size
        this.photo_width = photo_width
        this.photo_height = photo_height
        this.need_name = need_name
        this.need_phone_number = need_phone_number
        this.need_email = need_email
        this.need_shipping_address = need_shipping_address
        this.send_phone_number_to_provider = send_phone_number_to_provider
        this.send_email_to_provider = send_email_to_provider
        this.is_flexible = is_flexible
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** If you sent an invoice requesting a shipping address and the parameter is_flexible was specified, the Bot API will send an [Update](https://core.telegram.org/bots/api#update) with a shipping_query field to the bot. Use this method to reply to shipping queries. On success, True is returned. */
export class answerShippingQuery implements Method {
    /** Name of this interface as a string */
    objectName = 'answerShippingQuery'
    /** Unique identifier for the query to be answered */
    shipping_query_id: string
    /** Specify True if delivery to the specified address is possible and False if there are any problems (for example, if delivery to the specified address is not possible) */
    ok: boolean
    /** Required if ok is True. A JSON-serialized array of available shipping options. */
    shipping_options?: Array<ShippingOption>
    /** Required if ok is False. Error message in human readable form that explains why it is impossible to complete the order (e.g. "Sorry, delivery to your desired address is unavailable'). Telegram will display this message to the user. */
    error_message?: string

    constructor(shipping_query_id: string, ok: boolean, shipping_options?: Array<ShippingOption>, error_message?: string) {
        this.shipping_query_id = shipping_query_id
        this.ok = ok
        this.shipping_options = shipping_options
        this.error_message = error_message
    }
}

/** Once the user has confirmed their payment and shipping details, the Bot API sends the final confirmation in the form of an [Update](https://core.telegram.org/bots/api#update) with the field pre_checkout_query. Use this method to respond to such pre-checkout queries. On success, True is returned. Note: The Bot API must receive an answer within 10 seconds after the pre-checkout query was sent. */
export class answerPreCheckoutQuery implements Method {
    /** Name of this interface as a string */
    objectName = 'answerPreCheckoutQuery'
    /** Unique identifier for the query to be answered */
    pre_checkout_query_id: string
    /** Specify True if everything is alright (goods are available, etc.) and the bot is ready to proceed with the order. Use False if there are any problems. */
    ok: boolean
    /** Required if ok is False. Error message in human readable form that explains the reason for failure to proceed with the checkout (e.g. "Sorry, somebody just bought the last of our amazing black T-shirts while you were busy filling out your payment details. Please choose a different color or garment!"). Telegram will display this message to the user. */
    error_message?: string

    constructor(pre_checkout_query_id: string, ok: boolean, error_message?: string) {
        this.pre_checkout_query_id = pre_checkout_query_id
        this.ok = ok
        this.error_message = error_message
    }
}

/** This object represents a portion of the price for goods or services. */
export class LabeledPrice implements Type {
    /** Name of this interface as a string */
    objectName = 'LabeledPrice'
    /** Portion label */
    label: string
    /** Price of the product in the smallest units of the [currency](/bots/payments#supported-currencies) (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
    amount: number

    constructor(label: string, amount: number) {
        this.label = label
        this.amount = amount
    }
}

/** This object contains basic information about an invoice. */
export class Invoice implements Type {
    /** Name of this interface as a string */
    objectName = 'Invoice'
    /** Product name */
    title: string
    /** Product description */
    description: string
    /** Unique bot deep-linking parameter that can be used to generate this invoice */
    start_parameter: string
    /** Three-letter ISO 4217 [currency](/bots/payments#supported-currencies) code */
    currency: string
    /** Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
    total_amount: number

    constructor(title: string, description: string, start_parameter: string, currency: string, total_amount: number) {
        this.title = title
        this.description = description
        this.start_parameter = start_parameter
        this.currency = currency
        this.total_amount = total_amount
    }
}

/** This object represents a shipping address. */
export class ShippingAddress implements Type {
    /** Name of this interface as a string */
    objectName = 'ShippingAddress'
    /** ISO 3166-1 alpha-2 country code */
    country_code: string
    /** State, if applicable */
    state: string
    /** City */
    city: string
    /** First line for the address */
    street_line1: string
    /** Second line for the address */
    street_line2: string
    /** Address post code */
    post_code: string

    constructor(country_code: string, state: string, city: string, street_line1: string, street_line2: string, post_code: string) {
        this.country_code = country_code
        this.state = state
        this.city = city
        this.street_line1 = street_line1
        this.street_line2 = street_line2
        this.post_code = post_code
    }
}

/** This object represents information about an order. */
export class OrderInfo implements Type {
    /** Name of this interface as a string */
    objectName = 'OrderInfo'
    /** User name */
    name?: string
    /** User&#39;s phone number */
    phone_number?: string
    /** User email */
    email?: string
    /** User shipping address */
    shipping_address?: ShippingAddress

    constructor(name?: string, phone_number?: string, email?: string, shipping_address?: ShippingAddress) {
        this.name = name
        this.phone_number = phone_number
        this.email = email
        this.shipping_address = shipping_address
    }
}

/** This object represents one shipping option. */
export class ShippingOption implements Type {
    /** Name of this interface as a string */
    objectName = 'ShippingOption'
    /** Shipping option identifier */
    id: string
    /** Option title */
    title: string
    /** List of price portions */
    prices: Array<LabeledPrice>

    constructor(id: string, title: string, prices: Array<LabeledPrice>) {
        this.id = id
        this.title = title
        this.prices = prices
    }
}

/** This object contains basic information about a successful payment. */
export class SuccessfulPayment implements Type {
    /** Name of this interface as a string */
    objectName = 'SuccessfulPayment'
    /** Three-letter ISO 4217 [currency](/bots/payments#supported-currencies) code */
    currency: string
    /** Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
    total_amount: number
    /** Bot specified invoice payload */
    invoice_payload: string
    /** Identifier of the shipping option chosen by the user */
    shipping_option_id?: string
    /** Order info provided by the user */
    order_info?: OrderInfo
    /** Telegram payment identifier */
    telegram_payment_charge_id: string
    /** Provider payment identifier */
    provider_payment_charge_id: string

    constructor(currency: string, total_amount: number, invoice_payload: string, telegram_payment_charge_id: string, provider_payment_charge_id: string, shipping_option_id?: string, order_info?: OrderInfo) {
        this.currency = currency
        this.total_amount = total_amount
        this.invoice_payload = invoice_payload
        this.telegram_payment_charge_id = telegram_payment_charge_id
        this.provider_payment_charge_id = provider_payment_charge_id
        this.shipping_option_id = shipping_option_id
        this.order_info = order_info
    }
}

/** This object contains information about an incoming shipping query. */
export class ShippingQuery implements Type {
    /** Name of this interface as a string */
    objectName = 'ShippingQuery'
    /** Unique query identifier */
    id: string
    /** User who sent the query */
    from: User
    /** Bot specified invoice payload */
    invoice_payload: string
    /** User specified shipping address */
    shipping_address: ShippingAddress

    constructor(id: string, from: User, invoice_payload: string, shipping_address: ShippingAddress) {
        this.id = id
        this.from = from
        this.invoice_payload = invoice_payload
        this.shipping_address = shipping_address
    }
}

/** This object contains information about an incoming pre-checkout query. */
export class PreCheckoutQuery implements Type {
    /** Name of this interface as a string */
    objectName = 'PreCheckoutQuery'
    /** Unique query identifier */
    id: string
    /** User who sent the query */
    from: User
    /** Three-letter ISO 4217 [currency](/bots/payments#supported-currencies) code */
    currency: string
    /** Total price in the smallest units of the currency (integer, not float/double). For example, for a price of US$ 1.45 pass amount = 145. See the exp parameter in [currencies.json](https://core.telegram.org/bots/payments/currencies.json), it shows the number of digits past the decimal point for each currency (2 for the majority of currencies). */
    total_amount: number
    /** Bot specified invoice payload */
    invoice_payload: string
    /** Identifier of the shipping option chosen by the user */
    shipping_option_id?: string
    /** Order info provided by the user */
    order_info?: OrderInfo

    constructor(id: string, from: User, currency: string, total_amount: number, invoice_payload: string, shipping_option_id?: string, order_info?: OrderInfo) {
        this.id = id
        this.from = from
        this.currency = currency
        this.total_amount = total_amount
        this.invoice_payload = invoice_payload
        this.shipping_option_id = shipping_option_id
        this.order_info = order_info
    }
}

/** Contains information about Telegram Passport data shared with the bot by the user. */
export class PassportData implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportData'
    /** Array with information about documents and other Telegram Passport elements that was shared with the bot */
    data: Array<EncryptedPassportElement>
    /** Encrypted credentials required to decrypt the data */
    credentials: EncryptedCredentials

    constructor(data: Array<EncryptedPassportElement>, credentials: EncryptedCredentials) {
        this.data = data
        this.credentials = credentials
    }
}

/** This object represents a file uploaded to Telegram Passport. Currently all Telegram Passport files are in JPEG format when decrypted and don&#39;t exceed 10MB. */
export class PassportFile implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportFile'
    /** Identifier for this file, which can be used to download or reuse the file */
    file_id: string
    /** Unique identifier for this file, which is supposed to be the same over time and for different bots. Can&#39;t be used to download or reuse the file. */
    file_unique_id: string
    /** File size in bytes */
    file_size: number
    /** Unix time when the file was uploaded */
    file_date: number

    constructor(file_id: string, file_unique_id: string, file_size: number, file_date: number) {
        this.file_id = file_id
        this.file_unique_id = file_unique_id
        this.file_size = file_size
        this.file_date = file_date
    }
}

/** Contains information about documents or other Telegram Passport elements shared with the bot by the user. */
export class EncryptedPassportElement implements Type {
    /** Name of this interface as a string */
    objectName = 'EncryptedPassportElement'
    /** Element type. One of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration”, “phone_number”, “email”. */
    type: string
    /** Base64-encoded encrypted Telegram Passport element data provided by the user, available for “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport” and “address” types. Can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). */
    data?: string
    /** User&#39;s verified phone number, available only for “phone_number” type */
    phone_number?: string
    /** User&#39;s verified email address, available only for “email” type */
    email?: string
    /** Array of encrypted files with documents provided by the user, available for “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). */
    files?: Array<PassportFile>
    /** Encrypted file with the front side of the document, provided by the user. Available for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). */
    front_side?: PassportFile
    /** Encrypted file with the reverse side of the document, provided by the user. Available for “driver_license” and “identity_card”. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). */
    reverse_side?: PassportFile
    /** Encrypted file with the selfie of the user holding a document, provided by the user; available for “passport”, “driver_license”, “identity_card” and “internal_passport”. The file can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). */
    selfie?: PassportFile
    /** Array of encrypted files with translated versions of documents provided by the user. Available if requested for “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration” and “temporary_registration” types. Files can be decrypted and verified using the accompanying [EncryptedCredentials](https://core.telegram.org/bots/api#encryptedcredentials). */
    translation?: Array<PassportFile>
    /** Base64-encoded element hash for using in [PassportElementErrorUnspecified](https://core.telegram.org/bots/api#passportelementerrorunspecified) */
    hash: string

    constructor(type: string, hash: string, data?: string, phone_number?: string, email?: string, files?: Array<PassportFile>, front_side?: PassportFile, reverse_side?: PassportFile, selfie?: PassportFile, translation?: Array<PassportFile>) {
        this.type = type
        this.hash = hash
        this.data = data
        this.phone_number = phone_number
        this.email = email
        this.files = files
        this.front_side = front_side
        this.reverse_side = reverse_side
        this.selfie = selfie
        this.translation = translation
    }
}

/** Contains data required for decrypting and authenticating [EncryptedPassportElement](https://core.telegram.org/bots/api#encryptedpassportelement). See the [Telegram Passport Documentation](https://core.telegram.org/passport#receiving-information) for a complete description of the data decryption and authentication processes. */
export class EncryptedCredentials implements Type {
    /** Name of this interface as a string */
    objectName = 'EncryptedCredentials'
    /** Base64-encoded encrypted JSON-serialized data with unique user&#39;s payload, data hashes and secrets required for [EncryptedPassportElement](https://core.telegram.org/bots/api#encryptedpassportelement) decryption and authentication */
    data: string
    /** Base64-encoded data hash for data authentication */
    hash: string
    /** Base64-encoded secret, encrypted with the bot&#39;s public RSA key, required for data decryption */
    secret: string

    constructor(data: string, hash: string, secret: string) {
        this.data = data
        this.hash = hash
        this.secret = secret
    }
}

/** Informs a user that some of the Telegram Passport elements they provided contains errors. The user will not be able to re-submit their Passport to you until the errors are fixed (the contents of the field for which you returned the error must change). Returns True on success. Use this if the data submitted by the user doesn&#39;t satisfy the standards your service requires for any reason. For example, if a birthday date seems invalid, a submitted document is blurry, a scan shows evidence of tampering, etc. Supply some details in the error message to make sure the user knows how to correct the issues. */
export class setPassportDataErrors implements Method {
    /** Name of this interface as a string */
    objectName = 'setPassportDataErrors'
    /** User identifier */
    user_id: number
    /** A JSON-serialized array describing the errors */
    errors: Array<PassportElementError>

    constructor(user_id: number, errors: Array<PassportElementError>) {
        this.user_id = user_id
        this.errors = errors
    }
}

/** This object represents an error in the Telegram Passport element which was submitted that should be resolved by the user. It should be one of: */
export type PassportElementError = PassportElementErrorDataField | PassportElementErrorFrontSide | PassportElementErrorReverseSide | PassportElementErrorSelfie | PassportElementErrorFile | PassportElementErrorFiles | PassportElementErrorTranslationFile | PassportElementErrorTranslationFiles | PassportElementErrorUnspecified

/** Represents an issue in one of the data fields that was provided by the user. The error is considered resolved when the field&#39;s value changes. */
export class PassportElementErrorDataField implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportElementErrorDataField'
    /** Error source, must be data */
    source: string
    /** The section of the user&#39;s Telegram Passport which has the error, one of “personal_details”, “passport”, “driver_license”, “identity_card”, “internal_passport”, “address” */
    type: string
    /** Name of the data field which has the error */
    field_name: string
    /** Base64-encoded data hash */
    data_hash: string
    /** Error message */
    message: string

    constructor(source: string, type: string, field_name: string, data_hash: string, message: string) {
        this.source = source
        this.type = type
        this.field_name = field_name
        this.data_hash = data_hash
        this.message = message
    }
}

/** Represents an issue with the front side of a document. The error is considered resolved when the file with the front side of the document changes. */
export class PassportElementErrorFrontSide implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportElementErrorFrontSide'
    /** Error source, must be front_side */
    source: string
    /** The section of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport” */
    type: string
    /** Base64-encoded hash of the file with the front side of the document */
    file_hash: string
    /** Error message */
    message: string

    constructor(source: string, type: string, file_hash: string, message: string) {
        this.source = source
        this.type = type
        this.file_hash = file_hash
        this.message = message
    }
}

/** Represents an issue with the reverse side of a document. The error is considered resolved when the file with reverse side of the document changes. */
export class PassportElementErrorReverseSide implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportElementErrorReverseSide'
    /** Error source, must be reverse_side */
    source: string
    /** The section of the user&#39;s Telegram Passport which has the issue, one of “driver_license”, “identity_card” */
    type: string
    /** Base64-encoded hash of the file with the reverse side of the document */
    file_hash: string
    /** Error message */
    message: string

    constructor(source: string, type: string, file_hash: string, message: string) {
        this.source = source
        this.type = type
        this.file_hash = file_hash
        this.message = message
    }
}

/** Represents an issue with the selfie with a document. The error is considered resolved when the file with the selfie changes. */
export class PassportElementErrorSelfie implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportElementErrorSelfie'
    /** Error source, must be selfie */
    source: string
    /** The section of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport” */
    type: string
    /** Base64-encoded hash of the file with the selfie */
    file_hash: string
    /** Error message */
    message: string

    constructor(source: string, type: string, file_hash: string, message: string) {
        this.source = source
        this.type = type
        this.file_hash = file_hash
        this.message = message
    }
}

/** Represents an issue with a document scan. The error is considered resolved when the file with the document scan changes. */
export class PassportElementErrorFile implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportElementErrorFile'
    /** Error source, must be file */
    source: string
    /** The section of the user&#39;s Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” */
    type: string
    /** Base64-encoded file hash */
    file_hash: string
    /** Error message */
    message: string

    constructor(source: string, type: string, file_hash: string, message: string) {
        this.source = source
        this.type = type
        this.file_hash = file_hash
        this.message = message
    }
}

/** Represents an issue with a list of scans. The error is considered resolved when the list of files containing the scans changes. */
export class PassportElementErrorFiles implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportElementErrorFiles'
    /** Error source, must be files */
    source: string
    /** The section of the user&#39;s Telegram Passport which has the issue, one of “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” */
    type: string
    /** List of base64-encoded file hashes */
    file_hashes: Array<string>
    /** Error message */
    message: string

    constructor(source: string, type: string, file_hashes: Array<string>, message: string) {
        this.source = source
        this.type = type
        this.file_hashes = file_hashes
        this.message = message
    }
}

/** Represents an issue with one of the files that constitute the translation of a document. The error is considered resolved when the file changes. */
export class PassportElementErrorTranslationFile implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportElementErrorTranslationFile'
    /** Error source, must be translation_file */
    source: string
    /** Type of element of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” */
    type: string
    /** Base64-encoded file hash */
    file_hash: string
    /** Error message */
    message: string

    constructor(source: string, type: string, file_hash: string, message: string) {
        this.source = source
        this.type = type
        this.file_hash = file_hash
        this.message = message
    }
}

/** Represents an issue with the translated version of a document. The error is considered resolved when a file with the document translation change. */
export class PassportElementErrorTranslationFiles implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportElementErrorTranslationFiles'
    /** Error source, must be translation_files */
    source: string
    /** Type of element of the user&#39;s Telegram Passport which has the issue, one of “passport”, “driver_license”, “identity_card”, “internal_passport”, “utility_bill”, “bank_statement”, “rental_agreement”, “passport_registration”, “temporary_registration” */
    type: string
    /** List of base64-encoded file hashes */
    file_hashes: Array<string>
    /** Error message */
    message: string

    constructor(source: string, type: string, file_hashes: Array<string>, message: string) {
        this.source = source
        this.type = type
        this.file_hashes = file_hashes
        this.message = message
    }
}

/** Represents an issue in an unspecified place. The error is considered resolved when new data is added. */
export class PassportElementErrorUnspecified implements Type {
    /** Name of this interface as a string */
    objectName = 'PassportElementErrorUnspecified'
    /** Error source, must be unspecified */
    source: string
    /** Type of element of the user&#39;s Telegram Passport which has the issue */
    type: string
    /** Base64-encoded element hash */
    element_hash: string
    /** Error message */
    message: string

    constructor(source: string, type: string, element_hash: string, message: string) {
        this.source = source
        this.type = type
        this.element_hash = element_hash
        this.message = message
    }
}

/** Use this method to send a game. On success, the sent [Message](https://core.telegram.org/bots/api#message) is returned. */
export class sendGame implements Method {
    /** Name of this interface as a string */
    objectName = 'sendGame'
    /** Unique identifier for the target chat */
    chat_id: number
    /** Short name of the game, serves as the unique identifier for the game. Set up your games via Botfather. */
    game_short_name: string
    /** Sends the message silently. Users will receive a notification with no sound. */
    disable_notification?: boolean
    /** If the message is a reply, ID of the original message */
    reply_to_message_id?: number
    /** Pass True, if the message should be sent even if the specified replied-to message is not found */
    allow_sending_without_reply?: boolean
    /** A JSON-serialized object for an inline keyboard. If empty, one 'Play game_title' button will be shown. If not empty, the first button must launch the game. */
    reply_markup?: InlineKeyboardMarkup

    constructor(chat_id: number, game_short_name: string, disable_notification?: boolean, reply_to_message_id?: number, allow_sending_without_reply?: boolean, reply_markup?: InlineKeyboardMarkup) {
        this.chat_id = chat_id
        this.game_short_name = game_short_name
        this.disable_notification = disable_notification
        this.reply_to_message_id = reply_to_message_id
        this.allow_sending_without_reply = allow_sending_without_reply
        this.reply_markup = reply_markup
    }
}

/** This object represents a game. Use BotFather to create and edit games, their short names will act as unique identifiers. */
export class Game implements Type {
    /** Name of this interface as a string */
    objectName = 'Game'
    /** Title of the game */
    title: string
    /** Description of the game */
    description: string
    /** Photo that will be displayed in the game message in chats. */
    photo: Array<PhotoSize>
    /** Brief description of the game or high scores included in the game message. Can be automatically edited to include current high scores for the game when the bot calls [setGameScore](https://core.telegram.org/bots/api#setgamescore), or manually edited using [editMessageText](https://core.telegram.org/bots/api#editmessagetext). 0-4096 characters. */
    text?: string
    /** Special entities that appear in text, such as usernames, URLs, bot commands, etc. */
    text_entities?: Array<MessageEntity>
    /** Animation that will be displayed in the game message in chats. Upload via [BotFather](https://t.me/botfather) */
    animation?: Animation

    constructor(title: string, description: string, photo: Array<PhotoSize>, text?: string, text_entities?: Array<MessageEntity>, animation?: Animation) {
        this.title = title
        this.description = description
        this.photo = photo
        this.text = text
        this.text_entities = text_entities
        this.animation = animation
    }
}

/** A placeholder, currently holds no information. Use [BotFather](https://t.me/botfather) to set up your game. */
export class CallbackGame implements Type {
    /** Name of this interface as a string */
    objectName = 'CallbackGame'
}

/** Use this method to set the score of the specified user in a game message. On success, if the message is not an inline message, the [Message](https://core.telegram.org/bots/api#message) is returned, otherwise True is returned. Returns an error, if the new score is not greater than the user&#39;s current score in the chat and force is False. */
export class setGameScore implements Method {
    /** Name of this interface as a string */
    objectName = 'setGameScore'
    /** User identifier */
    user_id: number
    /** New score, must be non-negative */
    score: number
    /** Pass True, if the high score is allowed to decrease. This can be useful when fixing mistakes or banning cheaters */
    force?: boolean
    /** Pass True, if the game message should not be automatically edited to include the current scoreboard */
    disable_edit_message?: boolean
    /** Required if inline_message_id is not specified. Unique identifier for the target chat */
    chat_id?: number
    /** Required if inline_message_id is not specified. Identifier of the sent message */
    message_id?: number
    /** Required if chat_id and message_id are not specified. Identifier of the inline message */
    inline_message_id?: string

    constructor(user_id: number, score: number, force?: boolean, disable_edit_message?: boolean, chat_id?: number, message_id?: number, inline_message_id?: string) {
        this.user_id = user_id
        this.score = score
        this.force = force
        this.disable_edit_message = disable_edit_message
        this.chat_id = chat_id
        this.message_id = message_id
        this.inline_message_id = inline_message_id
    }
}

/** Use this method to get data for high score tables. Will return the score of the specified user and several of their neighbors in a game. On success, returns an Array of [GameHighScore](https://core.telegram.org/bots/api#gamehighscore) objects. */
export class getGameHighScores implements Method {
    /** Name of this interface as a string */
    objectName = 'getGameHighScores'
    /** Target user id */
    user_id: number
    /** Required if inline_message_id is not specified. Unique identifier for the target chat */
    chat_id?: number
    /** Required if inline_message_id is not specified. Identifier of the sent message */
    message_id?: number
    /** Required if chat_id and message_id are not specified. Identifier of the inline message */
    inline_message_id?: string

    constructor(user_id: number, chat_id?: number, message_id?: number, inline_message_id?: string) {
        this.user_id = user_id
        this.chat_id = chat_id
        this.message_id = message_id
        this.inline_message_id = inline_message_id
    }
}

/** This object represents one row of the high scores table for a game. */
export class GameHighScore implements Type {
    /** Name of this interface as a string */
    objectName = 'GameHighScore'
    /** Position in high score table for the game */
    position: number
    /** User */
    user: User
    /** Score */
    score: number

    constructor(position: number, user: User, score: number) {
        this.position = position
        this.user = user
        this.score = score
    }
}

