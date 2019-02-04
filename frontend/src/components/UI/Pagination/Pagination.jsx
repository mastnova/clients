import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import './Pagination.scss';

class Pagination extends PureComponent {

  getLabels(pageCount, currentPage) {
    const labels = [];
    const getLeftEdge = () => 1;

    const getLeftInterval = () => {
      if (pageCount > 2) {
        return currentPage > 4 ? '...' : 2;
      }
      return null;
    };

    const getRightEdge = () => (pageCount > 1 ? pageCount : null);

    const getRightInterval = () => {
      if (pageCount > 3) {
        return currentPage < pageCount - 3 ? '...' : pageCount - 1;
      }
      return null;
    };

    const getMiddleRow = () => {
      if (pageCount > 4) {
        if (currentPage === pageCount) return [pageCount - 2];
        if (currentPage === 1 || currentPage === 2) return [3];
        if (currentPage === 3 && pageCount !== 5) return [3, 4];
        if (currentPage === 3) return [3];
        if (currentPage === pageCount - 1) return [currentPage - 1];
        if (currentPage === pageCount - 2) return [currentPage - 1, currentPage];
        return [currentPage - 1, currentPage, currentPage + 1];
      }
      return null;
    };

    const leftEdge = getLeftEdge();
    const leftInterval = getLeftInterval();
    const middleRow = getMiddleRow();
    const rightInterval = getRightInterval();
    const rightEdge = getRightEdge();
    labels.push(leftEdge);
    if (leftInterval) {
      labels.push(leftInterval);
    }
    if (middleRow) {
      middleRow.forEach(value => labels.push(value));
    }
    if (rightInterval) {
      labels.push(rightInterval);
    }
    if (rightEdge) {
      labels.push(rightEdge);
    }
    return labels;
  }


  onChange = (page) => () => {
    this.props.onChange(page);
  }

  onClickPrev = () => {
    if (this.props.currentPage > 1) {
      this.props.onChange(this.props.currentPage - 1);
    }
  }

  onClickNext = () => {
    if (this.props.currentPage < this.props.pagesCount) {
      this.props.onChange(this.props.currentPage + 1);
    }
  }

  render() {
    const pages = this.getLabels(this.props.pagesCount, this.props.currentPage);
    const prevCls = cn({
      'pagination__arrow': true,
      'pagination__arrow_left': true,
      'pagination__arrow_disabled': this.props.currentPage === 1,
    });
    const nextCls = cn({
      'pagination__arrow': true,
      'pagination__arrow_right': true,
      'pagination__arrow_disabled': this.props.currentPage === this.props.pagesCount,
    });

    return (
      <div className="pagination">
        <div onClick={this.onClickPrev} className={prevCls}/>
        {
          pages.map((page, i) => {
            const cls = cn({
              'pagination__page': true,
              'pagination__page_active': page === this.props.currentPage,
            });
            return (
              <div
                className={cls}
                key={i}
                onClick={this.onChange(page)}>
                  {page}
              </div>
            );
          })
        }
        <div onClick={this.onClickNext} className={nextCls}/>
      </div>
    );
  }
}

Pagination.propTypes = {
  pagesCount: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default Pagination;