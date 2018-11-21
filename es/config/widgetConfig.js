import _ from "lodash";
import widgets from '../components/widgets/actual';

export default (function (customWidgets) {
  return _.merge({}, widgets, customWidgets);
});