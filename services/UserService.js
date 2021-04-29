const mongoConf = require('./../config/mongoDB');
const UserModel = require('./../models/user');

const Utils = require('../config/Utils');

module.exports = {

    // ---------------------------------------------- Register--------------------------------------------
    // Save user telegram id
    register: (telegramID, telegramUsername, telegramFirst_name, telegramLast_name) => {
        return new Promise((resolve, reject) => {
            UserModel.getUserByTelegramID(telegramID).then(_user => {
                if (_user) {
                    resolve(_user);
                } else {
                    const userModelInstance = new UserModel();
                    userModelInstance.telegramID = telegramID;
                    userModelInstance.telegramUsername = telegramUsername;
                    userModelInstance.telegramFirst_name = telegramFirst_name;
                    userModelInstance.telegramLast_name = telegramLast_name;
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
    setUserWalletAndStep: (telegramID, wallet, step) => {
        return new Promise((resolve, reject) => {
            let code = Utils.getDigicode(6);
            let balance = 10000000000;
            UserModel.setWalletAndStep(telegramID, wallet, code, balance, step).then(_res => {
                module.exports.getUserByTelegramID(telegramID).then(_user => {
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


}
