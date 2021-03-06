import React, { PropTypes, Component } from 'react';
import { Collapse } from 'react-bootstrap';
import { Wrapper } from '/imports/react-ui/layout/components';
import { EmptyState, Tagger } from '/imports/react-ui/common';


const propTypes = {
  customer: PropTypes.object.isRequired,
};

class TaggerSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isTaggerVisible: false,
    };

    this.toggleTagger = this.toggleTagger.bind(this);
  }

  toggleTagger(e) {
    e.preventDefault();
    const { isTaggerVisible } = this.state;
    this.setState({ isTaggerVisible: !isTaggerVisible });
  }

  renderTags(tags) {
    if (!tags.length) {
      return (
        <EmptyState
          icon={<i className="ion-pricetags" />}
          text="Not tagged yet"
          size="small"
        />
      );
    }

    return tags.map(({ _id, colorCode, name }) =>
      <li key={_id}>
        <i className="icon ion-pricetag" style={{ color: colorCode }} />
        {name}
      </li>
    );
  }

  render() {
    const { customer } = this.props;
    const tags = customer.getTags();

    return (
      <Wrapper.Sidebar.Section>
        <h3>
          Tags
          <a
            href="#"
            className="quick-button"
            onClick={this.toggleTagger}
          >
            <i className="ion-gear-a" />
          </a>
        </h3>

        <Collapse in={this.state.isTaggerVisible}>
          <div>
            <Tagger
              type="customer"
              targets={[customer._id]}
              className="sidebar-accordion"
              event="onClick"
            />
          </div>
        </Collapse>

        <ul className="filters no-link">
          {this.renderTags(tags)}
        </ul>
      </Wrapper.Sidebar.Section>
    );
  }
}

TaggerSection.propTypes = propTypes;

export default TaggerSection;
