import { IsObservablePipe } from './is-observable.pipe';

describe('IsObservablePipe', () => {
  it('create an instance', () => {
    const pipe = new IsObservablePipe();
    expect(pipe).toBeTruthy();
  });
});
