/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CompareProductComponent } from './compare-product.component';

describe('CompareProductComponent', () => {
  let component: CompareProductComponent;
  let fixture: ComponentFixture<CompareProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompareProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompareProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
