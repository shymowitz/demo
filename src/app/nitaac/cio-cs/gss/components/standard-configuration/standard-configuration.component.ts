import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MdMenuTrigger } from '@angular/material';



@Component({
  selector: 'standard-configuration',
  templateUrl: './standard-configuration.component.html',
  styleUrls: ['./standard-configuration.component.scss']
})
export class StandardConfigurationComponent implements OnInit {
  public stdConfigList: [{ name: string, link: string, submenu: boolean, sub?: any }];
  url = 'https://s3.amazonaws.com/neos-xapps-dev-s3bucketforwebsitecontent-1n4lc2awh3ps4/GSS-standard-config-files';



  @ViewChild(MdMenuTrigger) trigger: MdMenuTrigger;


  open() {
    this.trigger.openMenu();
  }




  constructor() { }

  ngOnInit(): void {
    this.stdConfigList = [{
      name: 'Laptop',
      link: this.url + '/Laptop.pdf',
      submenu: false
    },
    {
      name: 'Lightweight Laptop',
      link: this.url + '/Laptop_Lightweight.pdf',
      submenu: false
    },
    {
      name: 'High Level Laptop',
      link: this.url + '/Laptop_High_level.pdf',
      submenu: false
    },
    {
      name: 'Desktop',
      link: this.url + './Desktop.pdf',
      submenu: false
    },
    {
      name: 'Desktop Upgrade 1',
      link: this.url + '/Desktop_1.pdf',
      submenu: false
    },
    {
      name: 'Desktop Upgrade 2',
      link: this.url + '/Desktop_2.pdf',
      submenu: false
    },
    {
      name: 'Mac Laptop',
      link: this.url + '/Mac_laptop_Standard_Size.pdf',
      submenu: false
    },
    {
      name: 'Mac Desktop',
      link: this.url + '/Mac_Desktop.pdf',
      submenu: false
    },
    {
      name: 'Tablets',
      link: '#',
      submenu: true,
      sub: [
        {
          name: 'test',
          link: 'this is a test'
        },
        {
          name: 'test2',
          link: 'this is a test 2'
        }
      ]
    }

    ];
  }
}



