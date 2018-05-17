const Instrument = require('../model/Instrument');
const Property = require('../model/Property');
const PropertyValue = require('../model/PropertyValue');
const FormulaContext = require('../formula/FormulaContext');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function calcProps(assetName, lastCalculatedProperty) {

    let lastIndex = -1;
    if (lastCalculatedProperty!=null) {
        lastIndex = lastCalculatedProperty.index;
    }
    
    let instruments = await Instrument.findAll({ 
        where: { 
            asset_name : assetName
        }
    });
    console.log('after findAll instruments');
    let properties = await Property.findAll();

    let context = new FormulaContext();

    let slValues = new Array();
    instruments.forEach((instrument) => {
        slValues[instrument.index] = instrument.value;
    });
    //context.setValues('SLV', instruments.map((i) => i.value));
    context.setValues('SLV', slValues);

    for (let prop of properties) {
        try {
            // load prop values from db
            let dbPropValues = await loadFromDb(prop.name, assetName, lastIndex);

            let FormulaClass = require(`../formula/${prop.name}`);
            //context.lastIndex = lastIndex;
            let formula = new FormulaClass(context);
            context.setValues(prop.name, dbPropValues);
            formula.execute(lastIndex);
            let results = formula.results();    // results only from lastIndex forward, have to append to to db loaded values
            results.forEach((r, i) => { // append
                dbPropValues[i] = r;
            });
            context.setValues(prop.name, dbPropValues);
        } catch (err){ 
            console.error(`Error executing formula '${prop.name}'.`, err);
            throw err;
        }
    }

    return context;
}

async function loadFromDb(propName, assetName, lastIndex) {
    let vals = await PropertyValue.findAll({
        where: {
            asset_name: assetName,
            property_name: propName
            //index: { [Op.gt] : lastIndex }
        }
    });
    let ret = [];
    vals.map((pv) => {
        ret[pv.index] = pv.value;
    });
    return ret;
}

module.exports = calcProps;