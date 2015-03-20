class TestVM extends ko.BaseVM {
  constructor() {
    this.foo = 'foo';
    this.bar = 'bar';
    super();
  }

  get fooBar() {
    return this.foo + this.bar;
  }

  set fooBar(val) {
    let v1 = val.slice(0,3), v2 = val.slice(3);
    this.foo = v1;
    this.bar = v2;
  }
}
