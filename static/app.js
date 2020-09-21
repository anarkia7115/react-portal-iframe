'use strict';

class StylePortal extends React.Component {
  genStyleCss(styleMap) {
    /**
     * styleMap:
     *  {
     *    [labelGroupName:string]: {
     *      selector: string
     *      rules: {[ruleKey:string]: styleValue}
     *    }
     *  }
     * 
     * input: styleMap
     * output: css string
     * .title { // title
     *   background: blue;
     *   display: block;
     * }
     * .ad { // ad
     *   background: black;
     *   display: none;
     * }
     */

    return Object.keys(styleMap).map(labelGroupName => {
      let style = styleMap[labelGroupName]
      // string[]: row to rules: (ex: `background: black;`)
      let styleRowList = Object.keys(style.rules).map(ruleKey => {
        let styleValue = style.rules[ruleKey]
        let styleRow = `${ruleKey}: ${styleValue};`
        return styleRow
      })
      /**
       * css example:
       * .title {
       *  bg: aa;
       *  bk: none;
       * }
       */
      let css = `
        ${style.selector} { /* ${labelGroupName} */
          ${styleRowList.join("\n")}
        }`
      return css
    }).join("\n")
  }

  render() {
    if (this.props.iframeLoaded) {
      let d = getIframeDoc()
      return ReactDOM.createPortal(
        <style>
          {this.genStyleCss(this.props.styleMap)}
        </style>, 
        d.getElementById("injected")
      )
    } else {
      return <p>Loading iframe</p>
    }
  }
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      iframeLoaded:false,
      styleMap: {
        title: {
          selector:".title",rules:{
            display:"block", 
            background:"orange"}}, 
        body: {
          selector:".body", rules: {
            display:"block", 
            background:"yellow"
          }
        }
      }
    }
  }

  handleIframeLoaded() {
    let d = getIframeDoc()
    let injected = d.createElement("div")
    injected.setAttribute("id", "injected")
    d.firstElementChild.prepend(injected)
    this.setState({iframeLoaded:true})
  }

  render() {
    return (
    <div>
      <iframe
        id="iframe"
        src="./static/iframe.html"
        onLoad={this.handleIframeLoaded.bind(this)}
        >
      </iframe>
      <StylePortal 
        iframeLoaded={this.state.iframeLoaded}
        styleMap={this.state.styleMap}/>
    </div>
    )
  }
}

function getIframeDoc() {
  return document.querySelector("iframe").contentWindow.document
}

const domContainer = document.querySelector('#app');
ReactDOM.render(<App/>, domContainer);

