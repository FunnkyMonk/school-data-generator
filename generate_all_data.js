
const { parse:parse_to_csv } = require('json2csv');
const fs = require('fs');

const DATA_QUANTITY = require('./data_quantity.json');
const FILES_COMMON_PATH = './csv/';

const ADMIN_FIELDS = ['code','name','email','phone'];
const PROFESSOR_FIELDS = ['code','name','email','phone','academic_rank','action'];
const FACILITIES_FIELDS = ['name','code','lat','lon','rad','floor','type','action'];
const STUDENT_FIELDS = ['code','name','email','phone','action']
const CLASS_FIELDS = ['name','code','facility_code','graded','start_date','end_date','schedule','professor_email','student_emails','action'] 

const Buildier = require('./fake_data_buildier.js');

const [ school_name = 'test', semester = '0' ] = process.argv.slice(2)

const generate_seed = (str_tmp) => {
    let ascii_sum = 0;
    str_tmp.split("").forEach((char) => {
        ascii_sum += parseInt(char.charCodeAt())
    });
    return ascii_sum
};

const dataBuildier = new Buildier({ seed: generate_seed(school_name + semester) })

const facilities_data = dataBuildier.generateFakeData({ 
    fields: FACILITIES_FIELDS, 
    faker_params: {
        code: 5,
        rad: 10,
        floor: 5,
        type: [ 'Library', 'Cafeteria', 'Classroom', 'Stadium' ],
        action: ['UPDATE']
    }, 
    quantity: DATA_QUANTITY.facility
});


const admin_data = dataBuildier.generateFakeData({
    fields: ADMIN_FIELDS, 
    faker_params: {
        code: 5, 
    }, 
    quantity: DATA_QUANTITY.admin
});


const professor_data = dataBuildier.generateFakeData({
    fields: PROFESSOR_FIELDS, 
    faker_params: {
        code: 5,
        graded:['TRUE', 'FALSE'],
        academic_rank: ['prof.', 'dr.', 'lic.'],
        action: ['ADD']
    }, 
    quantity: DATA_QUANTITY.professor
});


const student_data = dataBuildier.generateFakeData({
    fields: STUDENT_FIELDS, 
    faker_params: {
        code: 5,
        action: [ 'ADD' ]
    },
    quantity: DATA_QUANTITY.student
});


const class_data = dataBuildier.generateFakeDataForClass({
    fields: CLASS_FIELDS, 
    faker_params:{
        code: 5,
        graded:['TRUE', 'FALSE'],
        action: [ 'UPDATE' ]
    }, 
    quantity: DATA_QUANTITY.class,
    custom_fields: [ 'name', 'facility_code','start_date','end_date','schedule','professor_email','student_emails'],
    dependencies: {
        professor_data, facilities_data, student_data
    }
});


function write_file(entity, data, fields){

    fs.writeFile(`${FILES_COMMON_PATH}${school_name}_${semester}_${entity}.csv`, parse_to_csv(data, { fields }), (err) => {
        if(err) {
            throw err;
        }
        console.log(`${entity} has been written to file successfully.`);
    });
}

write_file('admin', admin_data, ADMIN_FIELDS)
write_file('facility', facilities_data, FACILITIES_FIELDS)
write_file('professor', professor_data, PROFESSOR_FIELDS)
write_file('student', student_data, STUDENT_FIELDS)
write_file('class', class_data, CLASS_FIELDS)



