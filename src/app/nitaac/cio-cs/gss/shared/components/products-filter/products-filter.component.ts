import { Component, OnInit,Input, Output, EventEmitter } from '@angular/core';
import * as globs from '../../config';

/**
 * Sample usage
    <div class="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8">
       <products-filter (filterUpdated)="handleCategoryChange($event)"></products-filter>
    </div>    
    <div class="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
       <search [searchString]="searchString" (filterSearch)="handleSearchChange($event)"></search>
    </div>
 * 
 */
@Component({
  selector: 'products-filter',
  templateUrl: './products-filter.component.html',
  styleUrls: ['./products-filter.component.scss']
})
export class ProductsFilterComponent implements OnInit {
  // output property 'selects' to parent view
  // for products filter pipe
  @Output() filterUpdated = new EventEmitter();

  products: Array<Object> = [];
  showCategory: boolean = true;
  brands = ['Dell', 'HP', 'Apple,OS X', "Lenovo", "Panasonic", "Getac", "Fujitus"];
  brandProductCount = {};
  selects = ProductsFilterComponent._selects;
  desktopDisabled: string = '';
  // orderBy: string = 'lowhigh';

  static filterCodes = {
    "L1": "Laptop",
    "D1": "Desktop",
    "T1": "Tablets",
    "T2": "Ruggedized Devices",
    "L2": "Lightweight Laptop",
    "L3": "High level Laptop",
    "D2": "Desktop Upgrade 1",
    "D3": "Desktop Upgrade 2",
    "D4": 'Mac',
    "L4": 'Mac'
  };

  static filters = [
    {
      'id': 'A1', 'label': 'All Products',
      'subTypes': []
    },
    {
      'id': 'L1', 'label': 'Laptops',
      'subTypes': [
        { 'id': 'L2', 'label': 'Light Weight' },
        { 'id': 'L3', 'label': 'High Level' },
        { 'id': 'L4', 'label': 'Mac' }
      ]
    },
    {
      'id': 'D1', 'label': 'Desktop',
      'subTypes': [
        { 'id': 'D2', 'label': 'Upgrade 1' },
        { 'id': 'D3', 'label': 'Upgrade 2' },
        { 'id': 'D4', 'label': 'Mac' }
      ]
    },
    {
      'id': 'T1', 'label': 'Tablets',
      'subTypes': []
    },
    {
      'id': 'T2', 'label': 'Ruggedized Devices',
      'subTypes': []
    }
  ];
  static Brands = [
    // {'id': 'lenovo', 'label': 'Lenovo'},
    { 'id': 'dell', 'label': 'Dell' },
    { 'id': 'hp', 'label': 'HP' }
  ];

  static _devicetypes = [
    { id: "L1", label: "Laptop",
       'subTypes': [
            { 'id': 'L2', 'label': 'Light Weight' },
            { 'id': 'L3', 'label': 'High Level' },
            { 'id': 'L4', 'label': 'Mac' }
        ] },
    { id: "D1", label: "Desktop",
      'subTypes': [
            { 'id': 'D2', 'label': 'Upgrade 1' },
            { 'id': 'D3', 'label': 'Upgrade 2' },
            { 'id': 'D4', 'label': 'Mac' }
        ] },
    { id: "T1", label: "Tablets",
       'subTypes': null },
    { id: "T2", label: "Ruggedized Devices",
       'subTypes': null}
]
  static _configurations = [
    { id: "Basic", label: "Basic Configuration", specs: 'L1,D1' },
    { id: "OMB", label: "OMB Compliant", specs: "L1,D1,L2,D2,D3" },
    { id: "L2", label: "Lightweight Laptop", specs: "8 GB RAM!180 GB hard drive!13 in. max display!3.5 lbs or less!" },
    { id: "L3", label: "High level Laptop", specs: "16 GB RAM!500 GB hard drive!15 in. min display!6.5 lbs or less!" },
    { id: "D2", label: "Desktop Upgrade 1", specs: "16 GB RAM!500 GB hard drive!6 USB ports!" },
    { id: "D3", label: "Desktop Upgrade 2", specs: "32 GB RAM!256 GB SSD & 1 TB hard drive!8 USB ports!" }
  ]
  static _brands = [
    { id: "Apple,OS X", label: "Apple", specs: "" },
    { id: "Dell", label: "Dell", specs: "" },
    { id: "Fujitus", label: "Fujitus", specs: "" },
    { id: "Getac", label: "Getac", specs: "" },
    { id: "HP", label: "HP", specs: "" },
    { id: "Lenovo", label: "Lenovo", specs: "" },
    { id: "Panasonic", label: "Panasonic", specs: "" },
  ]
  static _operating_systems = [
    { id: "mac", label: "Mac" },
    { id: "pc", label: "PC" }
    //               { id: "other", label: "Other" }
  ]

  static _processors = [
    { id: "i3", label: "i3 Processor" },
    { id: "i5", label: "i5 Processor" },
    { id: "i7", label: "i7 Processor" }
    //                { id: "other", label: "Other" }
  ]
  static _rams = [
    { id: "8", label: "8GB" },
    { id: "16", label: "16GB" }
    //                { id: "other", label: "Other" }
  ]

  static _harddrives = [
    { id: "500", label: "500GB" },
    { id: "1000", label: "1TB" }
    //                { id: "other", label: "Other" }
  ]

  static _weights = [
    { id: "<3", label: "Less than 3lbs" },
    { id: "3-6", label: "3 - 6 lbs" },
    { id: ">6", label: "More than 6lbs" }
  ]


  static _selects = {
    orderBy: 'lowhigh',
    ids: ['device', 'configuration', 'brand', 'os',
      'processor', 'ram', 'harddrive', 'weight'],
    device: {
      label: 'Device Type',
      options: ProductsFilterComponent._devicetypes,
      selected: [],
      applied: ''
    },
    configuration: {
      label: 'Configurations',
      options: ProductsFilterComponent._configurations,
      selected: [],
      applied: ''
    },
    brand: {
      label: 'Brand',
      options: ProductsFilterComponent._brands,
      selected: [],
      applied: ''
    },
    os: {
      label: 'OS',
      options: ProductsFilterComponent._operating_systems,
      selected: [],
      applied: ''
    },
    processor: {
      label: 'Processor',
      options: ProductsFilterComponent._processors,
      selected: [],
      applied: ''
    },
    ram: {
      label: 'RAM',
      options: ProductsFilterComponent._rams,
      selected: [],
      applied: ''
    },
    harddrive: {
      label: 'Hard Drive',
      options: ProductsFilterComponent._harddrives,
      selected: [],
      applied: ''
    },
    weight: {
      label: 'Weight',
      options: ProductsFilterComponent._weights,
      selected: [],
      applied: ''
    }
  }

  constructor() {
    this.filterUpdated.emit(this.selects);
  }

  ngOnInit() {
    this.products = JSON.parse(localStorage.getItem('allProducts'));
    this.setBrandProductCount(this.products);
  }
  closeMe(event) {
      this.showCategory = false;
      event.stopPropagation();
      console.log('closeMe', this.showCategory)
  }
  isBrand(id) {
    return (this.brands.indexOf(id) > -1);
  }
  setBrandProductCount(data) {
    for (let search of this.brands) {
      if (!(search in this.brandProductCount)) {
        this.brandProductCount[search] = 0;
      }
      for (let bra of search.split(',')) {
        let re = new RegExp(bra, 'i');
        for (let product of data) {
          let name = product.attributes.oemMfrName;
          if (re.test(name)) {
            this.brandProductCount[search] += 1;
          }
        }
      }
    }
  }
  onOrderChange(event) {
     this.selects.orderBy = event.target.value;
     this.filterUpdated.emit(this.selects);
  }
  // type = device | configuration | brands | os | processor | weight
  filterType(obj, type) {
    // console.log('obj', obj);
    // console.log('type', type);
    let myArray = this.selects[type].selected;
    // console.log('myArray ', myArray)
    let index: number = myArray.indexOf(obj.id);
    if (type === 'device') {
      // disable or enable "Desktop upgrade"
      if (obj.id === 'D1') {
        if (index === -1) {
           // if Desktop box is checked
           this.desktopDisabled = '';
        } else {
           // if Desktop box is unchecked
           this.desktopDisabled = 'disabled';
           this.uncheckDesktopConfig();
        }
      } else if (obj.id === 'L1') {
        if (index === -1) {
           // if Laptop box is checked
           this.desktopDisabled = 'disabled';
           this.uncheckDesktopConfig();
        } else {
           // if Laptop box is unchecked
           this.desktopDisabled = '';
        }
      } 
    } 
    (index === -1) ? myArray.push(obj.id) : myArray.splice(index, 1);
    this.selects[type].applied = myArray.join(',');

    // if all device categories are unchecked
    // enable the Desktop configurations
    let applied = this.selects['device'].applied.split(',');
    applied = applied.diff([""]); // minus empty array item
    // console.log('device appied ', applied);
    let idx = applied.indexOf('D1');
    if ( idx >= 0 || applied.length === 0) {
      this.desktopDisabled = '';
    } else {
      this.desktopDisabled = 'disabled';
      this.uncheckDesktopConfig();
    }
    this.filterUpdated.emit(this.selects);
    // console.log(type+'Applied', this.selects[type].applied)
  }
  uncheckDesktopConfig() {
     let conf = this.selects['configuration'].applied.split(',');
      let i = conf.indexOf('D2');
      conf.splice(i)
      i = conf.indexOf('D3');
      conf.splice(i);
      this.selects['configuration'].applied = conf.join(',');
      console.log('configuration', this.selects['configuration'].applied);
      let sel = this.selects['configuration'].selected;
      i = sel.indexOf('D2');
      sel.splice(i);
      i = sel.indexOf('D3');
      sel.splice(i);
      this.selects['configuration'].selected = sel;
  }
  checkFiltersApplied() {
    let applied = false;
    for (let id of this.selects.ids) {
      if (this.selects[id].selected.length != 0) {
        applied = true;
      }
    }
    return applied;
  }

  getLabel(category, id) {
    for (let type of category) {
      if (type.id == id) {
        return type.label;
      }
    }
  }

  clearFilters() {
     for (let id of this.selects.ids) {
        this.selects[id].selected = [];       
        this.selects[id].applied = '';
     }
  }
}
