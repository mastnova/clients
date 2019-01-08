import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Table from '../Table/Table';
import Pagination from '../Pagination/Pagination';

class TableWithPagination extends PureComponent {

  defaultProps = {
    className: '',
    data: [],
  }

  state = {
    currentPage: 1,
    rowsPerPage: 10,
  };

  componentWillReceiveProps() {
    this.setState({currentPage: 1})
  }

  onChangePage = (currentPage) => {
    this.setState({ currentPage });
  }

  filterByPage = (items) => {
    const start = (this.state.currentPage - 1) * this.state.rowsPerPage;
    const end = start + this.state.rowsPerPage;
    return items.slice(start, end)
  }

  render() {
    const filteredData = this.filterByPage(this.props.data);
    return (
      <div>
        <Table className={this.props.className}>
          <Table.Header>{this.props.header}</Table.Header>
          <tbody>
          {
            filteredData.map((item, i) => (
              <Table.Row key={item.id || i}>
                {this.props.mappingFn(item, i)}
              </Table.Row>
            ))
          }
          </tbody>
        </Table>
        {
          this.props.data.length > this.state.rowsPerPage &&
          <Pagination
            pagesCount={Math.ceil(this.props.data.length / this.state.rowsPerPage)}
            currentPage={this.state.currentPage}
            onChange={this.onChangePage}
          />
        }
      </div>
    );
  }
}

TableWithPagination.propTypes = {
  className: PropTypes.string,
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  mappingFn: PropTypes.func.isRequired,
  data: PropTypes.array,
};

export default TableWithPagination;