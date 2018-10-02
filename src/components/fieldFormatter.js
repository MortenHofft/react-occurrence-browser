import React, { Component } from 'react';

export default (getData) => (
  class FieldFormat extends Component {
    constructor(props) {
      super(props);
      this.getTitle = this.getTitle.bind(this);
      this.state = {
        title: ''
      }
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
      getData(this.props.id)
        .then(
          (result) => {
            console.log('get');
            this.setState({ title: result.title });
          },
          (error) => {
            this.setState({ title: 'unknown', error: true });
          }
        );
    }
    render() {
      let title = this.state.error ? <span className="discreet">unknown</span> : this.state.title;
      return (
        <span>{title}</span>
      );
    }
  }
);