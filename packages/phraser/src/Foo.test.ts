import { Foo } from "./Foo";

test('SimpleTest', () => {
    expect(true).toBe(true);
});

test('ActualTest', () => {
    // Arrange
    const spy = jest.spyOn(console, 'log');
    
    // Act
    new Foo().bar();

    // Validate
    expect(spy).toBeCalledWith('foo-bar');
});