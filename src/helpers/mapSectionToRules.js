/**
 *
 * @param {Object} section which has permissions field that we access to generate rules
 * @returns {Array} RawRule[] from casl library
 */

export default function mapSectionToRules(section) {
  return section.permissions.map((permission) => ({
    action: permission.name,
    subject: section.name,
    // fields: [],
    conditions: {}, // { published: true }
    inverted: false,
    reason: "",
  }));
}

/*

// The shape of raw rules

interface RawRule {
  action: string | string[]
  subject?: string | string[]
  // an array of fields to which user has (or not) access
  fields?: string[]
  // an object of conditions which restricts the rule scope
  conditions?: any
  // indicates whether rule allows or forbids something
  inverted?: boolean
  // message which explains why rule is forbidden
  reason?: string
}

*/
