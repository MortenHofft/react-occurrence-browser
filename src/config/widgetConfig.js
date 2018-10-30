import _ from "lodash";
import widgets from '../components/widgets/actual';

export default (customWidgets) => {
  return _.merge({}, widgets, customWidgets);
};
