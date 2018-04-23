const Taktika = require('./Taktika');

class SimplTaktika extends Taktika {

    // constructor(context) {
    //     super(context);
    // }
    
    predict(indeks) {

        let val = this.data['index'][indeks];

        let movement = ((val % 2 == 0)?1:-1);
        let confidence = 0;

        let ret = [ movement, confidence ];
        //this.data['SimplTaktika'][indeks] = ret;
        return ret;
    }

}

module.exports = SimplTaktika;