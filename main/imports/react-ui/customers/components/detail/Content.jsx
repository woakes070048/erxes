import React, { PropTypes } from 'react';
import { Tabs, Tab } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { ConversationsList } from '../../../common';


const propTypes = {
  conversations: PropTypes.array.isRequired,
};

function Content({ conversations }) {
  return (
    <Tabs defaultActiveKey={1} id="customers-content-tab">
      <Tab eventKey={1} title="Conversations">
        <ConversationsList
          conversations={conversations}
          user={Meteor.user()}
        />
      </Tab>
      <Tab eventKey={2} title="Internal notes">Internal notes</Tab>
    </Tabs>
  );
}

Content.propTypes = propTypes;

export default Content;