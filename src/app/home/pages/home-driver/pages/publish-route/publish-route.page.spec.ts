import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishRoutePage } from './publish-route.page';

describe('PublishRoutePage', () => {
  let component: PublishRoutePage;
  let fixture: ComponentFixture<PublishRoutePage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PublishRoutePage]
    });
    fixture = TestBed.createComponent(PublishRoutePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
