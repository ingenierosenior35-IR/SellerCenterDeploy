import { paths } from './paths';

describe('paths', () => {
  it('has auth sign-in path', () => {
    expect(paths.auth.signIn).toBe('/auth/sign-in');
  });

  it('has auth sign-up path', () => {
    expect(paths.auth.signUp).toBe('/auth/sign-up');
  });

  it('has home root path', () => {
    expect(paths.home.root).toBe('/home');
  });

  it('has product root path', () => {
    expect(paths.product.root).toBe('/product');
  });

  it('has product load path', () => {
    expect(paths.product.load).toBe('/product/load');
  });

  it('has product uploadList path', () => {
    expect(paths.product.uploadList).toBe('/product/load/list');
  });

  it('product.details creates correct path', () => {
    expect(paths.product.details(42)).toBe('/product/42');
  });

  it('has return root path', () => {
    expect(paths.return.root).toBe('/return');
  });

  it('return.details creates correct path', () => {
    expect(paths.return.details(5)).toBe('/return/5');
  });

  it('has feedback root path', () => {
    expect(paths.feedback.root).toBe('/feedback');
  });

  it('has account root path', () => {
    expect(paths.account.root).toBe('/account');
  });

  it('has subaccount root path', () => {
    expect(paths.account.subaccount.root).toBe('/account/subaccount');
  });

  it('account.subaccount.details creates correct path', () => {
    expect(paths.account.subaccount.details(1)).toBe('/account/subaccount/1');
  });

  it('account.subaccount.edit creates correct path', () => {
    expect(paths.account.subaccount.edit(2)).toBe('/account/subaccount/2/edit');
  });

  it('has settings path', () => {
    expect(paths.settings).toBe('/settings');
  });

  it('has amplify auth paths', () => {
    expect(paths.auth.amplify.signIn).toBe('/auth/amplify/sign-in');
    expect(paths.auth.amplify.signUp).toBe('/auth/amplify/sign-up');
  });
});
