import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import API from '../../API';

class Operators extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      operators: [],
    };
  }

  componentWillMount() {
    this.fetchOps();
  }

  fetchOps = async () => {
    const clubId = this.props.match.params.id;
    const operators = await API.getOperators(clubId);
    if (operators) {
      this.setState({ operators });
    }
  }

  onAddOperator = () => {
    const id = this.props.match.params.id;
    this.props.openPopup('add-operator', { id });
  }

  render() {
    return (
      <div>
        <p>Ops</p>
        {
          this.state.operators.map( op => <div>{op.login} - {op.created} - {op.status}</div>)
        }
        <button onClick={this.onAddOperator}>Add operator</button>
        </div>
    );
  }
}

Operators.propTypes = {
  
};

export default Operators;