import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Spinner } from '/imports/react-ui/common';
import Alert from 'meteor/erxes-notifier';
import { Brands } from '/imports/api/brands/brands';
import { Chat } from '../components';

function composer(props, onData) {
  const brandsHandler = Meteor.subscribe('brands.list', 0);
  const brands = Brands.find().fetch();

  const save = (doc) => {
    let methodName = 'integrations.addChat';
    let params = { doc };

    if (props.integration) {
      methodName = 'integrations.editChat';
      params = { _id: props.integration._id, doc };
    }

    Meteor.call(methodName, params, (error) => {
      if (error) {
        return Alert.error(error.reason);
      }

      Alert.success('Congrats');
      return FlowRouter.go('/settings/integrations/list');
    });
  };

  if (brandsHandler.ready()) {
    return onData(null, { brands, save });
  }

  return null;
}

export default composeWithTracker(composer, Spinner)(Chat);
