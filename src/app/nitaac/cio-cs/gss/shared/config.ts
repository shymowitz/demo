
import { environment } from '../../../../../environments/environment';

export const config = {
    //'defaultImage': environment.baseUrl+'/assets/images/default.jpg',
    'defaultImage': environment.applicationUrl + '/assets/images/apple-macbook-2016-nw-g03.jpg',
    'rfqLimit': 150000,
    'clinId': 'CLIN_201607292236575507956_XXXX_4FCAA09271E94AB9AB0CFC7622F8EF33',
    'custId': 'ORGFC201612142303279895284_0500_05E0CEAB9D86438E999A6D28CD634F67',
    'contractIdf': 'CTRC785496523',
    'OMBRestrict': ['L4', 'M4', 'T1', 'T2'],
    "userId": "USER_201612142304205097769_0500_01AFBBB3C8E74D01A1E85B336515AD4E",
    "orgId": "ORGFC201612142303279895284_0500_05E0CEAB9D86438E999A6D28CD634F67"
}

export const loginUser = {
    "userId": "PER__201612112224320514895_0500_ACD2B3311FF64D23BA85F34FD444670B",
    "firstName": "sri",
    "lastName": "srikanth",
    "email": "srikanth@gmail.com",
    "phNo": "(571) 766-2824",
    //"orgId": "ORGCH201612142303278176344_0500_6C477A2E5CBF4D1485582D3C5E322FA6",
    "orgId": "ORGCH201612142303278176344_0500_01C54EE777664943AE3AC46846B55AC0",
    "address": {
        "state": "",
        "city": "Phoenix",
        "street2": "Suite 504",
        "street1": "40 N Central Ave",
        "zip": "85004     ",
        "street3": null
    }
}

export const filterCodes = {
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

export const filters = [
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
export const Brands = [
    // {'id': 'lenovo', 'label': 'Lenovo'},
    { 'id': 'dell', 'label': 'Dell' },
    { 'id': 'hp', 'label': 'HP' }
];

export const _devicetypes = [
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

export const _configurations = [
    { id: "Basic", label: "Basic Configuration", specs: 'L1,D1' },
    { id: "OMB", label: "OMB Compliant", specs: "L1,D1,L2,D2,D3" },
    { id: "L2", label: "Lightweight Laptop", specs: "8 GB RAM!180 GB hard drive!13 in. max display!3.5 lbs or less!" },
    { id: "L3", label: "High level Laptop", specs: "16 GB RAM!500 GB hard drive!15 in. min display!6.5 lbs or less!" },
    { id: "D2", label: "Desktop Upgrade 1", specs: "16 GB RAM!500 GB hard drive!6 USB ports!" },
    { id: "D3", label: "Desktop Upgrade 2", specs: "32 GB RAM!256 GB SSD & 1 TB hard drive!8 USB ports!" }
]
export const _brands = [
    { id: "Apple,OS X", label: "Apple", specs: "" },
    { id: "Dell", label: "Dell", specs: "" },
    { id: "Fujitus", label: "Fujitus", specs: "" },
    { id: "Getac", label: "Getac", specs: "" },
    { id: "HP", label: "HP", specs: "" },
    { id: "Lenovo", label: "Lenovo", specs: "" },
    { id: "Panasonic", label: "Panasonic", specs: "" },
]
export const _operating_systems = [
    { id: "mac", label: "Mac" },
    { id: "pc", label: "PC" }
    //               { id: "other", label: "Other" }
]

export const _processors = [
    { id: "i3", label: "i3 Processor" },
    { id: "i5", label: "i5 Processor" },
    { id: "i7", label: "i7 Processor" }
    //                { id: "other", label: "Other" }
]
export const _rams = [
    { id: "8", label: "8GB" },
    { id: "16", label: "16GB" }
    //                { id: "other", label: "Other" }
]

export const _harddrives = [
    { id: "500", label: "500GB" },
    { id: "1000", label: "1TB" }
    //                { id: "other", label: "Other" }
]

export const _weights = [
    { id: "<3", label: "Less than 3lbs" },
    { id: "3-6", label: "3 - 6 lbs" },
    { id: ">6", label: "More than 6lbs" }
]


export const _selects = {
    ids: ['device', 'configuration', 'brand', 'os',
        'processor', 'ram', 'harddrive', 'weight'],
    device: {
        label: 'Device Type',
        options: _devicetypes,
        selected: [],
        applied: ''
    },
    configuration: {
        label: 'Configurations',
        options: _configurations,
        selected: [],
        applied: ''
    },
    brand: {
        label: 'Brand',
        options: _brands,
        selected: [],
        applied: ''
    },
    os: {
        label: 'OS',
        options: _operating_systems,
        selected: [],
        applied: ''
    },
    processor: {
        label: 'Processor',
        options: _processors,
        selected: [],
        applied: ''
    },
    ram: {
        label: 'RAM',
        options: _rams,
        selected: [],
        applied: ''
    },
    harddrive: {
        label: 'Hard Drive',
        options: _harddrives,
        selected: [],
        applied: ''
    },
    weight: {
        label: 'Weight',
        options: _weights,
        selected: [],
        applied: ''
    }
}
/**
 * Array subtraction e.g.
 * [obj1,obj2,obj3].diff([obj2]) returns [obj1,obj2]
 */
declare global {
    interface Array<T> {
        diff(elem: Array<T>): Array<T>;
    }
}

if (!Array.prototype.diff) {
    Array.prototype.diff = function (a) {
        return this.filter(function (i) { return a.indexOf(i) < 0; });
    };
}
export let isOrderActive = { action: false };
