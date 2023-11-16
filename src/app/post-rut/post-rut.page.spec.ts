import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostRutPage } from './post-rut.page';

describe('PostRutPage', () => {
  let component: PostRutPage;
  let fixture: ComponentFixture<PostRutPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PostRutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
