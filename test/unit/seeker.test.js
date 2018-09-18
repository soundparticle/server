const { assert } = require('chai');
const { Types } = require('mongoose');
const Seeker = require('../../lib/models/seeker');

const getErrors = (validation, numberExpected) => {
    assert.isDefined(validation);
    const errors = validation.errors;
    assert.equal(Object.keys(errors).length, numberExpected);
    return errors;
};

describe('Seeker model', () => {
    
    it('validates a good model', () => {
        const data = {
            name: Types.ObjectId(),
            kids: false,
            activity: 'Low',
            zip: Types.ObjectId(),
            otherPets: false,
            interested: [],
            favorites: []
        };

        const seeker = new Seeker(data);
        const json = seeker.toJSON();
        delete json._id;
        assert.deepEqual(json, data);       
    });

    it('validate required fields', () => {
        const seeker = new Seeker({});
        const errors = getErrors(seeker.validateSync(), 3);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.activity.kind, 'required');
        assert.equal(errors.zip.kind, 'required');
    });
});