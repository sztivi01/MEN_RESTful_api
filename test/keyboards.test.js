const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('/First test collection',() => {

    it('test default API welcome route...',(done) =>{ 

        chai.request(server)
        .get('/api/welcome')
        .end((err,res) => {
            res.should.have.status(200);
            res.should.be.a('object');
            const actualVal = res.body.message;
            expect(actualVal).to.be.equal('welcome to the MEN RESTful API');
            done();
        });

    });

    it('should POST valid keyboard',(done) =>{

        let keyboard = {
            name:"test keyboard",
            description:"igen ez egy test keyboard baszki",
            price:"1001",
            inStock:true
        }
        chai.request(server)
        .post('/api/keyboards')
        .send(keyboard)
        .end((err,res) => {
            res.should.have.status(200);
            done();
        });
    });

    it('should verify that we have 1 keyboards in the database',(done) =>{
        chai.request(server)
        .get('/api/keyboards')
        .end((err,res) => {
            res.should.have.status(200);
            res.body.should.a('array');
            res.body.length.should.be.eql(1);
            done();
        });
    });

    it('should test two values....',() =>{ 
        //actual test content is here 
        let expectedVal=10;
        let actualVal=10;

        expect(actualVal).to.be.equal(expectedVal);

    })
})
