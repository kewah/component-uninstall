# component-uninstall

Uninstall dependencies from component.json

## Install

```
npm install -g component-uninstall
```

## Usage

component-uninstall(1) removes the dependency from the component.json and delete the folder in `/components`.
```
component uninstall component/emitter
```

or
```
component uninstall emitter
```

It is possible to remove multiple dependencies:

```
component uninstall component/emitter nk-components/math-fit
```
