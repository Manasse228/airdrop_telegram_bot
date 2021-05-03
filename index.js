const TelegramBot = require('node-telegram-bot-api');
const UserService = require('./services/UserService');
const Utils = require('./config/Utils');
const {markdownv2} = require("telegram-format");

let bot = new TelegramBot(Utils.getTelegram_Token(), {polling: true});

//bot = new TelegramBot(Utils.getTelegram_Token());
//bot.setWebHook('https://airdrop-telegram-bot.herokuapp.com' + bot.token).then();
//let bot = new TelegramBot(Utils.getTelegram_Token(), {polling: true});
const img_url = 'https://talent2africa.com/wp-content/uploads/2020/03/carte-Afrique.jpg'


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

function presentation(msg) {
    let agree = {
        "reply_markup": {
            "keyboard": [["Continue"]], resize_keyboard: true
        },
        parse_mode: "Markdown"
    };
    bot.sendMessage(msg.chat.id, getUserCorectName(msg) + " ! I am your friendly " + botName + ". \n\n  " +
        "✅Please complete all the tasks and submit details correctly to be eligible for the airdrop campaign. \n\n " +
        " 🔸For Completing the tasks - Get 1000,000,000,000 NFTQR \n" +
        " 👫 For Each Valid Refer - Get 100,000,000,000 NFTQR \n\n " +
        "📘By Participating you are agreeing to the NFT-QR (Airdrop Campaign) Program Terms and Conditions. Please see pinned post for more information. \n\n" +
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
        "Your Submitted details: \n " +
        "--------------------------------------- \n " +
        "📨 " + markdownv2.bold(" Telegram: ") + getUserCorectName(msg) + " \n " +
        "🖼️ " + markdownv2.bold(" Twitter: ") + userInfo.twitterPseudo + " \n" +
        "📦 " + markdownv2.bold(" BEP-20 BSC wallet: ") + userInfo.wallet + " \n" +
        "\n\n" +
        markdownv2.italic("If your submitted data wrong then you can restart the bot and resubmit the data again by clicking /edit before airdrop end.");
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
    return (username) ? username : firstName + " " + lastName;
}

// -------------------------------------------------- Edit --------------------------------------------------
bot.onText(/\/edit/, (msg) => {

    let validTwitter = {
        "reply_markup": {
            "keyboard": [["📝 Done", "❌ Cancel"], ["🚪 Exit"]], resize_keyboard: true
        },
        parse_mode: "Markdown",
    }
    UserService.getUserByTelegramID(msg.from.id).then(_user => {
        let agree = {
            "reply_markup": {
                "keyboard": [["🐣 Twitter", "💳 Wallet"], ["🖍️ Submit"]], resize_keyboard: true
            },
            parse_mode: "Markdown"
        };
        bot.sendMessage(msg.chat.id, getUserCorectName(msg) + " I am your friendly " + botName + ". \n\n" +
            "You can only edit your " + markdownv2.bold("Twitter username") + " and your " + markdownv2.bold("Wallet address") + ". " +
            "Just send email to  \n\n ", agree).then();

        /*
            bot.on('message', (msg) => {
            let edit_text = msg.text;
            let editTwuitterPseudo = false;
            if (_user.step === 4) {

                if (edit_text === "🐣 Twitter") {
                    editTwuitterPseudo = true;
                    bot.sendMessage(msg.chat.id, "Your old twitter name " + markdownv2.escape(_user.twitterPseudo) + " \n\n  " +
                        "Enter your new twitter pseudo below 👇 \n\n ", validTwitter);
                }

                if (editTwuitterPseudo) {
                    if (re_twuitter.test(edit_text) && userInfo.step === 4) {
                        editTwuitterPseudo = false;
                        tuitter_username = send_text.trim();
                    } else {
                        if (!re_twuitter.test(edit_text) && !editTwuitterPseudo && send_text !== "❌ Cancel" && send_text !== "🚪 Exit" && send_text !== "🐣 Twitter" && send_text !== "Yes 🟢" && send_text !== "Cancel 🛑") {
                            bot.sendMessage(msg.chat.id, "Submit your Twitter username (Example: @nftToMoon) below", cancel());
                        }
                    }
                }

                if (edit_text === "❌ Cancel") {
                    editTwuitterPseudo = false;
                    bot.sendMessage(msg.chat.id, getUserCorectName(msg) + " I am your friendly " + botName + ". \n\n" +
                        "You can only edit your " + markdownv2.bold("Twitter username") + " and your " + markdownv2.bold("Wallet address") + " \n\n ", agree);
                }

                if (edit_text === "🚪 Exit") {
                    editTwuitterPseudo = false;
                    bot.sendMessage(msg.chat.id, showDetails(msg, _user), details());
                }
            }

        })
         */


    })
})


bot.on("polling_error", (err) => {
    //console.log("******* polling_error ******* ", err)
});

// -------------------------------------------------- Start --------------------------------------------------
bot.onText(/\/start/, (msg) => {

    if (msg.from.is_bot) {
        bot.sendMessage(msg.chat.id, "Bot are not allow here").then();
    } else {
        if (msg.from.id) {
            let telegramID = msg.from.id;
            UserService.register(msg, telegramID).then(_user => {
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

            bot.on('message', (msg) => {
                let send_text = msg.text;
                console.log('Message envoyé ', send_text, "User'ID ", telegramID)
                UserService.getUserByTelegramID(telegramID).then(userFirstStep => {

                    if (userFirstStep.step === 0 || userFirstStep.step === 1 || userFirstStep.step === 2) {

                        if (send_text === "Continue") {
                            bot.sendMessage(msg.chat.id, "Complete the tasks below! \n\n  " +
                                "🔹 Join telegram Group " + chatGroup + " and " + channel + " \n\n " +
                                "🔹 Follow on " + twitter_link + " Like and Retweet pinned post and also tag 3 friends \n\n" +
                                "*Click Submit Details to submit your details to verify whether you completed all the tasks or not.*", valid())
                                .then( _r => {
                                    bot = new TelegramBot(Utils.getTelegram_Token(), {polling: true})
                                });
                        }
                        // Submit details
                        if (send_text === "🖍️ Submit details") {
                            bot.sendMessage(msg.chat.id, "*Complete the tasks below!* \n\n  " +
                                "🔹 Join Telegram " + chatGroup + " \n\n " +
                                "🔹 Join Telegram " + channel, validTelegramTask()).then();
                        }
                        // check here it the user join channel group and chat group
                        if (send_text === "✅ Done") {
                            // Check if user enter telegram group

                            UserService.checUserOnChatOrChannel(userFirstStep).then(_resUser => {
                                console.log('_resUser ', userFirstStep)
                                let chatGroupMessage = (userFirstStep.telegramGroup) ? "" : "🔹 Join Telegram 👉" + chatGroup + " \n\n ";
                                let channelMessage = (userFirstStep.telegramChannel) ? "" : "🔹 Join Telegram 👉" + channel;

                                if (!userFirstStep.telegramGroup || !userFirstStep.telegramChannel) {
                                    bot.sendMessage(msg.chat.id, markdownv2.bold("Complete these tasks") + " \n\n  " +
                                        chatGroupMessage +
                                        channelMessage, validTelegramTask()).then();
                                } else {
                                    if (userFirstStep.step === 2) {
                                        previous_idChat_Twuitter = true;
                                        bot.sendMessage(msg.chat.id, "Complete the task below! \n\n  " +
                                            "🔹Follow on Twitter " + twitter_link + " Like 👍 and Retweet 🔁 pinned post also tag 3 friends  \n\n ").then();
                                        bot.sendMessage(msg.chat.id, "Submit your Twitter username (Example: @nftToMoon) below", cancel()).then();
                                    }
                                }
                            });
                        }
                        // ---------------------------------------------- check twitter account--------------------------------------------
                        if (re_twuitter.test(send_text) && userFirstStep.step === 2) {
                            tuitter_username = send_text.trim();
                            bot.sendMessage(msg.chat.id, 'Your twitter username ' + markdownv2.bold(send_text) + '  Confirm ❓', {
                                "reply_markup": {
                                    "keyboard": [
                                        [{"text": "Yes ✅"}],
                                        [{"text": "Cancel ❌"}]
                                    ],
                                    "resize_keyboard": true
                                },
                                parse_mode: "Markdown",
                            }).then()
                        } else {
                            if (!re_twuitter.test(send_text) && previous_idChat_Twuitter && send_text !== "✅ Done" && send_text !== "Continue" && send_text !== "🖍️ Submit details" && send_text !== "Cancel ❌" && send_text !== "Yes ✅") {
                                bot.sendMessage(msg.chat.id, "Submit your Twitter username (Example: @nftToMoon) below", cancel()).then();
                            }
                        }
                        if (send_text === "Cancel ❌") {
                            bot.sendMessage(msg.chat.id, "Submit your Twitter username (Example: @nftToMoon) below", cancel()).then();
                        }
                        if (send_text === "Yes ✅") {
                            UserService.getUserByTwitterpseudo(tuitter_username).then(_response => {
                                // This twitter account already used
                                if (_response) {
                                    bot.sendMessage(msg.chat.id, "This twitter account already used for this airdrop campaign. Put another account", valid()).then();
                                } else {
                                    // check if this twitter account follow us really
                                    UserService.setUserTwitterAndStep(userFirstStep.telegramID, tuitter_username, 3).then(_res => {
                                        previous_idChat_Twuitter = '';
                                        previous_idChat_wallet = msg.chat.id;
                                        userFirstStep = _res;
                                        bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
                                            markdownv2.bold("Note: (Recommended wallet to use: Trust wallet, Metamask) Do not submit BNB address from Exchange.") + "  \n\n ", cancel()).then();
                                    })
                                }
                            })
                        }

                    }

                    if (userFirstStep.step === 3) {
                        let re_wallet = Utils.getWalletRegex();
                        if (re_wallet.test(send_text)) {
                            wallet_public_address = send_text.trim();
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
                        } else {
                            if (!re_wallet.test(send_text) && send_text !== "Valid ✅" && send_text !== "Continue" && send_text !== "Cancel ❌") {
                                bot.sendMessage(msg.chat.id, markdownv2.bold("Your Binance Smart Chain (BSC) wallet address 🔑 format is not correct. Put the correct wallet") + "\n\n" +
                                    markdownv2.bold("Note: (Recommended wallet to use: Trust wallet, Metamask) Do not submit BNB address from Exchange.") + "  \n\n ", cancel()).then();
                            }
                        }

                        if (send_text === "Continue") {
                            bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
                                markdownv2.bold("Note: (Recommended wallet to use: Trust wallet, Metamask) Do not submit BNB address from Exchange.") + "  \n\n ", cancel()).then();
                        }

                        if (send_text === "Cancel ❌") {
                            bot.sendMessage(msg.chat.id, "Submit your " + markdownv2.bold("Bep20 BSC")
                                + " wallet address \n\n Note: Do not submit BNB address from Exchange.", cancel()).then();
                        }

                        if (send_text === "Valid ✅") {
                            UserService.getUserByWallet(wallet_public_address).then(_res => {
                                if (_res) {
                                    bot.sendMessage(msg.chat.id, "This wallet is already used on this airdrop campaign. Put another account").then();
                                    bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
                                        markdownv2.bold("Note: (Recommended wallet to use: Trust wallet, Metamask) Do not submit BNB address from Exchange.") + "  \n\n ", cancel()).then();
                                } else {
                                    UserService.setUserWalletAndStep(userFirstStep, wallet_public_address, 4).then(_r => {
                                        userFirstStep = _r;

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
                                    })
                                }
                            })
                        }

                    }

                    if (userFirstStep.step === 4) {
                        if (send_text === "📊 Statistics") {
                            UserService.getUserByTelegramID(telegramID).then(user => {
                                bot.sendMessage(msg.chat.id, showDetails(msg, user), details()).then();
                            })
                        }
                    }

                });


                if (send_text === "🔙 Back" || send_text === "Main Menu 🔝" || send_text === "🚫 Cancel") {
                    presentation(msg);
                }

            });
        } else {
            bot.sendMessage(msg.chat.id, "Your telegram account are not register well. Contact NFT-QR Airdrop Campaign team").then();
        }
    }

})

