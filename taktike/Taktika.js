class Taktika {

    /**
     * 
     * @param {Array} data
     */
    constructor(data) {
        this.data = data;
        //this.ret = [];
    }

    /**
     * @param {int} indeks 
     * 
     * @returns {Array} 1st element: 1 price goes up, -1 price goes down, 0 price remains the same, 2nd element: prediction confidence, 1 = 100% confidence, 0% = no confidence
     */
    predict(indeks) {
        throw new Error(`Taktika class '${this.constructor.name}' should implement the buyOrSell() method.`);
    }

}

module.exports = Taktika;