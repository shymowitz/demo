import { FinalOrderAddon } from './final-order-addon'; 

export interface FinalOrder {
    'clinId': '',
    'quantity': '0',
    'timeStamp': 'EST',
    'addons': FinalOrderAddon[],
    'customer': {
        'id': ''
    },
    'contractor': {
        'id': ''
    }
};