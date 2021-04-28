const TelegramBot = require('node-telegram-bot-api');
const token = '1758663651:AAGctyVmgb9I7C0zmyHa2VMMUpj2ARveNNQ';


const bot = new TelegramBot(token, {polling: true});
const img_url = 'https://talent2africa.com/wp-content/uploads/2020/03/carte-Afrique.jpg'
let t_username = '';
let u_email = '';
let e_wallet = '';

bot.onText(/\/start/, (msg) => {
    bot.sendPhoto(msg.chat.id, img_url, {caption: "Welcome to Domeno Airdrop! 😍😍 \nPlease join our community and get 100 token.\n \n "}).then(() => {
        let option = {
            "reply_markup": {
                "keyboard": [["1. Join NFT-QR Telegram Group", "2. Join NFT-QR Telegram Channel"], ["3. Your Twitter ID", "4. Your BSC wallet address (No exchange wallet!)"]]
            }
        };
        bot.sendMessage(msg.chat.id, "Airdrop Rules 🖼️🎨🔣️ \n 1️⃣   Join the NFT-QR Telegram chat group \n\n  2️⃣   Join the NFT-QR Telegram Channel \n\n  3️⃣   Follow on Twitter (https://twitter.com/safemoonfast) Like and Retweet pinned post also tag 3 friends  4️⃣   Enter your Twitter ID (@twuitter)  \n\n 5️⃣   Submit your BSC wallet address in the bot (No exchange wallet!) \n\n", option);
    })
})

bot.on('message', (msg) => {
    let send_text = msg.text;
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

    let step2_text = '2. Your Telegram Username';
    if (send_text.toString().indexOf(step2_text) === 0) {
        bot.sendMessage(msg.chat.id, "Please Enter Your Telegram Username (@username)")
    }

    if (send_text.toString().charAt(0) === '@') {
        t_username = send_text;
        bot.sendMessage(msg.chat.id, "Hello " + send_text);
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
    if (re_eth.test(send_text)) {
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
    }
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
        bot.sendMessage(msg.chat.id, "Good bye ✌️✌️");
    }
});