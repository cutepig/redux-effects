'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bind = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          * Imports
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          */

var _isPromise = require('is-promise');

var _isPromise2 = _interopRequireDefault(_isPromise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Action Types
 */

var EFFECT_COMPOSE = 'EFFECT_COMPOSE';

/**
 * Effects
 */

function effects(_ref) {
  var dispatch = _ref.dispatch;
  var getState = _ref.getState;

  return function (next) {
    return function (action) {
      return action.type === EFFECT_COMPOSE ? composeEffect(action) : next(action);
    };
  };

  function composeEffect(action) {
    var q = promisify(maybeDispatch(action.payload));
    return action.meta && applyPromises(action.meta.steps, q);
  }

  function applyPromises() {
    var steps = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var q = arguments[1];

    return steps.reduce(function (q, _ref2) {
      var _ref3 = _slicedToArray(_ref2, 2);

      var _ref3$ = _ref3[0];
      var success = _ref3$ === undefined ? noop : _ref3$;
      var _ref3$2 = _ref3[1];
      var failure = _ref3$2 === undefined ? rethrow : _ref3$2;
      return q.then(function (val) {
        return promisify(maybeDispatch(success(val)));
      }, function (err) {
        return promisify(maybeDispatch(failure(err)));
      });
    }, q);
  }

  function maybeDispatch(action) {
    return action && dispatch(action);
  }
}

function promisify(val) {
  return Array.isArray(val) ? Promise.all(val.map(promisify)) : Promise.resolve(val);
}

function noop() {}
function rethrow(err) {
  throw err;
}

/**
 * Action creator
 */

function bind(action) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  return {
    type: EFFECT_COMPOSE,
    payload: action,
    meta: {
      steps: [args]
    }
  };
}

/**
 * Exports
 */

exports.default = effects;
exports.bind = bind;