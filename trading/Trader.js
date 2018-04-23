class Trader {

    constructor(taktika, data) {
        this.taktika = taktika;
        this.data = data;
        this.balanceFiat = 1000;
        this.balanceAsset = 0;
        this.amountPerTrade = 10;
    }

    run() {
        let prices = this.data['SLV'];
        let i;
        for (i in prices) {
            let prediction = this.taktika.predict(i);
            if (prediction[0] === 1) {
                // price will go up
                this.buyAsset(i);
            } else if (prediction[0] === -1) {
                // price will go down
                this.sellAsset(i);
            } else {

            }
            //console.log(`Fiat balance: ${this.balanceFiat}, asset balance: ${this.balanceAsset}`);
        }

        let assetValue = parseFloat(this.balanceAsset) * parseFloat(prices[i]);
        console.log('Total balance in fiat: ' + (parseFloat(assetValue) + parseFloat(this.balanceFiat)));
    }

    buyAsset(i, amount) {
        if (amount==null) amount = this.amountPerTrade;
        let price = parseFloat(this.data['SLV'][i]);
        console.log(`Price on index ${i} is ${price}`);
        let cost = price * amount;
        if (cost > this.balanceFiat) {
            // not enough balance
            return false;
        }
        this.balanceFiat -= cost;
        this.balanceAsset += amount;
        return true;
    }

    sellAsset(i, amount) {
        if (amount==null) amount = this.amountPerTrade;
        let price = parseFloat(this.data['SLV'][i]);
        console.log(`Price on index ${i} is ${price}`);
        let cost = price * amount;
        if (amount > this.balanceAsset) {
            // not enough asset balance
            return false;
        }
        this.balanceFiat += cost;
        this.balanceAsset -= amount;
        return true;
    }

}

module.exports = Trader;