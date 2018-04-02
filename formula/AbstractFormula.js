class AbstractFormula {

    constructor(context) {
        this.context = context;
        this.ret = [];
    }

    execute() {
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
}

module.exports = AbstractFormula;