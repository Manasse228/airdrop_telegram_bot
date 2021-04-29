const TelegramBot = require('node-telegram-bot-api');
const token = '1758663651:AAGctyVmgb9I7C0zmyHa2VMMUpj2ARveNNQ';


const bot = new TelegramBot(token, {polling: true});
const img_url = 'https://talent2africa.com/wp-content/uploads/2020/03/carte-Afrique.jpg'

const UserService = require('./services/UserService');
const {markdownv2} = require("telegram-format");

let chatGroup = markdownv2.url('chat group', 'https://t.me/joinchat/b5vsF_JddNZhNjc8');
let channel = markdownv2.url('channel', 'https://t.me/NFT_QR_OfficialChannel');
let twitter_link = markdownv2.url('twitter', 'https://twitter.com/safemoonfast');
let referalLink = "https://t.me/nftqr_bot?start=";
let userInfo = null;

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
    bot.sendMessage(msg.chat.id, markdownv2.bold(msg.from.username) + " ! I am your friendly NFT-QR Airdrop Bot. \n\n  " +
        "✅Please complete all the tasks and submit details correctly to be eligible for the airdrop. \n\n " +
        " 🔸For Completing the tasks - Get 100,000,000,000 NFTQR \n" +
        " 👫 For Each Valid Refer - Get 100,000,000 NFTQR \n\n " +
        "📘By Participating you are agreeing to the NFT-QR (Airdrop) Program Terms and Conditions. Please see pinned post for more information. \n\n" +
        'Click *Continue* to proceed', agree);
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

function details() {
    return {
        "reply_markup": {
            "keyboard": [["📊 Statistics"]], resize_keyboard: true
        },
        parse_mode: "Markdown",
    };
}

bot.onText(/\/start/, (msg) => {
    if (msg.from.is_bot) {
        bot.sendMessage(msg.chat.id, "Bot are not allow here");
    } else {
        UserService.register(msg.from.id, msg.from.username, msg.from.first_name, msg.from.last_name).then(_user => {
            userInfo = _user;
            bot.sendPhoto(msg.chat.id, img_url, {
                caption: "Welcome to NFT-QR Airdrop! 😍😍 \nPlease join our community and get " + markdownv2.bold("10000000000 token") + " .\n\n",
                parse_mode: "Markdown"
            }).then(() => {

                if (userInfo.step === 4) {
                    bot.sendMessage(msg.chat.id, markdownv2.bold(msg.from.username) + " ! Already register. \n\n  " +
                        'Click *Continue* to proceed', details());
                } else {
                    presentation(msg);
                }
            })

            bot.on('message', (msg) => {
                let send_text = msg.text;
                console.log('send_text ', send_text)

                if (userInfo.step === 0 || userInfo.step === 1 || userInfo.step === 2) {
                    // Continue
                    if (send_text === "Continue") {
                        bot.sendMessage(msg.chat.id, "Complete the tasks below! \n\n  " +
                            "🔹 Join telegram Group " + chatGroup + " and " + channel + " \n\n " +
                            "🔹 Follow on " + twitter_link + " Like and Retweet pinned post and also tag 3 friends \n\n" +
                            "*Click Submit Details to submit your details to verify whether you completed all the tasks or not.*", valid());
                    }
                    // Submit details
                    if (send_text === "🖍️ Submit details") {
                        let valid = {
                            "reply_markup": {
                                "keyboard": [["✅ Done"], ["🚫 Cancel"]], resize_keyboard: true
                            },
                            parse_mode: "Markdown",
                        };
                        bot.sendMessage(msg.chat.id, "*Complete the tasks below!* \n\n  " +
                            "🔹 Join Telegram " + chatGroup + " \n\n " +
                            "🔹 Join Telegram " + channel, valid);
                    }
                    // check here it the user join channel group and chat group
                    if (send_text === "✅ Done") {
                        // Check if user enter telegram group
                        UserService.setUserStep(userInfo.telegramID, 2).then(_user => {
                            userInfo = _user;
                            // check if user enter telegram channel
                            if (userInfo.step === 2) {
                                previous_idChat_Twuitter = msg.chat.id;
                                bot.sendMessage(msg.chat.id, "Complete the task below! \n\n  " +
                                    "🔹Follow on Twitter " + twitter_link + " Like 👍 and Retweet 🔁 pinned post also tag 3 friends  \n\n ", cancel());
                            } else {
                                bot.sendMessage(msg.chat.id, "These tasks are mandatory! \n\n  " +
                                    "🔹 Join telegram Group " + chatGroup + " and " + channel + " \n\n " +
                                    "*Submit Details to submit your details to verify whether you completed all the tasks or not.*", valid());
                            }
                        })
                    }
                    // ---------------------------------------------- check twitter account--------------------------------------------
                    let re_twuitter = /(?![\s,.?\/()"\'()*+,-./:;<=>?@[\\]^_`{|}~])@[A-Za-z]\w*?\b/g
                    if (re_twuitter.test(send_text) && userInfo.step === 2) {
                        tuitter_username = send_text.trim();
                        bot.sendMessage(msg.chat.id, 'Your twitter username:  ' + markdownv2.bold(send_text) + '  Confirm❓', {
                            "reply_markup": {
                                "keyboard": [
                                    [{"text": "Yes ✅"}],
                                    [{"text": "Cancel ❌"}]
                                ],
                                "resize_keyboard": true
                            },
                            parse_mode: "Markdown",
                        })
                    }
                    if ((send_text === "Cancel ❌" || (!re_twuitter.test(send_text) && previous_idChat_Twuitter)) && userInfo.step === 2) {
                        bot.sendMessage(msg.chat.id, "Submit your Twitter username (Example: @nftToMoon) below", cancel());
                    }
                    if (send_text === "Yes ✅" && userInfo.step === 2) {
                        UserService.getUserByTwitterpseudo(tuitter_username).then(_response => {
                            // This twitter account already used
                            if (_response) {
                                bot.sendMessage(msg.chat.id, "This twitter account already used on this airdrop. Put another account", valid());
                            } else {
                                // check if this twitter account follow us really
                                UserService.setUserTwitterAndStep(userInfo.telegramID, tuitter_username, 3).then(_res => {
                                    previous_idChat_Twuitter = '';
                                    previous_idChat_wallet = msg.chat.id;
                                    userInfo = _res;
                                    bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
                                        markdownv2.bold("Note: (Recommended wallet to use: Trust wallet, Metamask) Do not submit BNB address from Exchange.") + "  \n\n ", cancel());
                                })
                            }
                        })
                    }


                }

                if (userInfo.step === 3) {
                    let re_wallet = /^0x[a-fA-F0-9]{40}$/g;

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
                        })
                    } else {
                        if (!re_wallet.test(send_text) && send_text !== "Valid ✅" && send_text !== "Continue" && send_text !== "Cancel ❌") {
                            bot.sendMessage(msg.chat.id, markdownv2.bold("Your Binance Smart Chain (BSC) wallet address 🔑 format is not correct. Put the correct wallet") + "\n\n" +
                                markdownv2.bold("Note: (Recommended wallet to use: Trust wallet, Metamask) Do not submit BNB address from Exchange.") + "  \n\n ", cancel());
                        }
                    }

                    if (send_text === "Continue") {
                        bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
                            markdownv2.bold("Note: (Recommended wallet to use: Trust wallet, Metamask) Do not submit BNB address from Exchange.") + "  \n\n ", cancel());
                    }

                    if (send_text === "Cancel ❌") {
                        bot.sendMessage(msg.chat.id, "Submit your " + markdownv2.bold("Bep20 BSC") + " wallet address \n\n Note: Do not submit BNB address from Exchange.", cancel());
                    }

                    if (send_text === "Valid ✅") {
                        UserService.getUserByWallet(wallet_public_address).then(_res => {
                            if (_res) {
                                bot.sendMessage(msg.chat.id, "This wallet is already used on this airdrop. Put another account");
                                bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
                                    markdownv2.bold("Note: (Recommended wallet to use: Trust wallet, Metamask) Do not submit BNB address from Exchange.") + "  \n\n ", cancel());
                            } else {
                                UserService.setUserWalletAndStep(userInfo.telegramID, wallet_public_address, 4).then(_r => {
                                    userInfo = _r;
                                    bot.sendMessage(msg.chat.id, "Thank you " + markdownv2.bold(msg.from.username) + "" +
                                        " \n\n 🔗Your personal referral link: " +
                                        "\n\n " + markdownv2.monospace(referalLink + userInfo.shareCode) + " ", details());
                                })
                            }
                        })
                    }

                }


                if (userInfo.step === 4) {
                    if (send_text === "📊 Statistics") {
                        let submit = {
                            "reply_markup": {
                                "keyboard": [["📊 Statistics"], ["🔙 Back", "Main Menu 🔝"]], resize_keyboard: true
                            },
                            parse_mode: "Markdown"
                        };
                        bot.sendMessage(msg.chat.id, "Hi " + markdownv2.bold(msg.from.username) + " \n\n" +
                            "💰 " + markdownv2.bold("Your, Airdrop Balance:") + userInfo.balance + " NFT-QR  \n" +
                            "📃 " + markdownv2.bold("Referral Balance:") + userInfo.children + " NFT-QR \n " +
                            "📎 " + markdownv2.bold(" Referral link:") + referalLink + userInfo.shareCode + " \n " +
                            "👬 " + markdownv2.bold(" Referrals:") + userInfo.children + " \n\n " +
                            "Your Submitted details: \n " +
                            "------------------- \n " +
                            "Telegram: " + msg.from.telegramFirst_name + " " + msg.from.telegramLast_name + " \n " +
                            "Twitter: " + userInfo.twitterPseudo + " \n" +
                            "BEP-20 BSC wallet:" + userInfo.wallet + " \n" +
                            "\n\n" +
                            markdownv2.monospaceBlock("If your submitted data wrong then you can restart the bot and resubmit the data again by clicking /start before airdrop end."), submit);
                    }
                }


                if (send_text === "🔙 Back" || send_text === "Main Menu 🔝" || send_text === "🚫 Cancel") {
                    presentation(msg);
                }


                /*
                        bot.sendMessage(msg.chat.id, "Hi " + msg.from.username + " \n\n" +
                        "💰 " + markdownv2.bold("Your, Airdrop Balance:") + " 5000000000 NFTQR  \n\n " +
                        "📃 " + markdownv2.bold("Referral Balance:") + " 0 NFT-QR \n " +
                        "📎 " + markdownv2.bold(" Referral link:") + referalLink + 124583 + " \n " +
                        "👬 " + markdownv2.bold(" Referrals:") + " 0 \n\n " +
                        "Your Submitted details: \n " +
                        "------------------- \n " +
                        "Telegram: " + msg.from.username + " \n " +
                        "Twitter: " + tuitter_username + " \n" +
                        "BEP-20 BSC wallet:" + wallet_public_address + " \n" +
                        "\n\n" +
                        markdownv2.italic("If your submitted data wrong then you can restart the bot and resubmit the data again by clicking /start before airdrop end."), submit);
                 */

            });
        })


    }

})

