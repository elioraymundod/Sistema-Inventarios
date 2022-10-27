import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealizarAnalisisComponent } from './realizar-analisis.component';

describe('RealizarAnalisisComponent', () => {
  let component: RealizarAnalisisComponent;
  let fixture: ComponentFixture<RealizarAnalisisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealizarAnalisisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealizarAnalisisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
