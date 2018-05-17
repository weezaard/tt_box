class AbstractFormula {

    constructor(context) {
        this.context = context;
        this.ret = [];
    }

    execute(lastIndex) {
        throw new Error(`formula class '${this.constructor.name}' should implement the execute() method.`);
    }

    /**
     * Should return an array of values, each array value position corresponding to
     * the SLV array positions
     */
    results() {
        //throw new Error(`formula class '${this.constructor.name}' should implement the results() method.`);
        return this.ret;
    }

    calculateSlope(xValues, yValues, i) {
        let x1 = xValues[i-1]
        let y1 = yValues[i-1];
        let x2 = xValues[i];
        let y2 = yValues[i];
        let slope = this.getSlopeAngle([x1, y1], [x2, y2]);
        //console.log(`i=${i}, x1=${x1}, y1=${y1}, x2=${x2}, y2=${y2}, slope=${slope}`);
        return slope;
    }

    calculatePercChange(values, i) {
        let valueMinus1 = parseFloat(values[i-1]);
        let ret = ((parseFloat(values[i]) - valueMinus1) / valueMinus1) * 100;
        return ret;

    }

    getSlopeAngle(s1,s2) {
        return Math.atan((s2[1] - s1[1]) / (s2[0] - s1[0])) * 180/Math.PI;
    }    
}

module.exports = AbstractFormula;