import { currentUserAdapter } from './current-user.adapter';

describe('currentUserAdapter', () => {
  it('maps the basic customer fields', () => {
    const result = currentUserAdapter({
      customer: { email: 'a@b.co', firstname: 'A', lastname: 'B' },
    });
    expect(result).toMatchObject({ email: 'a@b.co', firstname: 'A', lastname: 'B' });
  });

  it('coerces null fields to empty strings', () => {
    const result = currentUserAdapter({
      customer: { email: null, firstname: null, lastname: null },
    });
    expect(result).toMatchObject({ email: '', firstname: '', lastname: '' });
  });

  it('coerces missing fields to empty strings', () => {
    const result = currentUserAdapter({ customer: {} });
    expect(result).toMatchObject({ email: '', firstname: '', lastname: '' });
  });
});
