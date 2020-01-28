# school-data-generator


This minimal Dummy Generator depends on: [faker](https://www.npmjs.com/package/faker), [json2csv](https://www.npmjs.com/package/json2csv) and [momentjs](https://momentjs.com/)

    npm install

To use from the cli, just execute:

    node generate_all_data.js <school_name> <semester>

The "school_name" and "semester" parameters are going to join and generate the seed to define the "randomness" so, same parameters will return same data.

The quantity of registers can be controled through the file "data_quantity.json" the number represents the rows of it's corresponding entity:


    {   
        "facility": 50,
        "professor": 100,
        "class": 200,
        "student": 500,
        "admin": 80
    }


After executing generate_all_data, It will create 5 csv_files inside ./csv folder, so for example executing:

    node generate_all_data.js schoolTest 1

It Will create the followng csv's:

    schoolTest_1_admin.csv
    schoolTest_1_class.csv
    schoolTest_1_facility.csv
    schoolTest_1_professor.csv
    schoolTest_1_student.csv


>> Warning: At this point colissions between ids on different files can occurr, but it should be minimal.





