import React, { Component, useState, useRef } from "react";
import styles from "./ResidentList.module.css";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeList } from 'react-window';
import { Grid, Button } from "@material-ui/core";
import { KeyboardArrowUp } from "@material-ui/icons";

import {
  ListPlaceholder,
  FilteredListPlaceholder,
} from "../../assets/placeholders/placeholders";
import { ResidentContext } from "../ResidentProvider";
import ResidentItem from "../ListItem/ListItem";


function VirtuosoList(props) {
  const [toTopIsHidden, setToTopIsHidden] = useState(true);
  const virtuosoList = useRef();

  function renderItem({index, style}) {
    return (
      <div style={style}>
        <div
          className={`Rci_residentListItem ${styles["virtuosoItem"]}`}
          key={props.list[index].guid}
        >
          {props.list[index]}
        </div>
      </div>
    );
  }

  function scrollToTop() {
    virtuosoList.current.scrollToIndex(0);
  }

  function handleScroll(e) {
    const scrollPos = e.target.scrollTop;
    let toTopIsHidden = true;
    if (scrollPos > 100) {
      toTopIsHidden = false;
    }
    setToTopIsHidden(toTopIsHidden);
  }

  return (
    <AutoSizer>
      {({ width, height }) => (
        <div onScroll={handleScroll}>
          <FixedSizeList
            width={width}
            height={height}
            itemCount={props.list?.length}
            itemSize={108}
          >
            {renderItem}
          </FixedSizeList>
          <div className={styles["backToTopButton"]}>
            <Button
              id="Rci_residentList-backToTop"
              style={toTopIsHidden ? { display: "none" } : null}
              color="primary"
              variant="contained"
              onClick={scrollToTop}
            >
              <KeyboardArrowUp />
              Back To Top
            </Button>
          </div>
        </div>
      )}
    </AutoSizer>
  );
}

class ResidentList extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      active: null,
    };
  }

  itemOnClick = (data) => {
    const id = data.guid;
    this.setState({ active: id });
    const [_, dispatch] = this.context;
    const { undoAlert, setUndoAlert } = this.props.undoContext;

    // if we have an undo alert, and the resident we are clicking on
    // doesn't match, we clear the undo alert. This is to capture when the user
    // clicks away, which we want to clear the form state of the undone alert. The state of the undone
    // alert shouldn't persist beyond switching away from it.
    if (undoAlert && undoAlert.resGuid !== data.guid) {
      setUndoAlert();
    }
    dispatch({ type: "SELECT_RESIDENT", payload: data });
  };

  buildList = (data = []) => {
    let active;
    const [rState] = this.context;
    if (rState.selectedResident) {
      active = rState.selectedResident.guid;
    }
    return data.map((resident) => (
      <ResidentItem
        key={resident.guid}
        resident={resident}
        active={active}
        resOnClick={this.itemOnClick}
        updateView={this.props.hideListView}
      />
    ));
  };

  render() {
    return (
      <Grid container className={styles["listWrapper"]}>
        {this.context[0].filteredList &&
        this.context[0].filteredList.length > 0 ? (
          <div style={{ flex: "1 1 auto", width: "100%", overflow: "hidden" }}>
            <VirtuosoList list={this.buildList(this.context[0].filteredList)} />
          </div>
        ) : (
          <div style={{ position: "relative", width: "100%" }}>
            {this.context[0].userData.length > 0 ? (
              <FilteredListPlaceholder
                search={this.context[0].searchTerm}
                filters={this.context[0].filters}
              />
            ) : (
              <ListPlaceholder />
            )}
          </div>
        )}
      </Grid>
    );
  }
}

ResidentList.contextType = ResidentContext;

export default ResidentList;
