import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { _ } from 'meteor/underscore';
import { ErxesMixin } from '/imports/api/utils';
import { Conversations } from '/imports/api/conversations/conversations';
import { Messages } from '/imports/api/conversations/messages';
import { Customers } from '/imports/api/customers/customers';
import { Channels } from '/imports/api/channels/channels';
import { Integrations } from '../integrations';
import { KIND_CHOICES } from '../constants';


// add in app messaging
export const addInAppMessaging = new ValidatedMethod({
  name: 'integrations.addInAppMessaging',
  mixins: [ErxesMixin],

  validate({ doc }) {
    check(doc, { name: String, brandId: String });
  },

  run({ doc }) {
    return Integrations.insert(
      _.extend(doc, { kind: KIND_CHOICES.IN_APP_MESSAGING }),
    );
  },
});

// edit in app messaging
export const editInAppMessaging = new ValidatedMethod({
  name: 'integrations.editInAppMessaging',
  mixins: [ErxesMixin],

  validate({ _id, doc }) {
    check(_id, String);
    check(doc, { name: String, brandId: String });
  },

  run({ _id, doc }) {
    return Integrations.update({ _id }, { $set: doc });
  },
});


// add chat
export const addChat = new ValidatedMethod({
  name: 'integrations.addChat',
  mixins: [ErxesMixin],

  validate({ doc }) {
    check(doc, { name: String, brandId: String });
  },

  run({ doc }) {
    return Integrations.insert(
      _.extend(doc, { kind: KIND_CHOICES.CHAT }),
    );
  },
});

// edit chat
export const editChat = new ValidatedMethod({
  name: 'integrations.editChat',
  mixins: [ErxesMixin],

  validate({ _id, doc }) {
    check(_id, String);
    check(doc, { name: String, brandId: String });
  },

  run({ _id, doc }) {
    return Integrations.update({ _id }, { $set: doc });
  },
});

// integration remove
export const remove = new ValidatedMethod({
  name: 'integrations.remove',
  mixins: [ErxesMixin],

  validate(id) {
    check(id, String);
  },

  run(id) {
    // check whether or not used in channels
    if (Channels.find({ integrationIds: { $in: [id] } }).count() > 0) {
      throw new Meteor.Error(
        'integrations.remove.usedInChannel',
        'You cannot delete this integration. It belongs to other channel.',
      );
    }

    // conversations
    const conversations = Conversations.find({ integrationId: id }).fetch();
    const conversationIds = _.pluck(conversations, '_id');

    // remove messages
    Messages.remove({ conversationId: { $in: conversationIds } });

    // remove conversations
    Conversations.remove({ integrationId: id });

    // remove customers
    Customers.remove({ integrationId: id });

    return Integrations.remove(id);
  },
});
