import assert from 'node:assert/strict';
import { mayInitializeAlmanacAnalytics } from '../src/lib/observability/consent-policy.ts';
import { sanitizeAlmanacTransportProperties } from '../src/lib/observability/transport-filter.ts';

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


test('analytics never initializes without explicit opt-in', () => {
  for (const consent of ['pending', 'denied', null, undefined, true, 'yes']) {
    assert.equal(
      mayInitializeAlmanacAnalytics(true, consent, 'project-token', 'https://us.i.posthog.com'),
      false,
    );
  }
  assert.equal(
    mayInitializeAlmanacAnalytics(true, 'granted', 'project-token', 'https://us.i.posthog.com'),
    true,
  );
});

test('analytics stays off when disabled or configuration is missing', () => {
  assert.equal(mayInitializeAlmanacAnalytics(false, 'granted', 'token', 'host'), false);
  assert.equal(mayInitializeAlmanacAnalytics(true, 'granted', '', 'host'), false);
  assert.equal(mayInitializeAlmanacAnalytics(true, 'granted', 'token', ''), false);
  assert.equal(mayInitializeAlmanacAnalytics(true, 'granted', undefined, undefined), false);
});

test('outbound SDK-enriched URLs, referrers and sensitive context are dropped', () => {
  const event = sanitizeAlmanacTransportProperties('almanac_catalog_viewed', {
    surface: 'public',
    token: 'phc_public_project_token',
    distinct_id: 'anonymous-visit',
    '$current_url': 'https://example.test/?token=PRIVATE',
    '$pathname': '/invoice/PRIVATE',
    '$referrer': 'https://example.test/?email=learner@example.com',
    '$session_id': 'session-private',
    '$browser': 'Some Browser',
    phone: '+1 555 0101',
    study_content: 'private clinical case',
  });
  assert.deepEqual(event, {
    surface: 'public',
    $process_person_profile: false,
    token: 'phc_public_project_token',
    distinct_id: 'anonymous-visit',
  });
  for (const forbidden of ['PRIVATE', 'learner@example.com', 'session-private', 'private clinical case']) {
    assert.equal(JSON.stringify(event).includes(forbidden), false);
  }
});

test('SDK automatic events and invalid custom events are blocked at transport boundary', () => {
  for (const name of ['$pageview', '$autocapture', '$opt_in', '$exception', 'purchase_completed']) {
    assert.equal(sanitizeAlmanacTransportProperties(name, { surface: 'public', token: 'phc_public' }), null);
  }
  assert.equal(
    sanitizeAlmanacTransportProperties('almanac_request_started', { request_kind: 'EMAIL@example.com' }),
    null,
  );
});
