const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute(lastIndex) {
        let slv = this.context.getValues('SLV');
        let days = 7;

        for (let i in slv) {
            if (i <= lastIndex) continue;
            if (i < days) {
                this.ret[i] = null;
                continue;
            }
                
            let slice = slv.slice(i-days, i);
            let sum = 0;
            for (let j in slice) {
                sum += parseFloat(slice[j]);
            }
            this.ret[i] = sum / slice.length;
        }

    }

}

module.exports = formula;