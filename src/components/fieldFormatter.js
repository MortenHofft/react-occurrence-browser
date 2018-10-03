import React, { Component } from "react";

export default getData =>
  class FieldFormat extends Component {
    constructor(props) {
      super(props);
      this.getTitle = this.getTitle.bind(this);
      this.state = {
        title: ""
      };
    }

    componentDidMount() {
      this.getTitle();
    }

    componentWillUnmount() {
      // Cancel fetch callback?
    }

    componentDidUpdate(prevProps) {
      if (prevProps.id !== this.props.id) {
        this.getTitle();
      }
    }

    getTitle() {
      let dataResult = getData(this.props.id);
      // if it is a promise, then wait for it to return
      if (typeof dataResult.then === "function") {
        dataResult.then(
          result => {
            this.setState({ title: result.title });
          },
          error => {
            this.setState({ title: "unknown", error: true });
          }
        );
      } else {
        // the function simply returned a value.
        this.setState({ title: dataResult });
      }
    } 

    render() {
      let title = this.state.error ? (
        <span className="discreet">unknown</span>
      ) : (
        this.state.title
      );
      return <span>{title}</span>;
    }
  };
