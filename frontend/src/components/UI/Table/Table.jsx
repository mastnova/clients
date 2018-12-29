import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './Table.scss';

const TableHeader = ({ children }) => {
  return (
    <thead>
      <tr className="table__header">
        {
          children.map(cell => <th>{cell}</th>)
        }
      </tr>
    </thead>
  );
}

const TableRow = ({ children }) => {
  return (
    <tr className="table__row">
      {
        children.map(cell => <td>{cell}</td>)
      }
    </tr>
  );
}

class Table extends PureComponent {

  static Header = TableHeader;

  static Row = TableRow;

  render() {
    const cls = cn(['table', this.props.className]);
    return (
      <table className={cls}>
        {this.props.children}
      </table>
    );
  }
}

Table.propTypes = {
  className: PropTypes.string,
};



export default Table;