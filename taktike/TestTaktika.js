const Taktika = require('./Taktika');

class TestTaktika extends Taktika {

    predict(i) {

        //let val = this.data['index'][indeks];
        let rpc = this.data['rank_perc_change'];

        let movement = 0;
        if (rpc[i] < 0) {
            movement = -1;
        } else {
            movement = 1;
        }
        let confidence = 0;

        let ret = [ movement, confidence ];
        //this.data['SimplTaktika'][indeks] = ret;
        return ret;
    }

}

module.exports = TestTaktika;