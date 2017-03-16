import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

/**
 * Sample usage  
    <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
       <search [searchString]="searchString" (filterSearch)="handleSearchChange($event)"></search>
    </div>
 * 
 */

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  // input searchString from parent view, so
  // parent view can clear the search field
  @Input() searchString: string;
  // output property 'searchString' to parent view
  // for products filter pipe
  @Output() filterSearch = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }
  onSearch(event: any) {
      if (event.target.value.length > 2) {
          this.filterSearch.emit(this.searchString);
      }
  }
}
