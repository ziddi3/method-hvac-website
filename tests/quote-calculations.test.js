import test from 'node:test'
import assert from 'node:assert/strict'

import { calculateQuote, createLeadPayload } from '../src/quote-calculations.js'

test('calculateQuote returns transparent installation ranges with GST added', () => {
  const estimate = calculateQuote({
    service: 'furnace-install',
    packageTier: 'standard',
    homeSize: 'family',
  })

  assert.equal(estimate.serviceLabel, 'Furnace installation')
  assert.equal(estimate.packageLabel, 'Standard')
  assert.equal(estimate.homeSizeLabel, '1,200 to 2,000 sq. ft.')
  assert.ok(estimate.equipmentRange.low > 0)
  assert.ok(estimate.labourRange.low > 0)
  assert.ok(estimate.materialRange.low > 0)
  assert.equal(
    estimate.totalRange.low,
    estimate.subtotalRange.low + estimate.gstRange.low,
  )
  assert.equal(
    estimate.totalRange.high,
    estimate.subtotalRange.high + estimate.gstRange.high,
  )
})

test('low-cost maintenance estimates still include GST', () => {
  const estimate = calculateQuote({
    service: 'maintenance',
    packageTier: 'budget',
    homeSize: 'compact',
  })

  assert.deepEqual(estimate.subtotalRange, { low: 200, high: 250 })
  assert.deepEqual(estimate.gstRange, { low: 10, high: 13 })
  assert.deepEqual(estimate.totalRange, { low: 210, high: 263 })
})

test('repair estimates can legitimately have no equipment allowance', () => {
  const estimate = calculateQuote({
    service: 'service-repair',
    packageTier: 'budget',
    homeSize: 'compact',
  })

  assert.equal(estimate.equipmentRange.low, 0)
  assert.equal(estimate.equipmentRange.high, 0)
  assert.ok(estimate.labourRange.low > 0)
  assert.ok(estimate.materialRange.low > 0)
})

test('createLeadPayload stores a GoHighLevel-ready quote structure', () => {
  const selections = {
    service: 'maintenance',
    packageTier: 'premium',
    homeSize: 'large',
  }
  const estimate = calculateQuote(selections)
  const payload = createLeadPayload(
    {
      selections,
      contact: {
        name: 'Alex Method',
        email: 'alex@example.com',
        phone: '403-555-0100',
        postalCode: 'T2X 1A1',
        timeline: 'Within 30 days',
        notes: 'Spring maintenance visit requested.',
      },
    },
    estimate,
  )

  assert.equal(payload.integrationTarget, 'GoHighLevel')
  assert.equal(payload.integrationStatus, 'ready-for-api-connection')
  assert.equal(payload.quote.serviceLabel, 'Maintenance')
  assert.deepEqual(payload.quote.totalEstimate, estimate.totalRange)
  assert.equal(payload.contact.name, 'Alex Method')
})
