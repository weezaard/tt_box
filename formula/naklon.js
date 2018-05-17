const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute(lastIndex) {
        let slv = this.context.getValues('SLV');
        let indeks = this.context.getValues('index');
        for (let i in slv) {
            if (i <= lastIndex) continue;
            if (i < 1) continue;
           this.ret[i] = this.calculateSlope(indeks, slv, i);
        }
    }

}

module.exports = formula;