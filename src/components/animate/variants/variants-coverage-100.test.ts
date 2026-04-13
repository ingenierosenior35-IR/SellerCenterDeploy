import { varPath } from './path';
import { varFade } from './fade';
import { varZoom } from './zoom';
import { varFlip } from './flip';
import { varSlide } from './slide';
import { varScale } from './scale';
import { varBounce } from './bounce';
import { varRotate } from './rotate';
import * as variantsIndex from './index';
import { varBgPan, varBgColor, varBgKenburns } from './background';
import { varTap, varHover, transitionTap, transitionHover } from './actions';

describe('animate variants 100 coverage harness', () => {
  it('covers all variant factories and branches', () => {
    expect(varHover()).toEqual({ scale: 1.09 });
    expect(varHover(2)).toEqual({ scale: 2 });
    expect(varTap()).toEqual({ scale: 0.9 });
    expect(varTap(0.5)).toEqual({ scale: 0.5 });
    expect(transitionTap({ damping: 20 }).damping).toBe(20);
    expect(transitionHover({ duration: 1 }).duration).toBe(1);

    expect(varFade('in').animate).toBeDefined();
    expect(varFade('in', { transition: { duration: 1 } }).animate).toBeDefined();
    expect(varFade('inUp').animate).toBeDefined();
    expect(varFade('inDown').animate).toBeDefined();
    expect(varFade('inLeft').animate).toBeDefined();
    expect(varFade('inRight').animate).toBeDefined();
    expect(varFade('out').animate).toBeDefined();
    expect(varFade('outUp').animate).toBeDefined();
    expect(varFade('outDown').animate).toBeDefined();
    expect(varFade('outLeft').animate).toBeDefined();
    expect(varFade('outRight').animate).toBeDefined();

    expect(varZoom('in').animate).toBeDefined();
    expect(varZoom('in', { transitionIn: { duration: 1 }, transitionOut: { duration: 2 } }).animate).toBeDefined();
    expect(varZoom('inUp').animate).toBeDefined();
    expect(varZoom('inDown').animate).toBeDefined();
    expect(varZoom('inLeft').animate).toBeDefined();
    expect(varZoom('inRight').animate).toBeDefined();
    expect(varZoom('out').animate).toBeDefined();
    expect(varZoom('outUp').animate).toBeDefined();
    expect(varZoom('outDown').animate).toBeDefined();
    expect(varZoom('outLeft').animate).toBeDefined();
    expect(varZoom('outRight').animate).toBeDefined();

    expect(varFlip('inX').animate).toBeDefined();
    expect(varFlip('inX', { transitionIn: { duration: 1 }, transitionOut: { duration: 2 } }).animate).toBeDefined();
    expect(varFlip('inY').animate).toBeDefined();
    expect(varFlip('outX').animate).toBeDefined();
    expect(varFlip('outY').animate).toBeDefined();

    expect(varSlide('inUp').animate).toBeDefined();
    expect(varSlide('inUp', { distance: 50, transitionIn: { duration: 1 }, transitionOut: { duration: 2 } }).animate).toBeDefined();
    expect(varSlide('inDown').animate).toBeDefined();
    expect(varSlide('inLeft').animate).toBeDefined();
    expect(varSlide('inRight').animate).toBeDefined();
    expect(varSlide('outUp').animate).toBeDefined();
    expect(varSlide('outDown').animate).toBeDefined();
    expect(varSlide('outLeft').animate).toBeDefined();
    expect(varSlide('outRight').animate).toBeDefined();

    expect(varScale('in').animate).toBeDefined();
    expect(varScale('in', { transitionIn: { duration: 1 }, transitionOut: { duration: 2 } }).animate).toBeDefined();
    expect(varScale('inX').animate).toBeDefined();
    expect(varScale('inY').animate).toBeDefined();
    expect(varScale('out').animate).toBeDefined();
    expect(varScale('outX').animate).toBeDefined();
    expect(varScale('outY').animate).toBeDefined();

    expect(varBounce('in').animate).toBeDefined();
    expect(varBounce('in', { distance: 100, transition: { duration: 1 } }).animate).toBeDefined();
    expect(varBounce('inUp').animate).toBeDefined();
    expect(varBounce('inDown').animate).toBeDefined();
    expect(varBounce('inLeft').animate).toBeDefined();
    expect(varBounce('inRight').animate).toBeDefined();
    expect(varBounce('out').animate).toBeDefined();
    expect(varBounce('outUp').animate).toBeDefined();
    expect(varBounce('outDown').animate).toBeDefined();
    expect(varBounce('outLeft').animate).toBeDefined();
    expect(varBounce('outRight').animate).toBeDefined();

    expect(varRotate('in').animate).toBeDefined();
    expect(varRotate('in', { deg: 90, transitionIn: { duration: 1 }, transitionOut: { duration: 2 } }).animate).toBeDefined();
    expect(varRotate('out').animate).toBeDefined();

    expect(varPath().animate).toBeDefined();
    expect(varPath({ transition: { duration: 3 } }).animate).toBeDefined();

    expect(varBgColor(['#111', '#222']).animate).toBeDefined();
    expect(varBgColor(['#111', '#222'], { transition: { duration: 2 } }).animate).toBeDefined();
    expect(varBgKenburns('top').animate).toBeDefined();
    expect(varBgKenburns('top', { transition: { duration: 2 } }).animate).toBeDefined();
    expect(varBgKenburns('bottom').animate).toBeDefined();
    expect(varBgKenburns('left').animate).toBeDefined();
    expect(varBgKenburns('right').animate).toBeDefined();
    expect(varBgPan('top', ['#111', '#222']).animate).toBeDefined();
    expect(varBgPan('top', ['#111', '#222'], { transition: { duration: 2 } }).animate).toBeDefined();
    expect(varBgPan('right', ['#111', '#222']).animate).toBeDefined();
    expect(varBgPan('bottom', ['#111', '#222']).animate).toBeDefined();
    expect(varBgPan('left', ['#111', '#222']).animate).toBeDefined();

    expect(variantsIndex).toBeDefined();
  });
});
