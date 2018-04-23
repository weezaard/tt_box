class FormulaContext {

    get data() {
        if (this.dataMap === undefined) {
            this.dataMap = {};
        }
        return this.dataMap;
    }

    get propertyNames() {
        let ret = new Array();
        for (let pName in this.data) {
            ret.push(pName);
        }
        return ret;
    }

    getValues(propertyName) {
        return this.data[propertyName];
    }

    setValues(propertyName, valuesObj) {
        this.data[propertyName] = valuesObj;
    }

}

module.exports = FormulaContext;