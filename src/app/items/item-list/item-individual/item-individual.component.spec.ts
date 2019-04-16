import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemIndividualComponent } from './item-individual.component';

describe('ItemIndividualComponent', () => {
  let component: ItemIndividualComponent;
  let fixture: ComponentFixture<ItemIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemIndividualComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
