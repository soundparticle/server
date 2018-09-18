const { assert } = require('chai');
const request = require('./request');
const { checkOk } = request;
const { dropCollection, createToken  } = require('./db');
const { Types } = require('mongoose');

describe('Pets API', () => {
  
    beforeEach(() => dropCollection('users'));
    beforeEach(() => dropCollection('pets'));
  
    let sally;
    let token = '';

    beforeEach(() => createToken().then(t => {
        token = t;
    }));

    beforeEach(() => {
        return request
            .post('/api/pets')
            .set('Authorization', token)
            .send(
                {
                    owner: Types.ObjectId(),
                    zip:  Types.ObjectId(),
                    name: 'Sally',
                    species: 'Dog',
                    breedCat: 'Not Applicable',
                    breedDog: 'Shih Tzu',
                    sex: 'Female',
                    size: 'Extra Small',
                    sterilized: 'Yes',
                    age: 'Baby',
                    activity: 'High',
                    kidFriendly: 'Yes',
                    petFriendly: 'Yes',
                    description: 'this pet is nasty',
                    healthBehavior: 'healthy but nasty',
                    images: ['https://cbssacramento.files.wordpress.com/2012/06/81650435_10.jpg?w=1024&h=576&crop=1'],
                    rehome: 'Allergy'
                })
            .then(({ body }) => {
                sally = body;
            });
    });

    it('saves a pet', () => {
        assert.isOk(sally._id);
    });

    it('updates a pet', () => {
        sally.name = 'Sally Envy Salad';
        return request
            .put(`/api/pets/${sally._id}`)
            .set('Authorization', token)
            .send(sally)
            .then(checkOk)
            .then(({ body }) => {
                assert.equal(body.name, sally.name);      
            });
    });
});