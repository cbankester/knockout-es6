"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _nameWithDescriptor = function (ctx) {
  return function (prop) {
    return {
      name: prop,
      descriptor: Object.getOwnPropertyDescriptor(ctx, prop)
    };
  };
};

var _makeObservable = function (ctx) {
  return function (name) {
    var init_value = arguments[1] === undefined ? undefined : arguments[1];

    var observable = ko.observable(init_value);
    Object.defineProperty(ctx, name, {
      enumerable: true,
      configurable: true,
      get: observable,
      set: observable
    });
  };
};

var _makeComputed = function (ctx) {
  return function (name, readFn) {
    var writeFn = arguments[2] === undefined ? null : arguments[2];

    var computed = ko.pureComputed({
      read: readFn,
      write: writeFn
    });
    Object.defineProperty(ctx, name, {
      enumerable: true,
      configurable: true,
      get: computed,
      set: writeFn ? computed : undefined
    });
  };
};

ko.BaseVM = (function () {
  function BaseVM() {
    var _this = this;

    _classCallCheck(this, BaseVM);

    var proto = Object.getPrototypeOf(this);

    Object.getOwnPropertyNames(this).map(_nameWithDescriptor(this)).filter(function (_ref) {
      var descriptor = _ref.descriptor;
      return descriptor.configurable;
    }).forEach(function (_ref) {
      var name = _ref.name;

      _this.makeObservable(name, _this[name]);
    });

    Object.getOwnPropertyNames(proto).map(_nameWithDescriptor(proto)).filter(function (_ref) {
      var descriptor = _ref.descriptor;
      return descriptor.configurable;
    }).filter(function (_ref) {
      var descriptor = _ref.descriptor;
      return "get" in descriptor;
    }).forEach(function (_ref) {
      var name = _ref.name;
      var _ref$descriptor = _ref.descriptor;
      var readFn = _ref$descriptor.get;
      var writeFn = _ref$descriptor.set;

      _this.makeComputed(name, { read: readFn.bind(_this), write: writeFn });
    });
  }

  _createClass(BaseVM, {
    makeObservable: {
      value: function makeObservable(prop_name, init_value) {
        _makeObservable(this)(prop_name, init_value);
      }
    },
    makeComputed: {
      value: function makeComputed(prop_name, readFn) {
        if ("function" === typeof readFn) _makeComputed(this)(prop_name, readFn.bind(this));else if (readFn.read) _makeComputed(this)(prop_name, readFn.read.bind(this), readFn.write ? readFn.write.bind(this) : null);else throw new Error("Second parameter should be either `Function` or {read: `Function` [, write: `Function`]}");
      }
    }
  });

  return BaseVM;
})();