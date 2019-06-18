import { Component } from "react";
import { a, div, hh } from 'react-hyperscript-helpers';

export const TablePaginator = hh(class TablePaginator extends Component {

  goPrevPage = (e) => {
    const page = this.props.currentPage > 1 ? this.props.currentPage -1 : this.props.currentPage;
    this.props.onPageChange(page);
  };

  goNextPage = (e) => {
    const page = this.props.currentPage < this.props.lastPage ? this.props.currentPage + 1 :this.props.currentPage;
    this.props.onPageChange(page);
  };

  goLastPage = (e) => {
    const page = this.props.lastPage.toFixed(0);
    this.props.onPageChange(page);
  };

  render() {

    return (
      div({}, [

        a({ onClick: (e) => {this.props.onPageChange(1)}, style: {'cursor':'pointer'} }, ['<< ']),
        a({ onClick: this.goPrevPage, style: {'cursor':'pointer'} }, ['< ']),

        a({ isRendered: this.props.lastPage >= 1, onClick: (e) => {this.props.onPageChange(1)}, style: {'cursor':'pointer'} }, ['1 ']),
        a({ isRendered: this.props.lastPage >= 2, onClick: (e) => {this.props.onPageChange(2)}, style: {'cursor':'pointer'} }, ['2 ']),
        a({ isRendered: this.props.lastPage >= 3, onClick: (e) => {this.props.onPageChange(3)}, style: {'cursor':'pointer'} }, ['3 ']),
        a({ isRendered: this.props.lastPage >= 4, onClick: (e) => {this.props.onPageChange(4)}, style: {'cursor':'pointer'} }, ['4 ']),
        a({ isRendered: this.props.lastPage >= 5, onClick: (e) => {this.props.onPageChange(5)}, style: {'cursor':'pointer'} }, ['5 ']),
        a({ isRendered: this.props.lastPage >= 6, onClick: (e) => {this.props.onPageChange(6)}, style: {'cursor':'pointer'} }, ['6 ']),

        a({ onClick: this.goNextPage, style: {'cursor':'pointer'} }, [' >']),
        a({ onClick: this.goLastPage, style: {'cursor':'pointer'} }, [' >>']),

      ])
    );
  }
});


