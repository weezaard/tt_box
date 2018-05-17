const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute(lastIndex) {
        let slv = this.context.getValues('SLV');
        for (let i in slv) {
            if (i <= lastIndex) continue;
            if (i < 1) {
                this.ret[i] = null;
            } else {
                /*
                let slvMinus1 = parseFloat(slv[i-1]);
                this.ret[i] = ((parseFloat(slv[i]) - slvMinus1) / slvMinus1) * 100;
                */
               this.ret[i] = this.calculatePercChange(slv, i);
            }
        }
    }


}

module.exports = formula;