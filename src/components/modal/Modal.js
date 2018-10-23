import ReactDOM from "react-dom";
import React from "react";
import StateContext from "../../StateContext";

class Modal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement("div");
  }

  componentDidMount() {
    this.props.appRef.current.appendChild(this.el);
  }

  componentWillUnmount() {
    this.props.appRef.current.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.el);
  }
}

let hocModal = props => (
  <StateContext.Consumer>
    {({ appRef }) => {
      return <Modal {...props} appRef={appRef} />;
    }}
  </StateContext.Consumer>
);

export default hocModal;
