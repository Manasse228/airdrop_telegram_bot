module.exports = {

    getDigicode(length) {
        let result = '';
        const characters = '0123456789abcdefghijklmnopqrstuvwxyz';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    },
    getAirdropBalance() {
        return 1000000000000;
    },
    getAirdropBonusBalance() {
        return 10000000000;
    },
    getChatGroupId() {
        return "@nft_qr_Community";
    },
    getChannelId() {
        return "@NFT_QR_OfficialChannel";
    },
    getTelegram_Token() {
        return "";
    },
    getNFT_QR_Inspector_Token() {
        return "";
    },
    getTwuitterRegex() {
        return /(?![\s,.?\/()"\'()*+,-./:;<=>?@[\\]^_`{|}~])@[A-Za-z]\w*?\b/g;
    },
    getWalletRegex() {
        return /^0x[a-fA-F0-9]{40}$/g;
    },
    formatNumber(number) {
        return new Intl.NumberFormat().format(number);
        //return text.toLocaleString() + text.toString().slice(text.toString().indexOf('.'));
    },
    getChildrenBalance(userInfo) {
        return (userInfo.children === 0) ? 0 : module.exports.formatNumber(userInfo.children * module.exports.getAirdropBonusBalance())
    }

};