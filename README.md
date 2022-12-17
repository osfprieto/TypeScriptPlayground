# TypeScript template

This is a repo with a quick starter project that includes:

- `TypeScript` as the compiler language.
- `yarn` as the dependency manager.
- `just` to help define tasks within the package.

## Pre-requisities

Download and install `NodeJS`.

Install `yarn` by running:

```bash
npm i -g yarn
```

## Installing dependencies locally

Run `yarn` so it installs all the required modules.

## Run the tasks

Refer to the [package.json](./package.json) definition for the scripts that you can run. Some include:

- `yarn clean`.
- `yarn build`.
- `yarn test`.
- `yarn start`.

### Running a task on a specific package

`yarn <foo> --to <package>`.