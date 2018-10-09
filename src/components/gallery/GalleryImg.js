import React, { Component } from 'react';
import injectSheet from "react-jss";

const styles = {
    img: {
        background: '#eee',
        display: 'block',
        flex: '1 1 auto',
        position: 'relative',
        margin: 6,
        height: 180,
        width: 180,
        overflow: 'hidden',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        '& :hover': {
            boxShadow: '0 0 1px 1px rgba(0, 0, 0, 0.3)'
        },
        '& img': {
            display: 'none'
        }
    }
};

class GalleryImg extends Component {
    constructor(props) {
        super(props);
        this.onLoad = this.onLoad.bind(this);
        this.state = {
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    // Cancel fetch callback?
    }

//   componentDidUpdate(prevProps) {
//     if (prevProps.src !== this.props.src) {
//       this.updateResults();
//     }
//   }

    onLoad(event) {
        let element = event.target;
        this.setState({backgroundImg: '//api.gbif.org/v1/image/unsafe/x260/' + encodeURIComponent(this.props.src) });

        var ratio = (element.naturalWidth) / element.naturalHeight;
        this.setState({ratio: ratio, valid: true});
    }

    render() {
        let styleItem = {backgroundImage: 'url(' + this.state.backgroundImg + ')', width: `${this.state.ratio*150}px`};
        return (
            <a href="" style={styleItem} className={this.props.classes.img}>
                <img src={'//api.gbif.org/v1/image/unsafe/x260/' + encodeURIComponent(this.props.src) } width="100" onLoad={this.onLoad} alt="Occurrence evidence"/>
            </a>
        );
    }
}

export default injectSheet(styles)(GalleryImg);