import React, { PropTypes } from 'react';
import { Button } from 'react-bootstrap';
import {
  Pagination,
  TaggerPopover,
  EmptyState,
  ConversationsList,
} from '/imports/react-ui/common';
import { Wrapper } from '/imports/react-ui/layout/components';
import { AssignBoxPopover } from '../';
import { Resolver } from '../../containers';
import Sidebar from './Sidebar.jsx';


const propTypes = {
  readConversations: PropTypes.array.isRequired,
  unreadConversations: PropTypes.array.isRequired,
  loadMore: PropTypes.func.isRequired,
  hasMore: PropTypes.bool.isRequired,
  channels: PropTypes.array.isRequired,
  brands: PropTypes.array.isRequired,
  tags: PropTypes.array.isRequired,
  channelId: PropTypes.string,
  user: PropTypes.object,
  bulk: PropTypes.array.isRequired,
  toggleBulk: PropTypes.func.isRequired,
  emptyBulk: PropTypes.func.isRequired,
};

function List(props) {
  const {
    readConversations,
    unreadConversations,
    hasMore,
    loadMore,
    channels,
    tags,
    channelId,
    brands,
    user,
    bulk,
    toggleBulk,
    emptyBulk,
  } = props;

  /**
   * There must be only conversation ids in the 'bulk'
   * because we can't update its content when conversations are reactively changed.
   *
   * TODO: Pass this targets array to the 'Resolver' component and
   * find conversations by those ids on component
   */
  const targets = bulk.map(b => b._id);

  const actionBarLeft = (
    <div>
      <Resolver
        conversations={bulk}
        afterSave={emptyBulk}
      />

      <TaggerPopover
        type="conversation"
        targets={targets}
        trigger={
          <Button bsStyle="link">
            <i className="ion-pricetags" /> Tag <span className="caret" />
          </Button>
        }
        afterSave={emptyBulk}
      />

      <AssignBoxPopover
        targets={targets}
        trigger={
          <Button bsStyle="link">
            <i className="ion-person" /> Assign <span className="caret" />
          </Button>
        }
        afterSave={emptyBulk}
      />
    </div>
  );

  const actionBar = <Wrapper.ActionBar left={actionBarLeft} />;

  const renderUnreadConversations = (
    <ConversationsList
      conversations={unreadConversations}
      user={user}
      channelId={channelId}
      toggleBulk={toggleBulk}
    />
  );

  const renderReadConversations = (
    <ConversationsList
      conversations={readConversations}
      user={user}
      channelId={channelId}
      toggleBulk={toggleBulk}
    />
  );

  const content = (
    <Pagination hasMore={hasMore} loadMore={loadMore}>
      {renderUnreadConversations}
      {renderReadConversations}
    </Pagination>
  );

  const empty = (
    <EmptyState
      text="There aren’t any conversations at the moment."
      size="full"
      icon={<i className="ion-email" />}
    />
  );

  return (
    <div>
      <Wrapper
        header={<Wrapper.Header breadcrumb={[{ title: 'Inbox' }]} />}

        leftSidebar={
          <Sidebar
            channels={channels}
            brands={brands}
            tags={tags}
          />
        }

        actionBar={bulk.length ? actionBar : false}
        content={
          unreadConversations.length === 0 && readConversations.length === 0
          ? empty : content
        }
      />
    </div>
  );
}

List.propTypes = propTypes;

export default List;
