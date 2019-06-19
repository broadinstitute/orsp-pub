import { Component } from "react";
import { a, hh, ul, li } from 'react-hyperscript-helpers';

export const TablePaginator = hh(class TablePaginator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCounter : 0,
    }
  }

  goPrevPage = (e) => {
    const page = this.props.currentPage > 1 ? this.props.currentPage -1 : this.props.currentPage;
    this.setState( prev => {
      prev.pageCounter = this.state.pageCounter - 1;
      return prev;
    }, () => this.props.onPageChange(page));
  };

  goNextPage = (e) => {
    const page = this.props.currentPage < this.props.lastPage ? this.props.currentPage + 1 :this.props.currentPage;
    this.setState( prev => {
      prev.pageCounter = this.state.pageCounter + 1;
      return prev;
    }, () => this.props.onPageChange(page));
  };

  goLastPage = (e) => {
    this.setState( prev => {
      prev.pageCounter = this.props.lastPage - 1;
      return prev;
    }, () => this.props.onPageChange(this.props.lastPage));
  };

  goFirstPage = (e) => {
    this.setState( prev => {
      prev.pageCounter = 0;
      return prev;
    }, () => this.props.onPageChange(1));
  };

  selected = (position) => {
    this.props.onPageChange(position + this.state.pageCounter);
    this.setState( prev => {
      prev.pageCounter = position + this.state.pageCounter - 1;
      return prev;
    });
  };

  render() {
    return (
      ul({className: "pagination custom-component"}, [
        li({ className: "page-item", title: "first page", onClick: (e) => { this.goFirstPage() }}, [
          a({ className: "page-link", isRendered: this.props.currentPage !== 1 && this.props.lastPage !== 1 }, ['<<'])
        ]),

        li({ className: "page-item", title: "prev page", onClick: this.goPrevPage }, [
          a({ className: "page-link", isRendered: this.props.currentPage !== 1 && this.props.lastPage !== 1 }, ['<'])
        ]),

        li({ className: "page-item " + (this.props.currentPage === 1 + this.state.pageCounter ?  'active ' : ''),
          isRendered: this.props.lastPage > 1 + this.state.pageCounter || this.props.currentPage === 1 + this.state.pageCounter , onClick: (e) => { this.selected(1) }}, [
          a({ className: "page-link" }, [1 + this.state.pageCounter])
        ]),

        li({ className: "page-item " + (this.props.currentPage === 2 + this.state.pageCounter ?  'active ' : ''),
          isRendered: this.props.lastPage >= 2 + this.state.pageCounter, onClick: (e) => { this.selected(2) }}, [
          a({ className: "page-link" }, [2 + this.state.pageCounter])
        ]),

        li({
          className: "page-item " + (this.props.currentPage === 3 + this.state.pageCounter ?  'active ' : ''),
          isRendered: this.props.lastPage >= 3 + this.state.pageCounter, onClick: (e) => { this.selected(3) }}, [
          a({ className: "page-link" }, [3 + this.state.pageCounter])
        ]),

        li({ className: "page-item " + (this.props.currentPage === 4 + this.state.pageCounter ?  'active ' : ''),
          isRendered: this.props.lastPage >= 4 + this.state.pageCounter, onClick: (e) => { this.selected(4) }}, [
          a({ className: "page-link" }, [4 + this.state.pageCounter])
        ]),

        li({ className: "page-item " + (this.props.currentPage === 5 + this.state.pageCounter ?  'active ' : ''),
          isRendered: this.props.lastPage >= 5 + this.state.pageCounter, onClick: (e) => { this.selected(5) }}, [
          a({ className: "page-link" }, [5 + this.state.pageCounter])
        ]),

        li({ className: "page-item " + (this.props.currentPage === 6 + this.state.pageCounter ?  'active ' : ''),
          isRendered: this.props.lastPage >= 6 + this.state.pageCounter, onClick: (e) => { this.selected(6) }}, [
          a({ className:"page-link" }, [6 + this.state.pageCounter])
        ]),

        li({ className: "page-item", title: "next page", onClick: this.goNextPage }, [
          a({ className: "page-link", isRendered: this.props.currentPage !== this.props.lastPage && this.props.lastPage !== 1 }, ['>'])
        ]),

        li({ className: "page-item", title: "last page", onClick: this.goLastPage }, [
          a({ className: "page-link", isRendered: this.props.currentPage !== this.props.lastPage && this.props.lastPage !== 1 }, ['>>'])
        ])
      ])
    );
  }
});
