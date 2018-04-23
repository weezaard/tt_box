const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute() {
        let values = this.context.getValues('DMA7');
        for (let i in values) {
            if (i < 8) continue;
            this.ret[i] = this.calculatePercChange(values, i);
        }
    }

}

module.exports = formula;