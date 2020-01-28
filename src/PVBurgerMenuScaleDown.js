Object.defineProperty(exports, '__esModule', {
  value: true,
});

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

let _menuFactory = require('react-burger-menu/lib/menuFactory');

let _menuFactory2 = _interopRequireDefault(_menuFactory);

let styles = {
  menuWrap: function menuWrap(isOpen, width, right) {
    return {
      position: 'absolute',
    };
  },

  pageWrap: function pageWrap(isOpen, width) {
    return {
      MozTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      MsTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      OTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      WebkitTransform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      transform: isOpen ? '' : 'translate3d(0, 0, -' + width + ')',
      transformOrigin: '100%',
      transformStyle: 'preserve-3d',
      transition: 'all 0.5s',
      position: 'absolute',
    };
  },

  outerContainer: function outerContainer() {
    return {
      perspective: '1500px',
    };
  },
};

exports['default'] = (0, _menuFactory2['default'])(styles);
module.exports = exports['default'];
