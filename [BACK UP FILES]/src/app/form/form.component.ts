import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
// Import animations
import {
  trigger,
  style,
  transition,
  animate,
  keyframes,
  query,
  stagger
} from '@angular/animations';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  animations: [
    trigger('formDB', [
        transition('* => *', [
            query(':enter', style({ opacity: 0}), {optional: true}),

            // Animation when adding an element to the list
            query(':enter', stagger('300ms', [
              animate('.6s ease-in', keyframes([
                style({opacity: 0, transform: 'translateY(-75%)', offset: 0}),
                style({opacity: .5, transform: 'translateY(35px)', offset: .3}),
                style({opacity: 1, transform: 'translateY(0)', offset: 1}),

              ]))
            ]), {optional: true}),

            // Animation when removing an element from the list
            query(':leave', stagger('300ms', [
              animate('.6s ease-in', keyframes([
                style({opacity: 1, transform: 'translateY(0)', offset: 0}),
                style({opacity: .5, transform: 'translateY(35px)', offset: .3}),
                style({opacity: 0, transform: 'translateY(-75%)', offset: 1}),

              ]))
            ]), {optional: true})
        ])
    ])
  ]
})
export class FormComponent implements OnInit {

  // Initialize types
  itemCount: number;
  group: string;
  name: string = 'Water';
  amount: number = 69.99;
  date: string = '1993-09-29';
  formDB = [];

  public newExp: Expense;

  constructor(private dataService: DataService) { }

  // Called after data-bound properties of a directive are initialized
  ngOnInit() {
    this.dataService.expense.subscribe(res => this.formDB = res);
    // Sort database by date from largest to smallest
    this.formDB.sort((a, b) => +new Date(b.timeStamp) - +new Date(a.timeStamp));
    this.dataService.updateDB(this.formDB);
    // Update item count
    this.itemCount = this.formDB.length;
  }

  // Add expense to recent expenses
  addExpense() {
    // Create a new object
    this.newExp = new Expense();
    // Set the group, name, and amount for this new object equal to what is submitted on the form
    this.newExp.expenseGroup = this.group;
    this.newExp.expenseName = this.name;
    this.newExp.expenseAmount = this.amount;
    // Date of actual purchase
    this.newExp.timeStamp = this.date;


    // Add the newly created object to the formDB array
    this.formDB.unshift(this.newExp);
    console.log(this.formDB);

    // Reset values after submit
    this.name = '';
    this.amount = 0;
    this.itemCount = this.formDB.length;
    this.formDB.sort((a, b) => +new Date(b.timeStamp) - +new Date(a.timeStamp));
    this.dataService.updateDB(this.formDB);
  }

    // Remove and item from the list
    removeItem(i) {
      let result = confirm("Are you sure you want to delete this entry?");
      // If result is true, the specified entry will be deleted
      if (result) {
        this.formDB.splice(i, 1);
      }
      this.dataService.updateDB(this.formDB);
    }

}
// Expense blueprint
export class Expense {
  expenseGroup: string;
  expenseName: string;
  expenseAmount: number;
  timeStamp: string;
}
