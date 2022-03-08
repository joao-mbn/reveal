import range from 'lodash/range';

import { Point } from '../Point';

describe('Point', () => {
  test('rotate without pivot', async () => {
    const rightPoint = new Point(1, 0);

    const upPoint = rightPoint.rotate(90);
    expect(upPoint.x).toBeCloseTo(0);
    expect(upPoint.y).toBeCloseTo(1);

    const leftPoint = rightPoint.rotate(180);
    expect(leftPoint.x).toBeCloseTo(-1);
    expect(leftPoint.y).toBeCloseTo(0);

    const downPoint = rightPoint.rotate(270);
    expect(downPoint.x).toBeCloseTo(0);
    expect(downPoint.y).toBeCloseTo(-1);
  });

  test('rotate with pivot around itself', async () => {
    const point = new Point(1, 0);

    range(0, 360, 5).forEach((degAngle) => {
      const rotateAroundItself = point.rotate(degAngle, point);
      expect(rotateAroundItself.x).toBeCloseTo(point.x);
      expect(rotateAroundItself.y).toBeCloseTo(point.y);
    });
  });

  test('rotate with pivot', async () => {
    const rightPoint = new Point(1, 0);

    const rotatedPoint1 = rightPoint.rotate(180, new Point(2, 0));
    expect(rotatedPoint1.x).toBeCloseTo(3);
    expect(rotatedPoint1.y).toBeCloseTo(0);

    const rotatedPoint2 = rightPoint.rotate(90, new Point(2, 0));
    expect(rotatedPoint2.x).toBeCloseTo(2);
    expect(rotatedPoint2.y).toBeCloseTo(-1);
  });
});
