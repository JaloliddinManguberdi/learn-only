import Vue from 'vue'

const rules = {
  required: val => !!val || 'This field is required',
  requiredArray: val => (Array.isArray(val) && val.length) || 'This field is required',
  min: (val, length) => val.length >= length || 'This field should be at least has $ {length} of length',
}

Vue.prototype.$rules = rules
