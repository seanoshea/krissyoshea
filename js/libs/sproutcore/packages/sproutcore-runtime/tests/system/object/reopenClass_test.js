// ==========================================================================
// Project:  SproutCore Runtime
// Copyright: ©2011 Strobe Inc. and contributors.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

module('system/object/reopenClass');

test('adds new properties to subclass', function() {
  
  var Subclass = SC.Object.extend();
  Subclass.reopenClass({
    foo: function() { return 'FOO'; },
    bar: 'BAR'
  });
  
  equals(Subclass.foo(), 'FOO', 'Adds method');
  equals(SC.get(Subclass, 'bar'), 'BAR', 'Adds property');
});

test('class properties inherited by subclasses', function() {
  
  var Subclass = SC.Object.extend();
  Subclass.reopenClass({
    foo: function() { return 'FOO'; },
    bar: 'BAR'
  });

  var SubSub = Subclass.extend();
  
  equals(SubSub.foo(), 'FOO', 'Adds method');
  equals(SC.get(SubSub, 'bar'), 'BAR', 'Adds property');
});

