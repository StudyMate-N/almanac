import assert from 'node:assert/strict';
import test from 'node:test';
import {
  ALMANAC_EVENT_ALLOWLIST,
  allowlistedAlmanacEvent,
} from '../src/lib/observability/event-contract.ts';

const validExamples = [
  ['almanac_catalog_viewed', { surface: 'public' }],
  ['almanac_request_started', { request_kind: 'custom' }],
  ['almanac_request_step_completed', { step: 'review' }],
  ['almanac_request_submitted', { request_kind: 'catalog' }],
  ['almanac_invoice_viewed', { surface: 'invoice' }],
  ['almanac_learning_opened', { surface: 'learner' }],
  ['almanac_client_error', { area: 'invoice', error_code: 'unavailable' }],
];

test('every published event has a valid, minimal payload', () => {
  assert.equal(Object.keys(ALMANAC_EVENT_ALLOWLIST).length, validExamples.length);
  for (const [name, props] of validExamples) {
    assert.deepEqual(allowlistedAlmanacEvent(name, props), {
      event: name,
      properties: props,
    });
  }
});

test('unexpected event names are refused', () => {
  assert.equal(allowlistedAlmanacEvent('purchase_completed', {}), null);
  assert.equal(allowlistedAlmanacEvent('$pageview', {}), null);
  assert.equal(allowlistedAlmanacEvent('__proto__', {}), null);
});

test('sensitive fields and identifying URL values never leave normalization', () => {
  const input = {
    request_kind: 'custom',
    email: 'student@example.com',
    case_id: 'private-case-17',
    invoice_number: 'A-12920',
    access_code: 'TOPSECRET',
    url: 'https://example.test/invoice?token=secret',
    $current_url: 'https://example.test/invoice?token=secret',
    notes: 'patient medical history',
  };
  const event = allowlistedAlmanacEvent('almanac_request_started', input);
  assert.deepEqual(event, {
    event: 'almanac_request_started',
    properties: { request_kind: 'custom' },
  });
  for (const secret of ['student@example.com', 'private-case-17', 'TOPSECRET', 'token=secret', 'patient medical history']) {
    assert.equal(JSON.stringify(event).includes(secret), false);
  }
});

test('invalid enum values fail closed', () => {
  assert.equal(allowlistedAlmanacEvent('almanac_request_started', { request_kind: 'student@example.com' }), null);
  assert.equal(allowlistedAlmanacEvent('almanac_client_error', { area: 'request', error_code: 'SQL select * from users' }), null);
  assert.equal(allowlistedAlmanacEvent('almanac_invoice_viewed', {}), null);
  assert.equal(allowlistedAlmanacEvent('almanac_catalog_viewed', { surface: new URL('https://example.test') }), null);
  assert.equal(allowlistedAlmanacEvent('almanac_request_started', null), null);
  assert.equal(allowlistedAlmanacEvent('almanac_request_started', ['custom']), null);
});

test('normalization never attempts a network request', () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => { throw new Error('network access not allowed by contract'); };
  try {
    assert.equal(allowlistedAlmanacEvent('almanac_catalog_viewed', { surface: 'public' })?.event, 'almanac_catalog_viewed');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
