import React from "react"
import { Reviewer } from "../util/ajax"
import { hh } from "react-hyperscript-helpers"
import { Component } from "react"
import { UrlConstants } from "../util/UrlConstants"
import UserAutocomplete from "../util/UserAutocomplete"
import { ConfirmationDialog } from "../components/ConfirmationDialog"
import { Panel } from "../components/Panel"
import DatePicker from 'react-datepicker'

import './ManageReviewers.css'
import { AlertMessage } from "../components/AlertMessage"

const ManageReviewers = hh(class ManageReviewers extends Component {

  constructor(props) {
    super(props)
    this.userAutocomplete = React.createRef()
    this.state = {
      reviewersData: [],
      userName: '',
      defaultUserSelected: [],
      showDialog: false,
      reviewerName: '',
      startDate: '',
      endDate: '',
      showAlert: false,
      msg: '',
      type: 'success',
      edit: false,
      showAddReviewer: false,
      projectCount: []
    }
  }

  componentDidMount() {
    this.getReviewers()
  }

  getReviewers = () => {
    Reviewer.getReviewers().then(data => {
      let reviewersArray = data.data;
      let reviewerData = [];
      reviewersArray.forEach((dataArray, i) => {
        reviewerData.push({
          id: i + 1,
          name: dataArray[1],
          active: dataArray[2],
          order: dataArray[3],
          userjson: dataArray[4],
          createdAt: dataArray[5],
          startDate: dataArray[6].split('T')[0],
          endDate: dataArray[7].split('T')[0]
        })
      })
      this.setState({
        reviewersData: reviewerData
      }, () => this.getReviwerProjectCount());
    }).catch(err => console.log(err))
  }

  getReviwerProjectCount = () => {
    let reviewersData = this.state.reviewersData;
    reviewersData.forEach(async (item, i) => {
      let payload = '{"key": "'+ JSON.parse(item.userjson).key + '"}';
      let result = await Reviewer.getReviewerProjectCount(payload);
      reviewersData[i].projectCount = result.data;
      this.setState({
        reviewersData: reviewersData
      })
    });
  }

  closeModal = () => {
    this.setState({
      showDialog: false
    })
  }

  handleSelectUser = (selected) => {
    let username = ''
    let selectedUser = []
    if (selected[0] != null && !(typeof selected[0].id === "undefined")) {
      username = selected[0].id
      selectedUser = selected
    }
    this.setState({
      userName: username,
      defaultUserSelected: selectedUser
    })
  }

  handleActiveState = (reviewer) => {
    let data = this.state.reviewersData
    data.forEach(item => {
      if (item.id === reviewer.id) {
        item.active === 'Y' ? item.active = 'N' : item.active = 'Y'
        Reviewer.updateReviewer(item).then(() => {
          this.setState({
            showAlert: true,
            msg: `${item.name} is ${item.active === 'Y' ? 'Active.' : 'Inactive.'}`,
            type: 'success'
          })
          setTimeout(() => this.setState({showAlert: false}), 4000)
          this.getReviewers()
        })
        .catch(err => console.log(err))
      }
    })
    this.setState({
      reviewersData: data
    })
  }
  
  editReviewer = (reviewer) => {
    let selectedUserData = JSON.parse(reviewer.userjson)
    this.setState({
      showAddReviewer: true,
      userName: selectedUserData.key,
      edit: true,
      reviewerName: reviewer.name,
      startDate: new Date(reviewer.startDate),
      endDate: reviewer.endDate ? new Date(reviewer.endDate) : null
    })
  }

  updateReviewer = () => {
    let [editedReviewer] = this.state.reviewersData.filter(item => item.name === this.state.reviewerName)
    editedReviewer.startDate = this.state.startDate
    editedReviewer.endDate = this.state.endDate
    Reviewer.updateReviewer(editedReviewer).then(() => {
      this.setState({
        showAlert: true,
        msg: `Reviewer updated succesfully.`,
        type: 'success'
      })
      setTimeout(() => this.setState({showAlert: false}), 4000)
      this.getReviewers()
    })
  }

  removeReviewer = () => {
    Reviewer.removeReviewer(this.state.reviewerName)
    .then(() => {
      this.setState({
        showAlert: true,
        msg: `${this.state.reviewerName} is deleted successfully`,
        type: 'success'
      })
      setTimeout(() => this.setState({showAlert: false}), 4000)
      setTimeout(() => this.getReviewers(), 1000)
    })
    .catch(err => console.log(err))
    this.setState({
      showDialog: false
    })
    
  }

  formatDateToString = (date) => {
    let newDate = new Date(date)
    let day = newDate.getDate().toString().length === 1 ? '0' + newDate.getDate() : newDate.getDate()
    return newDate.getFullYear() + '-' + (newDate.getMonth() + 1) + '-' + day
  }

  handleAddToList = () => {
    let reviewerExist = this.state.reviewersData.find(ele => ele.name === this.state.defaultUserSelected[0].value)
    if (reviewerExist) {
      this.setState({
        showAlert: true,
        msg: 'Reviewer already exists',
        type: 'danger'
      })
      setTimeout(() => this.setState({showAlert: false}), 4000)
    } else {
      this.setState({
        showAlert: false
      })
      let reviewerJSON = {...this.state.defaultUserSelected[0]}
      reviewerJSON.key = reviewerJSON.id
      delete reviewerJSON.id
      let startDate = this.formatDateToString(this.state.startDate)
      let endDate = this.state.endDate ? this.formatDateToString(this.state.endDate) : null
      let newReviewer = {
        name: this.state.defaultUserSelected[0].value,
        active: 'Y',
        reviewOrder: this.state.reviewersData.length + 1,
        userJson: JSON.stringify(reviewerJSON),
        startDate,
        endDate
      }
      Reviewer.addReviewer(newReviewer).then(() => {
        this.getReviewers()
        this.handleClear()
      })
    }
  }

  handleClear = () => {
    !this.state.edit && this.userAutocomplete.clear()
    this.setState({
      userName: '',
      defaultUserSelected: [],
      startDate: '',
      endDate: '',
      edit: false
    })
  }

  closeAlertHandler = () => {
    this.setState(prev => {
      prev.showAlert = false
      return prev
    })
  }

  render() {
    return (
      <React.Fragment>
        <ConfirmationDialog
          closeModal={this.closeModal}
          show={this.state.showDialog}
          handleOkAction={() => this.removeReviewer()}
          title="Reviewer removal confirmation"
          bodyText={`Are you sure you want to remove ${this.state.reviewerName}?`}
          actionLabel="Yes"
        />
        <h1>Manage Reviewers</h1>
        <hr />
        <br/>
        {!this.state.showAddReviewer ? <button 
          style={{marginBottom: '10px'}}
          className="col-4 btn buttonPrimary"
          onClick={() => this.setState({showAddReviewer: !this.state.showAddReviewer})}
        >Add new reviewer</button> : undefined}
        {this.state.showAddReviewer ? <Panel title={this.state.edit ? "Edit reviewer" : "Add new reviewer"}>
          <div className="col-6" style={{marginBottom: '12px'}}>
          <label className='inputFieldLabel'>{this.state.edit ? 'Selected User' : 'Search User '}
            {!this.state.edit ? <span style={{color: 'red'}}> *</span> : undefined}
          </label>
          {!this.state.edit ? <div>
            <UserAutocomplete
              ref={el => this.userAutocomplete = el}
              userNameSearchUrl={UrlConstants.userNameSearchUrl}
              onChange={selected => this.handleSelectUser(selected)}
              defaultSelected={this.state.defaultUserSelected}
            />
          </div> : 
          <div>
            <input 
              type="text" 
              style={{height: '32px', width: '100%', outline: 'none', border: 'none'}}
              value={this.state.reviewerName} 
              readOnly
            />
          </div>}
          </div>
          <div className="col-xs-12 col-sm-6">
            <div>
                <label className='inputFieldLabel'>Start Date <span style={{color: 'red'}}> *</span></label>
                <br/>
                <DatePicker style={{display: 'block'}}
                    selected={this.state.startDate}
                    onChange={(date) => this.setState({startDate: date})}
                    className="DatePicker"
                ></DatePicker>
            </div>
          </div>
          <div className="col-xs-12 col-sm-6">
            <div>
              <label className='inputFieldLabel'>End Date</label>
              <br/>
              <DatePicker style={{display: 'block'}}
                  selected={this.state.endDate}
                  onChange={(date) => this.setState({endDate: date})}
                  className="DatePicker"
              ></DatePicker>
            </div>
          </div>
          <button 
            className="btn buttonPrimary"
            style={{ marginTop: '20px', marginRight: '10px', marginLeft: '5px' }}
            onClick={this.state.edit ? this.updateReviewer : this.handleAddToList}
            disabled={!this.state.userName || !this.state.startDate}
          >{this.state.edit ? 'Save' : 'Add Reviewer'}</button>
          <button 
            className="btn"
            style={{ marginTop: '20px', marginRight: '10px' }}
            onClick={() => this.setState({
              showAddReviewer: false,
              edit: false,
              startDate: null,
              endDate: null,
              userName: '',
              defaultUserSelected: []
            })}
          >Cancel</button>
          <button 
            className="btn"
            style={{ marginTop: '20px', backgroundColor: '#fff', color: 'black' }}
            onClick={this.handleClear}
          >Clear</button>
        </Panel> : undefined}
        <AlertMessage
          msg={this.state.msg}
          show={this.state.showAlert}
          type={this.state.type}
          closeable={false}
        />

        <div className="mt-3">
          <h3 style={{marginTop: '20px', fontWeight: 'bold'}}>Reviewers</h3>
          <table className="table" style={{border: '1px solid darkgray'}}>
            <thead style={{backgroundColor: '#f2f2f2'}}>
              <tr>
                <th>#</th>
                <th>Reviewer</th>
                <th>Start Date</th>
                <th style={{textAlign: 'center'}}>End Date</th>
                <th style={{textAlign: 'center'}}>No. of projects</th>
                <th>Active</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
                {this.state.reviewersData.map((reviewer, i) => 
                    <tr>
                      <td>{reviewer.id}</td>
                      <td>{reviewer.name}</td>
                      <td>{reviewer.startDate}</td>
                      <td style={{textAlign: 'center'}}>{reviewer.endDate ? reviewer.endDate : 'N/A'}</td>
                      <td style={{textAlign: 'center'}}>{reviewer.projectCount}</td>
                      <td>
                        <label className="switch">
                          <input type="checkbox" id={reviewer.id} checked={reviewer.active === 'Y'} 
                            onClick={() => this.handleActiveState(reviewer)}
                          />
                          <div className="slider round">
                            <span className="on">Yes</span>
                            <span className="off">No</span>
                          </div>
                        </label>
                      </td>
                      <td>
                        <i className="glyphicon glyphicon-edit methodButton" 
                          onClick={() => this.editReviewer(reviewer)}
                          title="Edit"
                        ></i>
                        <i className="glyphicon glyphicon-trash methodButton"
                          style={{marginLeft: '13px'}}
                          title="Delete"
                          onClick={() => this.setState({
                            showDialog: true,
                            reviewerName: reviewer.name
                          })}
                        ></i>
                      </td>
                    </tr>
                )}
            </tbody>
          </table>
        </div>
        <div style={{marginTop: '150px'}}><br/></div>
      </React.Fragment>
    )
  }

})

export default ManageReviewers