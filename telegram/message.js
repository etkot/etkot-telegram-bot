const EventEmitter = require('events');


class Message extends EventEmitter {
    constructor(messageData) {
        super();

        /**
         * Unique message identifier inside this chat
         * @type {number}
         */
        this.message_id = messageData.message_id;

        /**
         * Sender, empty for messages sent to channels
         * @type {User}
         */
        this.from = messageData.from;

        /**
         * Date the message was sent in Unix time
         * @type {number}
         */
        this.date = messageData.date;

        /**
         * Conversation the message belongs to
         * @type {Chat}
         */
        this.chat = messageData.chat;

        /**
         * For forwarded messages, sender of the original message
         * @type {User}
         */
        this.forward_from = messageData.forward_from;

        /**
         * For messages forwarded from channels, information about the original channel
         * @type {Chat}
         */
        this.forward_from_chat = messageData.forward_from_chat;

        /**
         * For messages forwarded from channels, identifier of the original message in the channel
         * @type {number}
         */
        this.forward_from_message_id = messageData.forward_from_message_id;

        /**
         * For messages forwarded from channels, signature of the post author if present
         * @type {string}
         */
        this.forward_signature = messageData.forward_signature;

        /**
         * Sender's name for messages forwarded from users who disallow adding a link to their account in forwarded messages
         * @type {string}
         */
        this.forward_sender_name = messageData.forward_sender_name;

        /**
         * For forwarded messages, date the original message was sent in Unix time
         * @type {number}
         */
        this.forward_date = messageData.forward_date;

        /**
         * For replies, the original message. Note that the Message object in this field will not contain further reply_to_message fields even if it itself is a reply.
         * @type {Message}
         */
        this.reply_to_message = messageData.reply_to_message;

        /**
         * Bot through which the message was sent
         * @type {User}
         */
        this.via_bot = messageData.via_bot;

        /**
         * Date the message was last edited in Unix time
         * @type {number}
         */
        this.edit_date = messageData.edit_date;

        /**
         * The unique identifier of a media message group this message belongs to
         * @type {string}
         */
        this.media_group_id = messageData.media_group_id;

        /**
         * Signature of the post author for messages in channels
         * @type {string}
         */
        this.author_signature = messageData.author_signature;

        /**
         * For text messages, the actual UTF-8 text of the message, 0-4096 characters
         * @type {string}
         */
        this.text = messageData.text;

        /**
         * For text messages, special entities like usernames, URLs, bot commands, etc. that appear in the text
         * @type {MessageEntity[]}
         */
        this.entities = messageData.entities;

        /**
         * Message is an animation, information about the animation. For backward compatibility, when this field is set, the document field will also be set
         * @type {Animation}
         */
        this.animation = messageData.animation;

        /**
         * Message is an audio file, information about the file
         * @type {Audio}
         */
        this.audio = messageData.audio;

        /**
         * Message is a general file, information about the file
         * @type {Document}
         */
        this.document = messageData.document;

        /**
         * Message is a photo, available sizes of the photo
         * @type {PhotoSize[]}
         */
        this.photo = messageData.photo;

        /**
         * Message is a sticker, information about the sticker
         * @type {Sticker}
         */
        this.sticker = messageData.sticker;

        /**
         * Message is a video, information about the video
         * @type {Video}
         */
        this.video = messageData.video;

        /**
         * Message is a video note, information about the video message
         * @type {VideoNote}
         */
        this.video_note = messageData.video_note;

        /**
         * Message is a voice message, information about the file
         * @type {Voice}
         */
        this.voice = messageData.voice;

        /**
         * Caption for the animation, audio, document, photo, video or voice, 0-1024 characters
         * @type {string}
         */
        this.caption = messageData.caption;

        /**
         * For messages with a caption, special entities like usernames, URLs, bot commands, etc. that appear in the caption
         * @type {MessageEntity[]}
         */
        this.caption_entities = messageData.caption_entities;

        /**
         * Message is a shared contact, information about the contact
         * @type {Contact}
         */
        this.contact = messageData.contact;

        /**
         * Message is a dice with random value from 1 to 6
         * @type {Dice}
         */
        this.dice = messageData.dice;

        /**
         * Message is a game, information about the game
         * @type {Game}
         */
        this.game = messageData.game;

        /**
         * Message is a native poll, information about the poll
         * @type {Poll}
         */
        this.poll = messageData.poll;

        /**
         * Message is a venue, information about the venue. For backward compatibility, when this field is set, the location field will also be set
         * @type {Venue}
         */
        this.venue = messageData.venue;

        /**
         * Message is a shared location, information about the location
         * @type {Location}
         */
        this.location = messageData.location;

        /**
         * New members that were added to the group or supergroup and information about them (the bot itself may be one of these members)
         * @type {User[]}
         */
        this.new_chat_members = messageData.new_chat_members;

        /**
         * A member was removed from the group, information about them (this member may be the bot itself)
         * @type {User}
         */
        this.left_chat_member = messageData.left_chat_member;

        /**
         * A chat title was changed to this value
         * @type {string}
         */
        this.new_chat_title = messageData.new_chat_title;

        /**
         * A chat photo was change to this value
         * @type {PhotoSize[]}
         */
        this.new_chat_photo = messageData.new_chat_photo;

        /**
         * Service message: the chat photo was deleted
         * @type {boolean}
         */
        this.delete_chat_photo = messageData.delete_chat_photo;

        /**
         * Service message: the group has been created
         * @type {boolean}
         */
        this.group_chat_created = messageData.group_chat_created;

        /**
         * Service message: the supergroup has been created
         * @type {boolean}
         */
        this.supergroup_chat_created = messageData.supergroup_chat_created;

        /**
         * Service message: the channel has been created
         * @type {boolean}
         */
        this.channel_chat_created = messageData.channel_chat_created;

        /**
         * The group has been migrated to a supergroup with the specified identifier
         * @type {number}
         */
        this.migrate_to_chat_id = messageData.migrate_to_chat_id;

        /**
         * The supergroup has been migrated from a group with the specified identifier
         * @type {number}
         */
        this.migrate_from_chat_id = messageData.migrate_from_chat_id;

        /**
         * Specified message was pinned. Note that the Message object in this field will not contain further reply_to_message fields even if it is itself a reply.
         * @type {Message}
         */
        this.pinned_message = messageData.pinned_message;

        /**
         * Message is an invoice for a payment, information about the invoice
         * @type {Invoice}
         */
        this.invoice = messageData.invoice;

        /**
         * Message is a service message about a successful payment, information about the payment
         * @type {SuccessfulPayment}
         */
        this.successful_payment = messageData.successful_payment;

        /**
         * The domain name of the website on which the user has logged in
         * @type {string}
         */
        this.connected_website = messageData.connected_website;

        /**
         * Telegram Passport data
         * @type {PassportData}
         */
        this.passport_data = messageData.passport_data;

        /**
         * Inline keyboard attached to the message
         * @type {InlineKeyboardMarkup}
         */
        this.reply_markup = messageData.reply_markup;
    }
}

module.exports = Message;
