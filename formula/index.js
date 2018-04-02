const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute() {
        //console.log('in index formula execute');
        //console.log(this.context);
        
        for (let i in this.context.dataMap['SLV']) {
            this.ret.push(i);
        }
    }

}

module.exports = formula;