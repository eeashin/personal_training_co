import React, { Component } from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Button from "@material-ui/core/Button";
import Moment from "moment";
import DeleteIcon from "@material-ui/icons/Delete";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import Snackbar from "@material-ui/core/Snackbar";
import NewTraining from "./NewTraining";

class TrainingList extends Component {
  constructor(params) {
    super(params);
    this.state = {
      trainings: [],
      showSnack: false,
      msg: ""
    };
  }

  componentDidMount() {
    this.listTrainings();
  }

  listTrainings = () => {
    fetch("https://customerrest.herokuapp.com/api/trainings")
      .then(response => response.json())
      .then(responseData => {
        this.setState({
          trainings: responseData.content
        });
      });
  };
  deleteTraining = link => {
    confirmAlert({
      title: "",
      message: "  Want to delete this training?  ",
      buttons: [
        {
          label: "  Yes  ",
          onClick: () => {
            fetch(link, { method: "DELETE" })
              .then(res => {
                this.setState({
                  showSnack: true,
                  msg: "  Training Data Deleted !!! "
                });
                this.listTrainings();
              })
              .catch(err => console.error(err));
          }
        },
        {
          label: "  No  ",
          onClick: () => alert(" Cancelled Deleting ")
        }
      ]
    });
  };

  // To create a new customer
  saveTraining = training => {
    fetch("https://customerrest.herokuapp.com/api/trainings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(training)
    })
      .then(res => {
        this.setState({
          showSnack: true,
          msg: "  Training Saved Successful √ "
        });
        this.listTrainings();
      })
      .catch(err => console.error(err));
  };

  handleClose = () => {
    this.setState({ showSnack: false });
  };

  render() {
    const columns = [
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ value }) => Moment(value).format("MMM Do YYYY")
      },
      {
        Header: "Activity",
        accessor: "activity"
      },
      {
        Header: "Duration",
        accessor: "duration"
      },
      {
        Header: "Delete",
        id: "button",
        sortable: false,
        filterable: false,
        width: 120,
        accessor: "links[0].href",
        Cell: ({ value }) => (
          <Button
            color="secondary"
            size="medium"
            onClick={() => {
              this.deleteTraining(value);
            }}
          >
            <DeleteIcon />
          </Button>
        )
      }
    ];
    return (
      <div class="container"><br />
        <h1 className="text-center font-weight-bold">Training List</h1>
        <div className="row">
          <NewTraining
            saveTraining={this.saveTraining}
            listTrainings={this.listTrainings}
          />
        </div>

        <ReactTable
          className="table table-sm table-dark"
          data={this.state.trainings}
          filterable={true}
          defaultPageSize={10}
          columns={columns}
        />
        <Snackbar
          message={this.state.msg}
          autoHideDuration={2000}
          open={this.state.showSnack}
          onClose={this.handleClose}
        />
      </div>
    );
  }
}
export default TrainingList;
