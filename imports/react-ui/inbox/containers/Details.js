import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { composeWithTracker } from 'react-komposer';
import { Conversations } from '/imports/api/conversations/conversations';
import { Messages } from '/imports/api/conversations/messages';
import { Integrations } from '/imports/api/integrations/integrations';
import { ResponseTemplates } from '/imports/api/responseTemplates/responseTemplates';
import { Loader } from '/imports/react-ui/common';
import { Details } from '../components';

const attachmentPreview = new ReactiveVar({});

function composer({ id, channelId }, onData) {
  // subscriptions
  Meteor.subscribe('responseTemplates.list');
  const conversationHandle = Meteor.subscribe('conversations.detail', id);
  const messagesHandle = Meteor.subscribe('conversations.messageList', id);

  // =============== actions
  const changeStatus = (conversationId, status, callback) => {
    Meteor.call(
      'conversations.changeStatus',
      { conversationIds: [conversationId], status },
      callback,
    );
  };

  const setAttachmentPreview = (previewObject) => {
    attachmentPreview.set(previewObject);
  };

  // subscriptions are ready
  if (conversationHandle.ready() && messagesHandle.ready()) {
    const conversation = Conversations.findOne(id);
    const messages = Messages.find(
      { conversationId: id },
      { sort: { createdAt: 1 } },
    ).fetch();
    const integrationId = conversation.integrationId;

    // sub subscriptions
    const integrationHandle = Meteor.subscribe('integrations.getById', integrationId);
    const tagsHandle = Meteor.subscribe('tags.tagListByIds', conversation.tagIds || []);
    const usersHandle = Meteor.subscribe('users.list', {});

    if (integrationHandle.ready() && tagsHandle.ready() && usersHandle.ready()) {
      const integration = Integrations.findOne({ _id: integrationId });

      // brand, channels subscription
      Meteor.subscribe('brands.getById', integration.brandId);
      Meteor.subscribe('channels.list', { integrationIds: [integration._id] });

      // mark as read
      const readUserIds = conversation.readUserIds || [];

      if (!readUserIds.includes(Meteor.userId())) {
        Meteor.call('conversations.markAsRead', { conversationId: id });
      }

      onData(
        null,
        {
          conversation,
          messages,
          channelId,
          changeStatus,
          setAttachmentPreview,
          attachmentPreview: attachmentPreview.get(),
          responseTemplates: ResponseTemplates.find().fetch(),
        },
      );
    }
  }
}

export default composeWithTracker(composer, Loader)(Details);
