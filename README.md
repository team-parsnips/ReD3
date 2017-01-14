## ReD3
ReD3 is a React library to allow developers to easily add D3 graphs to their projects.

ReD3 acts a high level wrapper, abstracting away the D3 syntax and exposing only the high level props to let the user "plug and play."

### Installation and Usage

Using npm:

    $ npm install --save red3

Import the graph from the library:

```js
import { Pie } from 'red3'
```

Add the graph to your component:

```js
render() {
  return (
    <div>
      <Pie data={data} />
    </div>
  )
}
```

Done!

### Documentation

Refer to the [official documentation page](http://red3.herokuapp.com) 

### Thanks
Thanks to Mike Bostock for creating D3 and providing a vast number of resources.