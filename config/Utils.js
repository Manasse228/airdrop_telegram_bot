
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
        return 10000000000;
    },
    getAirdropBonusBalance() {
        return 1000000000;
    },
    getChatGroupId() {
        return "@nft_qr_Community";
    },
    getChannelId() {
        return "@NFT_QR_OfficialChannel";
    },
    getTelegram_Token() {
        return "1758663651:AAGctyVmgb9I7C0zmyHa2VMMUpj2ARveNNQ";
    }

};