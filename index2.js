const TelegramBot = require('node-telegram-bot-api');
const token = '1758663651:AAGctyVmgb9I7C0zmyHa2VMMUpj2ARveNNQ';


const bot = new TelegramBot(token, {polling: true});
const img_url = 'https://talent2africa.com/wp-content/uploads/2020/03/carte-Afrique.jpg'
let t_username = '';
let u_email = '';
let e_wallet = '';

let tuitter_username = '';
let wallet_public_address = '';
let previous_idChat_Twuitter = '';
let previous_idChat_wallet = '';
let step = 1;
let validTwitterUsername = false;
let validWalletAddress = false;
let referal = 124583;


function presentation(msg) {
    let agree = {
        "reply_markup": {
            "keyboard": [["Continue"]], resize_keyboard: true
        }
    };
    bot.sendMessage(msg.chat.id, msg.from.username + "! I am your friendly NFT-QR Airdrop Bot. \n\n  " +
        "✅Please complete all the tasks and submit details correctly to be eligible for the airdrop. \n\n " +
        " 🔸For Completing the tasks - Get 100,000,000,000 NFTQR \n" +
        " 👫 For Each Valid Refer - Get 100,000,000 NFTQR \n\n " +
        "📘By Participating you are agreeing to the NFT-QR (Airdrop) Program Terms and Conditions. Please see pinned post for more information. \n\n" +
        'Click \*Continue* to proceed', agree);
}

function cancel() {
    return {
        "reply_markup": {
            "keyboard": [["🚫 Cancel"]], resize_keyboard: true
        }
    };
}

bot.onText(/\/start/, (msg) => {
    bot.sendPhoto(msg.chat.id, img_url, {caption: "Welcome to Domeno Airdrop! 😍😍 \nPlease join our community and get 100 token.\n \n "}).then(() => {
        let option = {
            "reply_markup": {
                "keyboard": [["1. Join NFT-QR Telegram Group", "2. Join NFT-QR Telegram Channel"], ["3. Your Twitter ID", "4. Your BSC wallet address (No exchange wallet!)"]],
                resize_keyboard: true
            }
        };
        presentation(msg);
    })


})

bot.on('message', (msg) => {
    let send_text = msg.text;
    console.log('send_text ', send_text)
    let step1_text = '1. Join the Domeno Telegram group'
    if (send_text.toString().indexOf(step1_text) === 0) {
        let text = 'Domeno Telegram Group';
        let keyboardStr = JSON.stringify({
            inline_keyboard: [
                [
                    {text: 'Join the chat', url: 'https://t.me/joinchat/FP5H8RIFast0BbjwqiO1_w'}
                ]
            ]
        });

        let keyboard = {reply_markup: JSON.parse(keyboardStr)};
        bot.sendMessage(msg.chat.id, text, keyboard);
    }

    if (send_text === "Continue") {
        let valid = {
            "reply_markup": {
                "keyboard": [["🖍️ Submit details"], ["🔙 Back", "Main Menu 🔝"]], resize_keyboard: true
            }
        };
        bot.sendMessage(msg.chat.id, "Complete the tasks below! \n\n  " +
            "🔹 Join telegram group (https://t.me/joinchat/b5vsF_JddNZhNjc8) and Channel (https://t.me/NFT_QR_OfficialChannel) \n\n " +
            "🔹 Follow on Twitter (https://twitter.com/safemoonfast) Like and Retweet pinned post also tag 3 friends \n\n" +
            "Click Submit Details to submit your details to verify whether you completed all the tasks or not.", valid);
    }

    if (send_text === "🔙 Back" || send_text === "Main Menu 🔝" || send_text === "🚫 Cancel") {
        presentation(msg);
    }

    if (send_text === "🖍️ Submit details") {
        let valid = {
            "reply_markup": {
                "keyboard": [["✅ Done"], ["🚫 Cancel"]], resize_keyboard: true
            }
        };
        bot.sendMessage(msg.chat.id, "Complete the tasks below! \n\n  " +
            "🔹 Join Telegram group (https://t.me/joinchat/b5vsF_JddNZhNjc8) \n\n " +
            "🔹 Join Telegram Channel (https://t.me/NFT_QR_OfficialChannel)", valid);
    }

    if (send_text === "✅ Done") {
        previous_idChat_Twuitter = msg.chat.id;
        bot.sendMessage(msg.chat.id, "Complete the tasks below! \n\n  " +
            "🔹Follow on Twitter (https://twitter.com/safemoonfast) Like and Retweet pinned post also tag 3 friends  \n\n ", cancel());
    }


    let re_twuitter = /(?![\s,.?\/()"\'()*+,-./:;<=>?@[\\]^_`{|}~])@[A-Za-z]\w*?\b/g
    if (re_twuitter.test(send_text) && step === 1) {
        tuitter_username = send_text.trim();
        validTwitterUsername = true;
        bot.sendMessage(msg.chat.id, 'Your twitter username:  ' + send_text + '  Confirm❓', {
            "reply_markup": {
                "keyboard": [
                    [{"text": "Yes ✅"}],
                    [{"text": "Cancel ❌"}]
                ],
                "resize_keyboard": true
            }
        })
    }
    if ((send_text === "Cancel ❌" || (!re_twuitter.test(send_text) && previous_idChat_Twuitter && !validTwitterUsername)) && step === 1) {
        validTwitterUsername = false;
        bot.sendMessage(msg.chat.id, "Submit your Twitter username (Example: @nftToMoon) below", cancel());
    }

    if (send_text === "Yes ✅" && step === 1) {
        previous_idChat_Twuitter = '';
        previous_idChat_wallet = msg.chat.id;
        step = 2;
        bot.sendMessage(msg.chat.id, "Submit your Binance Smart Chain (BSC) wallet address 🔑\n\n " +
            "Note: (Recommended wallet to use: Trust wallet, Metamask) Do not submit BNB address from Exchange.  \n\n ", cancel());
    }


    let re_wallet = /^0x[a-fA-F0-9]{40}$/g
    if (re_wallet.test(send_text) && step === 2) {
        wallet_public_address = send_text.trim();
        validWalletAddress = true;
        bot.sendMessage(msg.chat.id, "Your wallet's address :" + wallet_public_address + " Confirm❓", {
            reply_markup: {
                keyboard: [
                    [{"text": "Valid ✅"}],
                    [{"text": "Cancel ❌"}]
                ],
                resize_keyboard: true
            }
        })
    }

    if (send_text === "Valid ✅" && step === 2) {
        previous_idChat_wallet = '';
        validWalletAddress = true;
        let submit = {
            "reply_markup": {
                "keyboard": [["📊 Statistics"]], resize_keyboard: true
            }
        };
        step = 3;
        bot.sendMessage(msg.chat.id, "Thank you " + msg.from.username + " \n\n 🔗Your personal referral link: \n\n https://t.me/nftqr_bot?start=" + 124583 + " ", submit);

    }

    if ((send_text === "Cancel ❌" || (!re_wallet.test(send_text) && previous_idChat_wallet && !validWalletAddress)) && step === 2) {
        validWalletAddress = false;
        bot.sendMessage(msg.chat.id, "Submit your Bep20 BSC wallet address \n\n Note: Do not submit BNB address from Exchange.", cancel());
    }

    if (send_text === "📊 Statistics" && step > 2) {
        let submit = {
            "reply_markup": {
                "keyboard": [["📊 Statistics"], ["🔙 Back", "Main Menu 🔝"]], resize_keyboard: true
            }
        };
        bot.sendMessage(msg.chat.id, "Hi " + msg.from.username + " \n\n" +
            "  Your, Airdrop Balance: 5000000000 NFTQR  \n\n " +
            "Referral Balance: 0 NFT-QR \n " +
            "📎 Referral link: https://t.me/nftqr_bot?start=" + 124583 + " \n " +
            "👬 Referrals: 0 \n\n " +
            "Your Submitted details: \n " +
            "------------------- \n " +
            "Telegram: " + msg.from.username + " \n " +
            "Twitter: " + tuitter_username + " \n" +
            "BEP-20 BSC wallet:" + wallet_public_address + " \n" +
            "\n\n" +
            "If your submitted data wrong then you can restart the bot and resubmit the data again by clicking /start before airdrop end.", submit);
    }


    let step2_text = '2. Your Telegram Username';
    if (send_text.toString().indexOf(step2_text) === 0) {
        bot.sendMessage(msg.chat.id, "Please Enter Your Telegram Username (@username)")
    }

    if (send_text.toString().charAt(0) === '@') {
        t_username = send_text;
        //bot.sendMessage(msg.chat.id, "Hello " + send_text);
    }

    let step3_text = '3. E-mail address';
    if (send_text.toString().indexOf(step3_text) === 0) {
        bot.sendMessage(msg.chat.id, "Enter your email address")
    }

    let re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;

    if (re.test(send_text)) {
        u_email = send_text;
        bot.sendMessage(msg.chat.id, "Email address: " + send_text);
    }

    let step4_text = '4. ETH address (No exchange wallet!)';
    if (send_text.toString().indexOf(step4_text) === 0) {
        bot.sendMessage(msg.chat.id, "Make sure that you have an erc20 wallet (0x) 🔑")
    }
    let re_eth = /^0x[a-fA-F0-9]{40}$/g
    /*if (re_eth.test(send_text)) {
        e_wallet = send_text;
        bot.sendMessage(msg.chat.id, 'Confirm❓', {
            reply_markup: {
                keyboard: [
                    [{"text": "Yes ✅"}],
                    [{"text": "Cancel ❌"}]
                ],
                resize_keyboard: true
            }
        })
    }*/
    let confirm = 'Yes ✅';
    if (send_text.toString().indexOf(confirm) === 0) {
        let db = firebase.database().ref('Airdrop');
        db.child(e_wallet.toLocaleLowerCase()).once('value', snap => {
            if (!snap.exists()) {
                db.child(e_wallet.toLocaleLowerCase()).update({
                    telegram_username: t_username,
                    email: u_email,
                    wallet: e_wallet.toLocaleLowerCase(),
                    status: 'pending',
                    createAt: Date.now()
                }).then(() => {
                    bot.sendMessage(msg.chat.id, "Thank'you 🙏🙏 \n");
                    bot.sendMessage(msg.chat.id, `Telegram username: ${t_username} \n Email: ${u_email} \n Ethereum wallet: ${e_wallet} \n`).then(() => {
                        bot.sendMessage(msg.chat.id, "Check your account 👉 " + 'https://niawjunior.github.io/telegram-bot-airdrop.io/index.html?id=' + e_wallet.toLocaleLowerCase())

                    })
                }).catch((err) => {
                    console.log(err)
                })
            } else {
                bot.sendMessage(msg.chat.id, "This wallet is already in use")
            }
        })
    }
    let calcel = 'Cancel ❌';
    if (send_text.toString().indexOf(calcel) === 0) {
        //bot.sendMessage(msg.chat.id, "Good bye ✌️✌️");
    }
});