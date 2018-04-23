const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute() {
        let dma7 = this.context.getValues('DMA7');
        let indeks = this.context.getValues('index');
        for (let i in dma7) {
            if (i < 8) continue;
           this.ret[i] = this.calculateSlope(indeks, dma7, i);
        }
        
    }

}

module.exports = formula;