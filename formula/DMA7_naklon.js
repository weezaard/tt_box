const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute(lastIndex) {
        let dma7 = this.context.getValues('DMA7');
        let indeks = this.context.getValues('index');
        for (let i in dma7) {
            if (i <= lastIndex) continue;
            if (i < 8) continue;
            let naklon = this.calculateSlope(indeks, dma7, i);
            if (isNaN(naklon)) {
                console.error('not gut');
            }
            this.ret[i] = naklon;
        }
        
    }

}

module.exports = formula;