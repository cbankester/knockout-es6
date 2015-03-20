const _nameWithDescriptor = ctx => prop => ({
  name:       prop,
  descriptor: Object.getOwnPropertyDescriptor(ctx, prop)
});

const _makeObservable = ctx => (name, init_value = undefined) => {
  const observable    = ko.observable(init_value);
  Object.defineProperty(ctx, name, {
    enumerable:   true,
    configurable: true,
    get:          observable,
    set:          observable
  });
};

const _makeComputed = ctx => (name, readFn, writeFn = null) => {
  const computed = ko.pureComputed({
    read:  readFn,
    write: writeFn
  });
  Object.defineProperty(ctx, name, {
    enumerable:   true,
    configurable: true,
    get:          computed,
    set:          writeFn ? computed : undefined
  });
};

ko.BaseVM = class BaseVM {

  makeObservable(prop_name, init_value) {
    _makeObservable(this)(prop_name, init_value);
  }

  makeComputed(prop_name, readFn) {
    if ('function' === typeof readFn)
      _makeComputed(this)(prop_name, readFn.bind(this));
    else if (readFn.read)
      _makeComputed(this)(prop_name, readFn.read.bind(this), (readFn.write ? readFn.write.bind(this) : null));
    else
      throw new Error("Second parameter should be either `Function` or {read: `Function` [, write: `Function`]}")
  }

  constructor() {
    let proto = Object.getPrototypeOf(this);

    Object
      .getOwnPropertyNames(this)
      .map(_nameWithDescriptor(this) )
      .filter(({descriptor}) => descriptor.configurable )
      .forEach(({name}) => {
        this.makeObservable(name, this[name]);
      });

    Object
      .getOwnPropertyNames(proto)
      .map(_nameWithDescriptor(proto))
      .filter(({descriptor}) => descriptor.configurable)
      .filter(({descriptor}) => 'get' in descriptor)
      .forEach(({name, descriptor: {get: readFn, set: writeFn}}) => {
        this.makeComputed(name, {read: readFn.bind(this), write: writeFn});
      });
  }
}
