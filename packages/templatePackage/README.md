# template package

This is just a package that uses TypeScript and Just to build a TS example.

## Used dependencies

Defined in the `package.json` file, these are used for different applications:

### `typescript`

Used for compiling TS into JS. It knows to pick up the configuration from `tsconfig.json` which is configured to transpile to `JS` into the `/lib/` folder.

### `just-scripts`

Defines tasks that are useful for some common steps within the repo. The tasks are configured by `just-task.js` and they can are used in the `scripts` section of the `package.json` definition.

### `jest`

To enable running tests locally. It knows to pick the configuration from `jest.config.js`.

### `ts-jest`

Includes presets for runnig `jest` on `ts` files.

### `@types/jest`

Used locally to have make it easier to write test definitions.

## Usage

### Repo wide

Run using `yarn` from the root of the repo, feel free to fork the entire repo. This is useful to enable modular definition of packages. For more details refer to the repo's [README](../../README.md).

### Stand-alone package
If you want to use this package on its own, feel free to copy it and just run `npm install` on from the package to install all depdendencies, from then on you can run `npm run <foo>` to run any of the scripts defined in the `package.json` file.
