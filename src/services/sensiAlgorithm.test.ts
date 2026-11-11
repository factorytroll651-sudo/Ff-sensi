import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateSensitivity, formatPointerSpeed } from './sensiAlgorithm';
import { POPULAR_DEVICES } from '../constants/devices';

test('calculateSensitivity returns valid baseline bounds for default device', () => {
  const device = POPULAR_DEVICES[0]; // POCO X6 Pro
  const result = calculateSensitivity({ device });

  assert.ok(result.general >= 50 && result.general <= 100);
  assert.ok(result.redDot >= 50 && result.redDot <= 100);
  assert.ok(result.scope2x >= 40 && result.scope2x <= 100);
  assert.ok(result.scope4x >= 30 && result.scope4x <= 100);
  assert.ok(result.scopeAwm >= 20 && result.scopeAwm <= 100);
  assert.ok(result.fireButtonSize >= 35 && result.fireButtonSize <= 65);
  assert.ok(result.recommendedDpi >= 300);
});

test('calculateSensitivity adjusts for aggressive rusher playstyle', () => {
  const device = POPULAR_DEVICES[0];
  const balanced = calculateSensitivity({ device, playstyle: 'balanced' });
  const rusher = calculateSensitivity({ device, playstyle: 'aggressive_rusher' });

  // Rusher should have equal or higher general sensitivity and smaller or equal fire button for quick flick
  assert.ok(rusher.general >= balanced.general);
  assert.ok(rusher.fireButtonSize <= balanced.fireButtonSize);
});

test('calculateSensitivity scales properly when 200 scale is chosen', () => {
  const device = POPULAR_DEVICES[0];
  const scale100 = calculateSensitivity({ device, sliderScale: '100' });
  const scale200 = calculateSensitivity({ device, sliderScale: '200' });

  assert.equal(scale200.general, scale100.general * 2);
  assert.equal(scale200.redDot, scale100.redDot * 2);
  assert.equal(scale200.scopeAwm, scale100.scopeAwm * 2);
});

test('formatPointerSpeed outputs descriptive text', () => {
  assert.equal(formatPointerSpeed(0), '0 (Default Center)');
  assert.ok(formatPointerSpeed(2).includes('+2'));
  assert.ok(formatPointerSpeed(-1).includes('-1'));
});
