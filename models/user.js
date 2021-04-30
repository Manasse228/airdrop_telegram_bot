const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
    telegramID: {
        type: String,
        required: true
    },
    telegramUsername: {
        type: String,
        required: true
    },
    telegramFirst_name: {
        type: String,
        required: false
    },
    telegramLast_name: {
        type: String,
        required: false
    },
    twitterPseudo: {
        type: String, default: '',
        required: false
    },
    wallet: {
        type: String, default: '',
        required: false
    },
    shareCode: {
        type: String, default: "",
        required: false
    },
    amInvitedCode: {
        type: String, default: "",
        required: false
    },
    children: {
        type: Number, default: 0,
        required: false
    },
    balance: {
        type: Number, default: 0,
        required: false
    },
    step: {
        type: Number, default: 0,
        required: false
    },
    hashLink: {
        type: String, default: "",
        required: false
    },
    telegramGroup: {
        type: Boolean, default: false,
        required: false
    },
    telegramChannel: {
        type: Boolean, default: false,
        required: false
    },
    create_at: {
        type: Date, default: Date.now,
        required: false
    }
});

UserSchema.methods.toJSON = function () {
    let obj = this.toObject();
    delete obj.__v;
    return obj;
};

const User = mongoose.model('User', UserSchema);
module.exports = User;


module.exports.getUserByTelegramID = (_telegramID) => {
    return new Promise((resolve) => {
        let result = User.findOne({telegramID: _telegramID});
        resolve(result);
    })
};

module.exports.getUserByTwitterPseudo = (_twitterPseudo) => {
    return new Promise((resolve) => {
        let result = User.findOne({twitterPseudo: _twitterPseudo});
        resolve(result);
    })
};

module.exports.getUserByWallet = (_wallet) => {
    return new Promise((resolve) => {
        let result = User.findOne({wallet: _wallet});
        resolve(result);
    })
};

module.exports.getUserByShareCode = (_shareCode) => {
    return new Promise((resolve) => {
        let result = User.findOne({shareCode: _shareCode});
        resolve(result);
    })
};


module.exports.setTwitterPseudo = (_telegramID, _twitterPseudo) => {
    return new Promise((resolve) => {
        const query = {telegramID: _telegramID};
        const newvalues = {$set: {twitterPseudo: _twitterPseudo}};
        let result = User.updateOne(query, newvalues);
        resolve(result);
    })
};

module.exports.setTwitterPseudoAndStep = (_telegramID, _twitterPseudo, _step) => {
    return new Promise((resolve) => {
        const query = {telegramID: _telegramID};
        const newvalues = {$set: {twitterPseudo: _twitterPseudo, step: _step}};
        let result = User.updateOne(query, newvalues);
        resolve(result);
    })
};

module.exports.setWallet = (_telegramID, _wallet) => {
    return new Promise((resolve) => {
        const query = {telegramID: _telegramID};
        const newvalues = {$set: {wallet: _wallet}};
        let result = User.updateOne(query, newvalues);
        resolve(result);
    })
};

module.exports.setWalletAndStep = (_telegramID, _wallet, _code, _balance, _step) => {
    return new Promise((resolve) => {
        const query = {telegramID: _telegramID};
        const newvalues = {$set: {wallet: _wallet, shareCode: _code, balance: _balance, step: _step}};
        let result = User.updateOne(query, newvalues);
        resolve(result);
    })
};

module.exports.addChild = (_telegramID, _amount) => {
    return new Promise((resolve) => {
        const query = {telegramID: _telegramID};
        const newvalues = {$set: {children: _amount}};
        let result = User.updateOne(query, newvalues);
        resolve(result);
    })
};

module.exports.addChild = (_telegramID, _children) => {
    return new Promise((resolve) => {
        const query = {telegramID: _telegramID};
        const newvalues = {$set: {children: _children}};
        let result = User.updateOne(query, newvalues);
        resolve(result);
    })
};

module.exports.setStep = (_telegramID, _step) => {
    return new Promise((resolve) => {
        const query = {telegramID: _telegramID};
        const newvalues = {$set: {step: _step}};
        let result = User.updateOne(query, newvalues);
        resolve(result);
    })
};

