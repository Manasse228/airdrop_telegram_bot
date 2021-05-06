const mongoConf = require('./../config/mongoDB');
const UserModel = require('./../models/user');

const request = require('request');

const Utils = require('../config/Utils');

module.exports = {

    // ---------------------------------------------- Register--------------------------------------------
    // Save user telegram id
    register: (msg, telegramID) => {
        return new Promise((resolve, reject) => {

            UserModel.getUserByTelegramID(telegramID).then(_user => {
                if (_user) {
                    resolve(_user);
                } else {
                    let parts = msg.text.split('/start');
                    let code = "";
                    if (parts.length >= 2 && parts[1].trim()) {
                        code = parts[1].trim();
                    }

                    let userName = (msg.from && msg.from.username) ? msg.from.username : "";
                    let firstName = (msg.from && msg.from.first_name) ? msg.from.first_name : "";
                    let lastName = (msg.from && msg.from.last_name) ? msg.from.last_name : "";

                    const userModelInstance = new UserModel();
                    userModelInstance.telegramID = telegramID;
                    userModelInstance.telegramUsername = userName;
                    userModelInstance.telegramFirst_name = firstName;
                    userModelInstance.telegramLast_name = lastName;
                    userModelInstance.amInvitedCode = code;
                    userModelInstance.save()
                        .then((_user) => {
                            resolve(_user);
                        })
                        .catch(err => {
                            resolve("");
                        });
                }
            })

        })
    },
    getUserByShareCode: (shareCode) => {
        return new Promise((resolve, reject) => {

            UserModel.getUserByShareCode(shareCode).then(_user => {
                resolve(_user);
            })

        })
    },
    // ---------------------------------------------- Step--------------------------------------------
    // Change user step
    setUserStep: (telegramID, step) => {
        return new Promise((resolve, reject) => {

            UserModel.setStep(telegramID, step).then(_res => {
                module.exports.getUserByTelegramID(telegramID).then(_user => {
                    resolve(_user);
                })
            })

        })
    },
    // ---------------------------------------------- Get user by telegram ID--------------------------------------------
    // get user info by telegramId
    getUserByTelegramID: (telegramID) => {
        return new Promise((resolve, reject) => {
            UserModel.getUserByTelegramID(telegramID).then(user => {
                resolve(user);
            })
        })
    },
    // ---------------------------------------------- twitter--------------------------------------------
    // Set user twitter name during register
    setUserTwitterAndStep: (telegramID, twitterName, step) => {
        return new Promise((resolve, reject) => {
            UserModel.setTwitterPseudoAndStep(telegramID, twitterName, step).then(_res => {
                module.exports.getUserByTelegramID(telegramID).then(_user => {
                    resolve(_user);
                })
            })
        })
    },
    // Set user twitter
    setUserTwitter: (telegramID, twitterName) => {
        return new Promise((resolve, reject) => {
            UserModel.setTwitterPseudoAndStep(telegramID, twitterName).then(_res => {
                module.exports.getUserByTelegramID(telegramID).then(_user => {
                    resolve(_user);
                })
            })
        })
    },
    // Get user by twitter pseudo
    getUserByTwitterpseudo: (twitterPseudo) => {
        return new Promise((resolve, reject) => {
            UserModel.getUserByTwitterPseudo(twitterPseudo).then(user => {
                resolve(user);
            })
        })
    },
    // ---------------------------------------------- wallet--------------------------------------------
    setUserWalletAndStep: (userInfo, wallet, step) => {
        return new Promise((resolve, reject) => {
            let code = Utils.getDigicode(6);
            let balance = Utils.getAirdropBalance();

            UserModel.setWalletAndStep(userInfo.telegramID, wallet, code, balance, step).then(_res => {
                module.exports.getUserByTelegramID(userInfo.telegramID).then(_user => {
                    module.exports.setReferalBonus(_user).then();
                    resolve(_user);
                })
            })
        })
    },
    setUserWallet: (telegramID, wallet) => {
        return new Promise((resolve, reject) => {

            UserModel.setWallet(telegramID, wallet).then(_res => {
                module.exports.getUserByTelegramID(telegramID).then(_user => {
                    resolve(_user);
                })
            })

        })
    },
    getUserByWallet: (wallet) => {
        return new Promise((resolve, reject) => {

            UserModel.getUserByWallet(wallet).then(user => {
                resolve(user);
            })

        })
    },
    setReferalBonus: (userInfo) => {
        return new Promise((resolve, reject) => {

            UserModel.getUserByShareCode(userInfo.amInvitedCode).then(_user => {
                if (_user) {
                    UserModel.addChild(_user.telegramID, _user.children + 1).then()
                }
            })
        })
    },
    // ---------------------------------------------- Chek on Telegram Group & Channel --------------------------------------------
    checUserOnChatOrChannel: (userInfo) => {
        // Chat group
        // https://api.telegram.org/bot1758663651:AAGctyVmgb9I7C0zmyHa2VMMUpj2ARveNNQ/promoteChatMember?chat_id=@nft_qr_Community&user_id=437546311
        //  channel
        // https://api.telegram.org/bot1758663651:AAGctyVmgb9I7C0zmyHa2VMMUpj2ARveNNQ/promoteChatMember?chat_id=@NFT_QR_OfficialChannel&user_id=437546311
        ///// let link = "https://api.telegram.org/bot"+token+"/promoteChatMember?chat_id="+groupId+"y&user_id="+telegramId;
        return new Promise((resolve, reject) => {
            let telegramID = userInfo;
            let link = "https://api.telegram.org/bot" + Utils.getNFT_QR_Inspector_Token() + "/promoteChatMember?chat_id=";
            let chatLink = link + Utils.getChatGroupId() + "&user_id=" + telegramID;
            let channelLink = link + Utils.getChannelId() + "&user_id=" + telegramID;
            let response = {chat: false, channel: false}

            request(chatLink, {json: true}, (err, res, body) => {
                if (body) {
                    response.chat = !!body.ok;
                    request(channelLink, {json: true}, (err, res, body) => {
                        if (body) {
                            response.channel = !!body.ok;
                            let step = (response.chat && response.channel) ? 2 : 1;

                            UserModel.setTelegramGroup(telegramID, response.chat, response.channel, step).then(_r => {
                                module.exports.getUserByTelegramID(telegramID).then(_user => {
                                    resolve(_user);
                                })
                            });

                        } else {
                            resolve(response);
                        }
                    });
                } else {
                    resolve(response);
                }
            });
        })
    }

}
