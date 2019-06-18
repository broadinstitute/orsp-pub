import { Component } from "react";
import { a, div, hh, ul, li } from 'react-hyperscript-helpers';

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
      ul({className: "pagination custom-component"}, [

        li({ className: "page-item", title: "first page", onClick: (e) => {this.props.onPageChange(1)}}, [
          a({className: "page-link"}, ['<<']),
        ]),

        li({ className: "page-item", title: "prev page", onClick: this.goPrevPage}, [
          a({className: "page-link"}, ['<'])
        ]),

        li({ className: "page-item", isRendered: this.props.lastPage >= 1, onClick: (e) => {this.props.onPageChange(1)}}, [
          a({className: "page-link"}, ['1'])
        ]),

        li({ className: "page-item active", isRendered: this.props.lastPage >= 2, onClick: (e) => {this.props.onPageChange(2)}}, [
          a({className: "page-link"}, ['2'])
        ]),

        li({ className: "page-item", isRendered: this.props.lastPage >= 3, onClick: (e) => {this.props.onPageChange(3)}}, [
          a({className: "page-link"}, ['3'])
        ]),

        li({ className: "page-item", isRendered: this.props.lastPage >= 4, onClick: (e) => {this.props.onPageChange(4)}}, [
          a({className: "page-link"}, ['4'])
        ]),

        li({ className: "page-item", isRendered: this.props.lastPage >= 5, onClick: (e) => {this.props.onPageChange(5)}}, [
          a({className: "page-link"}, ['5'])
        ]),

        li({ className: "page-item", isRendered: this.props.lastPage >= 6, onClick: (e) => {this.props.onPageChange(6)}}, [
          a({className:"page-link"}, ['6'])
        ]),

        li({ className: "page-item", title: "next page", onClick: this.goNextPage}, [
          a({className: "page-link"}, ['>'])
        ]),

        li({ className: "page-item", title: "last page", onClick: this.goLastPage}, [
          a({className: "page-link"}, ['>>'])
        ])

      ])
    );
  }
});


