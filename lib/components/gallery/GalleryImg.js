'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactJss = require('react-jss');

var _reactJss2 = _interopRequireDefault(_reactJss);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
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

var GalleryImg = function (_Component) {
    _inherits(GalleryImg, _Component);

    function GalleryImg(props) {
        _classCallCheck(this, GalleryImg);

        var _this = _possibleConstructorReturn(this, _Component.call(this, props));

        _this.onLoad = _this.onLoad.bind(_this);
        _this.state = {};
        return _this;
    }

    GalleryImg.prototype.componentDidMount = function componentDidMount() {};

    GalleryImg.prototype.componentWillUnmount = function componentWillUnmount() {}
    // Cancel fetch callback?


    //   componentDidUpdate(prevProps) {
    //     if (prevProps.src !== this.props.src) {
    //       this.updateResults();
    //     }
    //   }

    ;

    GalleryImg.prototype.onLoad = function onLoad(event) {
        var element = event.target;
        this.setState({ backgroundImg: '//api.gbif.org/v1/image/unsafe/x260/' + encodeURIComponent(this.props.src) });

        var ratio = element.naturalWidth / element.naturalHeight;
        this.setState({ ratio: ratio, valid: true });
    };

    GalleryImg.prototype.render = function render() {
        var styleItem = { backgroundImage: 'url(' + this.state.backgroundImg + ')', width: this.state.ratio * 150 + 'px' };
        return _react2.default.createElement(
            'a',
            { href: '', style: styleItem, className: this.props.classes.img },
            _react2.default.createElement('img', { src: '//api.gbif.org/v1/image/unsafe/x260/' + encodeURIComponent(this.props.src), width: '100', onLoad: this.onLoad, alt: 'Occurrence evidence' })
        );
    };

    return GalleryImg;
}(_react.Component);

exports.default = (0, _reactJss2.default)(styles)(GalleryImg);
module.exports = exports['default'];