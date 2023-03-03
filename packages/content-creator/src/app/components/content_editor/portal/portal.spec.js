'use strict';

import {
  PortalComponent
} from './portal.component';


describe( 'ES6 Unit Test for Portal component', () => {
  it( 'Wiring Check - function is not undefined', () => {
    expect( PortalComponent ).not.toBe( undefined );
  } );

} );
