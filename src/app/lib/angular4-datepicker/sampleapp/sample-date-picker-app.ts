import {Component} from '@angular/core';

//declare var require: any;
//const appStyles: string = require('./sample-date-picker-app.css');
//const appTemplate: string = require('./sample-date-picker-app.html');

@Component({
    selector: 'mydatepicker-app',
    styleUrls: ['./sample-date-picker-app.css'],
    template: './sample-date-picker-app.html'
})

export class MyDatePickerApp {

    constructor() {
        console.log('constructor: MyDatePickerApp');
    }

}
