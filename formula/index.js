const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute() {
        //console.log('in index formula execute');
        //console.log(this.context);
        
        for (let i in this.context.dataMap['SLV']) {
            this.ret.push(parseInt(i)+1);
        }
    }

}

module.exports = formula;