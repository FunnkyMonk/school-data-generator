const faker = require('faker');
const { parse:parse_to_csv } = require('json2csv');

(function admin(n = 1){

    const fields = ['code','name','email','phone'];
    const data = [];

    for (let count = 0; count < n; count++){
        const code = faker.random.alphaNumeric(5)
        const name = faker.name.findName();
        const email = faker.internet.email();
        const phone = faker.phone.phoneNumber();
    
        data.push({
            code,
            name,
            email,
            phone,
        });
    }

    const csv = parse_to_csv(data, { fields });
    console.log(csv)
    
})(process.argv.slice(2)[0]);