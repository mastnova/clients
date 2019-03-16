import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Table from '../Table/Table';
import Pagination from '../Pagination/Pagination';

class TableWithPagination extends PureComponent {

  static defaultProps = {
    className: '',
    idName: '',
    data: [],
  }

  state = {
    isMobile: false,
    currentPage: 1,
    rowsPerPage: 10,
  };

  componentWillMount() {
    window.addEventListener("resize", this.onResize);
    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  componentWillReceiveProps() {
    this.setState({currentPage: 1})
  }

  onResize = () => {
    const width = window.innerWidth;
    if (!this.state.isMobile && width < 700) {
      this.setState({isMobile: true});
    } else if (this.state.isMobile && width >= 700) {
      this.setState({ isMobile: false });
    }
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
        { this.state.isMobile ?
          <div className="mtable">
            {
              filteredData.map((item, i) => (
                <div className="mtable__row" key={item.key || item.id || i}>
                  <div className="mtable__header">
                    {this.props.header.map((item, i) => <div key={i}>{item}</div>)}
                  </div>
                  <div className="mtable__content">
                    {this.props.mappingFn(item, i).map(cell => <div>{cell}</div>)}
                  </div>
                </div>
              ))
            }
          </div>
          :<Table className={this.props.className} idName={this.props.idName}>
            <Table.Header>{this.props.header}</Table.Header>
            <tbody>
            {
              filteredData.map((item, i) => (
                <Table.Row key={item.key || item.id || i}>
                  {this.props.mappingFn(item, i)}
                </Table.Row>
              ))
            }
            </tbody>
          </Table>
        }
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
  idName: PropTypes.string,
  header: PropTypes.arrayOf(PropTypes.string).isRequired,
  mappingFn: PropTypes.func.isRequired,
  data: PropTypes.array,
};

export default TableWithPagination;