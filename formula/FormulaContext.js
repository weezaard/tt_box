class FormulaContext {

    get data() {
        if (this.dataMap === undefined) {
            this.dataMap = {};
        }
        return this.dataMap;
    }

    getValues(propertyName) {
        return this.data[propertyName];
    }

    setValues(propertyName, valuesObj) {
        this.data[propertyName] = valuesObj;
    }

}

module.exports = FormulaContext;