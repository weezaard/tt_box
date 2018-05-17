const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    execute(lastIndex) {
        //console.log('in index formula execute');
        //console.log(this.context);
        
        for (let i in this.context.dataMap['SLV']) {
            //if (i < (lastIndex)) continue;
            //this.ret.push(parseInt(i)+1);
            //this.ret[i] = parseInt(i)+1;
            this.ret[i] = i;
        }
    }

}

module.exports = formula;