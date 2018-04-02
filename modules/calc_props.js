const Instrument = require('../model/Instrument');
const Property = require('../model/Property');
const FormulaContext = require('../formula/FormulaContext');

async function calcProps(assetName) {

    let instruments = await Instrument.findAll({ where: { asset_name : assetName }});
    console.log('after findAll instruments');
    let properties = await Property.findAll();

    let context = new FormulaContext();
    context.setValues('SLV', instruments.map((i) => i.value));

    let i = 0;
    for (let prop of properties) {
        //console.log(JSON.stringify(prop));
        //console.log(prop.name);
        try {
            let FormulaClass = require(`../formula/${prop.name}`);
            context.currentIndex = i;
            let formula = new FormulaClass(context);
            formula.execute();
            let results = formula.results();
            context.setValues(prop.name, results);
            console.log(`context after executing '${prop.name}: '` ,context);
            //console.log(context);
        } catch (err){ 
            console.error(`Error executing formula '${prop.name}'.`, err);
            throw err;
        }
    }

}

module.exports = calcProps;