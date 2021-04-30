
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

};