import { z } from 'zod';

import { testCase, schemaUtils } from './schema-utils';

describe('schemaUtils', () => {
  it('phoneNumber required/invalid/valid', () => {
    const s = schemaUtils.phoneNumber({ isValid: (v) => v.length >= 10 });
    expect(s.safeParse('').success).toBe(false);
    expect(s.safeParse('123').success).toBe(false);
    expect(s.safeParse('1234567890').success).toBe(true);
  });

  it('email branches', () => {
    expect(schemaUtils.email().safeParse('').success).toBe(false);
    expect(schemaUtils.email().safeParse('bad').success).toBe(false);
    expect(schemaUtils.email().safeParse('ok@mail.com').success).toBe(true);
  });

  it('date branches', () => {
    expect(schemaUtils.date().safeParse(undefined).success).toBe(false);
    expect(schemaUtils.date().safeParse('').success).toBe(false);
    expect(schemaUtils.date().safeParse('not-a-date').success).toBe(false);
    expect(schemaUtils.date().safeParse('2026-01-01').success).toBe(true);
  });

  it('editor branches', () => {
    expect(schemaUtils.editor().safeParse('').success).toBe(false);
    expect(schemaUtils.editor().safeParse('<p></p>').success).toBe(false);
    expect(schemaUtils.editor().safeParse('hello').success).toBe(true);
  });

  it('nullableInput', () => {
    const s = schemaUtils.nullableInput(z.string());
    expect(s.safeParse(null).success).toBe(false);
    expect(s.safeParse(undefined).success).toBe(false);
    expect(s.safeParse('ok').success).toBe(true);
  });

  it('boolean', () => {
    expect(schemaUtils.boolean().safeParse(false).success).toBe(false);
    expect(schemaUtils.boolean().safeParse(true).success).toBe(true);
  });

  it('sliderRange', () => {
    const s = schemaUtils.sliderRange({ min: 1, max: 10 });
    expect(s.safeParse([1, 10]).success).toBe(true);
    expect(s.safeParse([0, 10]).success).toBe(false);
  });

  it('file/files', () => {
    expect(schemaUtils.file().safeParse(null).success).toBe(false);
    expect(schemaUtils.file().safeParse('file-url').success).toBe(true);
    expect(schemaUtils.files({ error: 'required' }).safeParse([]).success).toBe(false);
    expect(schemaUtils.files({ error: 'required' }).safeParse(['a']).success).toBe(true);
  });

  it('testCase executes console.info branches', () => {
    const spy = jest.spyOn(console, 'info').mockImplementation(() => {});
    testCase(z.string(), ['ok', 1]);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});
