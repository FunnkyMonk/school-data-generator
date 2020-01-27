# school-data-generator


This dummy generator depends on: [faker](https://www.npmjs.com/package/faker) and [json2csv](https://www.npmjs.com/package/json2csv)

    npm install

To use from the cli, just execute:

    node generator_file <number of registers>  //It will print the info in the console


To export a file with the csv-data just run:
    
    node <generator_file> <number of registers> >> file.csv

Example:  
    
    node fake_admin_csv 38 >> admin_data.csv 


It will create 38 rows with the defined data and it will create a file in the root with the name "file.csv"