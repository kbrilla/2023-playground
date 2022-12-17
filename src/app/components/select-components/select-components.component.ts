import { CommonModule } from '@angular/common';
import { Component, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HighlightDirective } from '../highlight.directive';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, HighlightDirective],
  selector: 'app-select-components',
  templateUrl: './select-components.component.html',
  styleUrls: ['./select-components.component.css'],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SelectComponentsComponent implements OnInit {
  constructor() {}

  options: string[] = ['Cat', 'Dog', 'Fishes', 'CatDog', 'DogFish', 'DogCat'];

  selectedSet: Set<string> = new Set();
  selected = [];
  filtred = [...this.options];
  #filter = '';
  set filter(value: string) {
    this.#filter = value;
    this.filtred = this.options.filter((option) => option.includes(value));
  }
  get filter() {
    return this.#filter;
  }

  ngOnInit() {}

  selectOption(option: string, event: Event) {
    event.preventDefault();
    if (this.selectedSet.has(option)) {
      this.selectedSet.delete(option);
    } else {
      this.selectedSet.add(option);
    }
    this.selected = [...this.selectedSet];
  }

  popoverhide(event: Event) {
    console.log('log');
    this.filter = '';
  }
}
