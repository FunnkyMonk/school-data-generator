const moment = require('moment');
const faker = require('faker');

const generator_dictionary = {
    code: faker.random.alphaNumeric,
    name: faker.name.findName,
    email: faker.internet.email,
    phone: faker.phone.phoneNumber,
    graded: faker.random.arrayElement, 
    academic_rank: faker.random.arrayElement, 
    action: faker.random.arrayElement,
    type: faker.random.arrayElement,
    lat: faker.address.latitude,
    lon: faker.address.longitude,
    rad: faker.random.number,
    floor: faker.random.number
}

const Buildier = class {
    constructor(props) {

        const { seed } = props;

        if (Boolean(seed)){
            faker.seed(parseInt(seed))
        }
    }

    generateFakeData(params) {
        
        const { fields, faker_params, quantity } = params;
        
        const data = [];
        
        for (let count = 0; count < quantity; count++){

            const register = {};

            fields.forEach((field)=>{
                const properties = faker_params[field];
                let fake_data;
                
                if (!generator_dictionary[field]){
                    throw new Error(`Ups! :( I didn't find the field: "${field}" in the generator_dictionary!`)
                }

                if (Boolean(properties)){
                    fake_data = generator_dictionary[field](properties)
                }else {
                    fake_data = generator_dictionary[field]()
                }
                
                register[field] = fake_data
            });

            data.push(register);
        }
        return data
    }

    getRandomValueFromList(list, value){
        const random_position = faker.random.number(list.length) - 1;
        const fixed_random_position = Math.max(0,random_position);
        return list[fixed_random_position][value];
    }

    getRandomScheduleStr(){

        const MAX_SCHEDULES_PER_WEEK = 5;
        const CLASS_DURATION = 2; // hours
        const DAY_HOURS = 24

        const order_list_ascendent = l => l.sort((a,b) => a > b ? 1 : -1);

        const get_array_with_random_values = (size) => {
            
            let array = Array.from({
                length: MAX_SCHEDULES_PER_WEEK
            }, () => faker.random.number( size ));
            
            array = new Set(array)
            
            return order_list_ascendent([...array])
        };

        const start_class_hours = get_array_with_random_values(DAY_HOURS - CLASS_DURATION)
        const days_of_week = new Set();

        while(days_of_week.size < start_class_hours.length){
            days_of_week.add(faker.random.number(start_class_hours.length))
        }

        const days_of_week_ordered = order_list_ascendent([...days_of_week])

        const schedule = [];

        days_of_week_ordered.forEach((day_number, position) => {

            const abbr_day =  moment(day_number, 'd').format('dd');
            const start_hour = moment(start_class_hours[position], 'HH').format('HH:mm');
            const end_hour = moment(start_hour, 'HH:mm').add(CLASS_DURATION, 'hours').format('HH:mm');

            schedule.push(`${abbr_day}_${start_hour}_${end_hour}`)

        });

        return schedule.join('#')

    }

    generateFakeDataForClass(params){

        const CLASS_DURATION_DAYS = 30;

        const { fields, faker_params, quantity, custom_fields, dependencies } = params;

        const { professor_data, facilities_data, student_data } = dependencies

        const  plain_fields = fields.filter(field => !custom_fields.includes(field));

        const classes_data = this.generateFakeData({
            fields: plain_fields,
            faker_params,
            quantity
        });

        classes_data.forEach((class_data)=>{

            const start_date = moment(faker.date.future()).format('YYYY-MM-DD');;
            const end_date = moment(start_date,'YYYY-MM-DD').day(CLASS_DURATION_DAYS).format('YYYY-MM-DD');

            const name = faker.lorem.word();

            const facility_code = this.getRandomValueFromList(facilities_data, 'code')
            const professor_email = this.getRandomValueFromList(professor_data, 'email')
            
            const students_in_class = faker.random.number(student_data.length);

            const unique_students_email = new Set();

            for (let n = students_in_class; n >= 0; n--){
                unique_students_email.add(this.getRandomValueFromList(student_data, 'email'))
            }
            
            const student_emails = [...unique_students_email].join('#'); 

            const schedule = this.getRandomScheduleStr();

            Object.assign(class_data, {
                name,
                end_date,
                schedule,
                start_date, 
                facility_code,
                student_emails,
                professor_email,
            });

        });

        return classes_data;

    }
}


module.exports = Buildier