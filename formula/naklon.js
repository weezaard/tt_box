const AbstractFormula = require('./AbstractFormula');

class formula extends AbstractFormula {

    getSlopeAngle(s1,s2) {
        return Math.atan((s2[1] - s1[1]) / (s2[0] - s1[0])) * 180/Math.PI;
    }
      
    execute() {
        let slv = this.context.getValues('SLV');
        let indeks = this.context.getValues('index');
        console.log(slv);
        console.log(indeks);
        for (let i in slv) {
            if (i < 1) continue;
            let x1 = indeks[i-1]
            let y1 = slv[i-1];
            let x2 = indeks[i];
            let y2 = slv[i];
            let slope = this.getSlopeAngle([x1, y1], [x2, y2]);
            console.log(`i=${i}, x1=${x1}, y1=${y1}, x2=${x2}, y2=${y2}, slope=${slope}`);
        }
    }

}

module.exports = formula;