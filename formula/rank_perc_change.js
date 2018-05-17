const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute(lastIndex) {
        let slv = this.context.getValues('SLV');
        for (let i in slv) {
            if (i <= lastIndex) continue;
            if (i < 1) {
                this.ret[i] = null;
            } else {
                this.ret[i] = slv[i] - slv[i-1];
            }
        }        
    }

}

module.exports = formula;