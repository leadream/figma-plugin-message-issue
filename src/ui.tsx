import * as React from 'react'
import * as ReactDOM from 'react-dom'
import JSZip from 'jszip'
import saveAs from 'file-saver'

import './ui.css'

class App extends React.Component {

  state = {
    icons: []
  }

  onStart = () => {
    parent.postMessage({pluginMessage: {type: 'get-buffer'}}, '*');
  }

  onExport = () => {
    const { icons } = this.state
    var zip = new JSZip();
    icons.map(({name, svg}) => {
      zip.file(name.replace(/\s+/g, '')+'.svg', svg);
    })
    zip.generateAsync({type:"blob"})
      .then(function(content) {
          saveAs(content, "icons.zip");
      });
  }

  componentDidMount () {
    window.onmessage = (event) => {
      const { type, message } = event.data.pluginMessage;
      if (type === 'svg-got') {
        this.setState({icons: message})
      };
    }
  }

  render() {
    const { icons } = this.state
    return (
      <div>
        <ul>
        {
          icons.map(({name, svg}, index) => <li key={index}>
            <div dangerouslySetInnerHTML={{__html: svg}}/>
            <p>{name}</p>
          </li>)
        }
        </ul>
        <button onClick={this.onStart}>Get SVG</button>
        <button onClick={this.onExport}>Export</button>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('react-page'))
