
class Calculator {
  add( a, b ) {
    return a + b;
  }

  subtract( a, b ) {
    return a - b;
  }
}


describe( "calculate addition", function() {
  var calculate = new Calculator;
  it( "should be able to add two numbers together", function() {
    expect( calculate.add( 1, 3 ) ).toBe( 4 );
  } );
} );

describe( "calculate subtraction", function() {
  var calculate = new Calculator;
  it( "should be able to subtract two numbers", function() {
    expect( calculate.subtract( 1, 3 ) ).toBe( -2 );
  } );
} );
