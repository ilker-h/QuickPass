import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FolderIndividualComponent } from './folder-individual.component';

describe('FolderIndividualComponent', () => {
  let component: FolderIndividualComponent;
  let fixture: ComponentFixture<FolderIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FolderIndividualComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FolderIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
