const TelegramBot = require('node-telegram-bot-api');
const UserService = require('./services/UserService');
const Utils = require('./config/Utils');
const {markdownv2} = require("telegram-format");
const _ = require('lodash');

const bot = new TelegramBot(Utils.getTelegram_Token(), {polling: true});

//let bot = new TelegramBot(Utils.getTelegram_Token());
//bot.setWebHook('https://www.bot.nft-qr.com' + bot.token).then();
//bot.setWebHook("https://api.telegram.org/bot1723060413:AAE6GBN7o7pbF6_CrNExX3gOXQEE2kgAtNw/setWebhook?url=https://www.bot.nft-qr.com").then();
const img_url = 'http://preprod.nft-qr.com/files/noir.png'

//https://api.telegram.org/bot1723060413:AAE6GBN7o7pbF6_CrNExX3gOXQEE2kgAtNw/setWebhook?url=https://www.bot.nft-qr.com


let chatGroup = markdownv2.url('chat group', 'https://t.me/joinchat/b5vsF_JddNZhNjc8');
let channel = markdownv2.url('channel', 'https://t.me/NFT_QR_OfficialChannel');
let twitter_link = markdownv2.url('twitter', 'https://twitter.com/nft_qr_code');
let referalLink = "https://t.me/nftqr_airdrop_bot?start=";
let botName = "NFT-QR Airdrop Campaign Bot";
let re_twuitter = Utils.getTwuitterRegex();


let tuitter_username = '';
let wallet_public_address = '';
let previous_idChat_Twuitter = '';
let previous_idChat_wallet = '';

const submitWalletMessage = "Note: (Recommended wallet to use: Trust wallet, Metamask, Personal wallet) Do not submit BNB address from Exchange.";
const submitTwitterMessage = "Submit your Twitter username (e.g. @nft_streetArt) below";

function presentation(msg) {
    let agree = {
        "reply_markup": {
            "keyboard": [["Continue"]], resize_keyboard: true
        },
        parse_mode: "Markdown"
    };
    bot.sendMessage(msg.chat.id, getUserCorectName(msg) + " ! I am your friendly " + botName + ". \n\n  " +
        "✅ Please complete all tasks and submit details correctly to be eligible for the airdrop campaign. \n\n " +
        "🔸 For Completing the tasks - Get 1 000,000,000,000 NFTQR \n" +
        "👫 For Each Valid Refer - Get 10,000,000,000 NFTQR \n\n " +
        "📘 By Participating you are agreeing to the NFT-QR (Airdrop Campaign) Program Terms and Conditions. Please see pinned post for more informations on Telegram Channel. \n\n" +
        'Click *Continue* to proceed', agree).then();
}

function cancel() {
    return {
        "reply_markup": {
            "keyboard": [["🚫 Cancel"]], resize_keyboard: true
        },
        parse_mode: "Markdown",
    };
}

function valid() {
    return {
        parse_mode: "Markdown",
        "reply_markup": {
            "keyboard": [["🖍️ Submit details"], ["🔙 Back", "Main Menu 🔝"]], resize_keyboard: true
        }
    };
}

function validTelegramTask() {
    return {
        "reply_markup": {
            "keyboard": [["✅ Done"], ["🚫 Cancel"]], resize_keyboard: true
        },
        parse_mode: "Markdown",
    }
}


function showDetails(msg, userInfo) {
    return "Hi " + getUserCorectName(msg) + " \n\n" +
        "💰 " + markdownv2.bold(" Your Airdrop Balance: ") + Utils.formatNumber(userInfo.balance) + " NFT-QR  \n" +
        "📃 " + markdownv2.bold(" Referral Balance: ") + Utils.getChildrenBalance(userInfo) + " NFT-QR \n " +
        "📎 " + markdownv2.bold(" Referral link: ") + markdownv2.bold(referalLink + userInfo.shareCode) + " \n " +
        "👬 " + markdownv2.bold(" Referrals: ") + userInfo.children + " \n\n " +
        "Your submitted details: \n " +
        "--------------------------------------- \n " +
        "📨 " + markdownv2.bold(" Telegram: ") + getUserCorectName(msg) + " \n " +
        "🖼️ " + markdownv2.bold(" Twitter: ") + userInfo.twitterPseudo + " \n" +
        "📦 " + markdownv2.bold(" BEP-20 BSC wallet: ") + userInfo.wallet + " \n" +
        "\n\n" +
        markdownv2.italic("If your submitted wrong data then you can restart the bot by clicking /edit before airdrop campaign end.");
}

function details() {
    return {
        "reply_markup": {
            "keyboard": [["📊 Statistics"]], resize_keyboard: true
        },
        parse_mode: "Markdown",
    };
}

function getUserCorectName(msg) {
    let username = (msg.from.username) ? markdownv2.escape(msg.from.username) : "";
    let firstName = (msg.from.first_name) ? markdownv2.escape(msg.from.first_name) : "";
    let lastName = (msg.from.last_name) ? markdownv2.escape(msg.from.last_name) : "";
    return (firstName || lastName) ? firstName + " " + lastName : username;
}

// -------------------------------------------------- Edit --------------------------------------------------
bot.onText(/\/edit/, (msg) => {
    UserService.getUserByTelegramID(msg.from.id).then(_user => {
        bot.sendMessage(msg.chat.id, markdownv2.bold(getUserCorectName(msg)) + "   I am your friendly " + botName + ". \n\n" +
            "You can only edit your " + markdownv2.bold("Twitter username") + " and your " + markdownv2.bold("Wallet address") + ". " +
            "Just send email to " + markdownv2.bold("airdrop@nft-qr.com") +
            " with your old and new Twitter username with Wallet address  \n\n ", {parse_mode: "Markdown"}).then();
    })
})


bot.on("polling_error", (err) => {
});

// -------------------------------------------------- Start --------------------------------------------------

let tabs = [];

function unity(userId, chatId) {
    if (tabs.find(item => item.id === userId && item.messageId === chatId)) {
        return false;
    } else {
        tabs.push({id: userId, messageId: chatId});
        return true;
    }
}

function deleteById(id, msgId) {
    tabs = _.remove(tabs, (n) => {
        return n.id !== id;
    });
    tabs.push({id: id, messageId: msgId});
}

bot.onText(/\/start/, (msg) => {

    if (msg.from.is_bot) {
        bot.sendMessage(msg.chat.id, "Bot are not allow here").then();
    } else {
        if (msg.from.id) {
            UserService.register(msg, msg.from.id).then(_user => {
                bot.sendPhoto(msg.chat.id, img_url, {
                    caption: "Welcome to " + botName + " ! 😍😍 \nPlease join our community and get " + markdownv2.bold("10 000 000 000 token") + " .\n\n",
                    parse_mode: "Markdown"
                }).then(() => {
                    if (_user.step === 4) {
                        bot.sendMessage(msg.chat.id, showDetails(msg, _user), details()).then();
                    } else {
                        presentation(msg);
                    }
                })
            })

            bot.on('message', async (msg) => {
                let send_text = msg.text;
                console.log('Message envoyé ', send_text, "User'ID ", msg.from.id)
                UserService.getUserByTelegramID(msg.from.id).then(userFirstStep => {

                    if (userFirstStep && (userFirstStep.step === 0 || userFirstStep.step === 1 || userFirstStep.step === 2)) {

                        if (send_text === "Continue") {
                            if (unity(msg.from.id, msg.message_id)) {
                                bot.sendMessage(msg.chat.id, "Complete the tasks below! \n\n  " +
                                    "🔹 Join telegram Group " + chatGroup + " and " + channel + " \n\n " +
                                    "🔹 Follow " + twitter_link + " , Like and Retweet pinned post and also tag 3 friends \n\n" +
                                    "Click " + markdownv2.bold("Submit Details") + " below to verify whether you completed all the tasks or not.", valid())
                                    .then();
                            }

                        }
                        // Submit details
                        if (send_text === "🖍️ Submit details") {
                            console.log('msg.chat.id ', msg.chat.id);
                            if (unity(msg.from.id, msg.message_id)) {
                                bot.sendMessage(msg.chat.id, markdownv2.bold("Complete the tasks below!") + " \n\n  " +
                                    "🔹 Join Telegram " + chatGroup + " \n\n " +
                                    "🔹 Join Telegram " + channel, validTelegramTask()).then();
                            }

                        }
                        // check here it the user join channel group and chat group
                        if (send_text === "✅ Done") {
                            // Check if user enter telegram group

                            UserService.checUserOnChatOrChannel(msg.from.id).then(_resUser => {

                                if (_resUser) {
                                    let chatGroupMessage = (_resUser.telegramGroup) ? "" : "🔹 Join Telegram 👉" + chatGroup + " \n\n ";
                                    let channelMessage = (_resUser.telegramChannel) ? "" : "🔹 Join Telegram 👉" + channel;

                                    if (!_resUser.telegramGroup || !_resUser.telegramChannel) {
                                        if (unity(msg.from.id, msg.message_id)) {
                                            bot.sendMessage(msg.chat.id, markdownv2.bold("Complete these tasks") + " \n\n  " +
                                                chatGroupMessage +
                                                channelMessage, validTelegramTask()).then();
                                        }
                                    } else {
                                        if (_resUser.step === 2) {
                                            previous_idChat_Twuitter = true;
                                            console.log('msg.chat.id ', msg.chat.id);
                                            if (unity(msg.from.id, msg.message_id)) {
                                                bot.sendMessage(msg.chat.id, "Complete the task below! \n\n  " +
                                                    "🔹Follow on Twitter " + twitter_link + " Like 👍 and Retweet 🔁 pinned post also tag 3 friends  \n\n ").then();
                                                bot.sendMessage(msg.chat.id, submitTwitterMessage, cancel()).then();
                                            }

                                        }
                                    }
                                }

                            });
                        }
                        // ---------------------------------------------- check twitter account--------------------------------------------
                        if (re_twuitter.test(send_text) && userFirstStep.step === 2) {
                            tuitter_username = send_text.trim();
                            if (unity(msg.from.id, msg.message_id)) {
                                bot.sendMessage(msg.chat.id, 'Your twitter username ' + markdownv2.bold(send_text) + ' Confirm ❓', {
                                    "reply_markup": {
                                        "keyboard": [
                                            [{"text": "Yes ✅"}],
                                            [{"text": "Cancel ❌"}]
                                        ],
                                        "resize_keyboard": true
                                    },
                                    parse_mode: "Markdown",
                                }).then()
                            }

                        } else {
                            if (!re_twuitter.test(send_text) && previous_idChat_Twuitter && send_text !== "✅ Done" && send_text !== "Continue" && send_text !== "🖍️ Submit details" && send_text !== "Cancel ❌" && send_text !== "Yes ✅") {
                                if (unity(msg.from.id, msg.message_id)) {
                                    bot.sendMessage(msg.chat.id, submitTwitterMessage, cancel()).then();
                                }
                            }
                        }
                        if (send_text === "Cancel ❌") {
                            if (unity(msg.from.id, msg.message_id)) {
                                bot.sendMessage(msg.chat.id, submitTwitterMessage, cancel()).then();
                            }
                        }
                        if (send_text === "Yes ✅") {
                            UserService.getUserByTwitterpseudo(tuitter_username).then(_response => {
                                // This twitter account already used
                                if (_response) {
                                    if (unity(msg.from.id, msg.message_id)) {
                                        bot.sendMessage(msg.chat.id, "This twitter account already used for this airdrop campaign.Put another account", valid()).then();
                                    }
                                } else {
                                    // check if this twitter account follow us really
                                    UserService.setUserTwitterAndStep(userFirstStep.telegramID, tuitter_username, 3).then(_res => {
                                        previous_idChat_Twuitter = '';
                                        previous_idChat_wallet = msg.chat.id;
                                        userFirstStep = _res;
                                        if (unity(msg.from.id, msg.message_id)) {
                                            bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
                                                markdownv2.bold(submitWalletMessage) +
                                                "  \n\n ", cancel()).then();
                                        }
                                    })
                                }
                            })
                        }

                    }

                    UserService.getUserByTelegramID(msg.from.id).then(userFirstStep => {

                        if (userFirstStep && userFirstStep.step === 3) {
                            let re_wallet = Utils.getWalletRegex();
                            if (re_wallet.test(send_text)) {
                                wallet_public_address = send_text.trim();
                                if (unity(msg.from.id, msg.message_id)) {
                                    bot.sendMessage(msg.chat.id, "Your wallet's address : " + markdownv2.bold(wallet_public_address) + " Confirm❓", {
                                        reply_markup: {
                                            keyboard: [
                                                [{"text": "Valid ✅"}],
                                                [{"text": "Cancel ❌"}]
                                            ],
                                            resize_keyboard: true
                                        },
                                        parse_mode: "Markdown",
                                    }).then()
                                }
                            } else {
                                if (!re_wallet.test(send_text) && send_text !== "Valid ✅" && send_text !== "Continue" && send_text !== "Cancel ❌") {
                                    if (unity(msg.from.id, msg.message_id)) {
                                        bot.sendMessage(msg.chat.id, markdownv2.bold("Your Binance Smart Chain (BSC) wallet address 🔑 format is not correct. Put the correct wallet") + "\n\n" +
                                            markdownv2.bold(submitWalletMessage) +
                                            "  \n\n ", cancel()).then();
                                    }
                                }
                            }

                            if (send_text === "Continue") {
                                if (unity(msg.from.id, msg.message_id)) {
                                    bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
                                        markdownv2.bold(submitWalletMessage) + "  \n\n ", cancel()).then();
                                }
                            }

                            if (send_text === "Cancel ❌") {
                                if (unity(msg.from.id, msg.message_id)) {
                                    bot.sendMessage(msg.chat.id, "Submit your " + markdownv2.bold("Bep20 BSC")
                                        + " wallet address \n\n Note: Do not submit BNB address from Exchange.", cancel()).then();
                                }
                            }

                            if (send_text === "Valid ✅") {
                                UserService.getUserByWallet(wallet_public_address).then(_res => {
                                    if (_res) {
                                        if (unity(msg.from.id, msg.message_id)) {
                                            bot.sendMessage(msg.chat.id, "This wallet address is already used on this airdrop campaign. Put another wallet address").then();
                                            bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
                                                markdownv2.bold(submitWalletMessage) + "  \n\n ", cancel()).then();
                                        }
                                    } else {
                                        UserService.setUserWalletAndStep(userFirstStep, wallet_public_address, 4).then(_r => {
                                            userFirstStep = _r;

                                            if (unity(msg.from.id, msg.message_id)) {
                                                bot.sendMessage(msg.chat.id, "To receive token during airdop distribution you must :" +
                                                    " \n\n Stay on Telegram Group and Channel" +
                                                    " \n\n Still follow us on twitter account" +
                                                    " \n\n Have at least 0.001 BNB on your wallet").then();
                                                bot.sendMessage(msg.chat.id, "Thank you " + getUserCorectName(msg) + "" +
                                                    " \n\n 🔗 Your personal referral link: " +
                                                    "\n\n " + markdownv2.monospace(referalLink + userFirstStep.shareCode) + " ", details()).then();

                                                if (userFirstStep.amInvitedCode) {
                                                    UserService.getUserByShareCode(userFirstStep.amInvitedCode).then(parent => {
                                                        if (parent) {
                                                            bot.sendMessage(parent.telegramID, "💰 " + getUserCorectName(msg) + " 💰 have joined " +
                                                                markdownv2.bold("NFT-QR") + " airdrop campaign.", {parse_mode: "Markdown",}).then();

                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }
                                })
                            }

                        }

                        if (userFirstStep && userFirstStep.step === 4) {
                            if (send_text === "📊 Statistics") {
                                UserService.getUserByTelegramID(msg.from.id).then(user => {
                                    if (unity(msg.from.id, msg.message_id)) {
                                        bot.sendMessage(msg.chat.id, showDetails(msg, user), details()).then();
                                        deleteById(msg.from.id, msg.message_id);
                                    }

                                })
                            }
                        }

                    });

                });


                if (send_text === "🔙 Back" || send_text === "Main Menu 🔝" || send_text === "🚫 Cancel") {
                    if (unity(msg.from.id, msg.message_id)) {
                        presentation(msg);
                    }
                }

            });

        } else {
            if (unity(msg.from.id, msg.message_id)) {
                bot.sendMessage(msg.chat.id, "Your telegram account are not register well. Contact NFT-QR Airdrop Campaign team").then();
            }

        }
    }

    /*
    0 => Init
    1 => Telegram Group
    2 => Telegram Channel
    3 => Twitter
    4 => Wallet Bsc
    */

})







