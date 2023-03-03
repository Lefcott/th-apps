import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import { Button, Grid, Paper, Typography} from '@material-ui/core';


const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing.unit * 4,
    backgroundColor: theme.palette.background.default,
  },
  img: {
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
});

class Carousel extends Component {
  state = {
    activeStep: 0,
  };

  handleNext = () => {
    if(this.state.activeStep === this.props.data.length - 1) {
        this.setState(prevState => ({
            activeStep: 0
        }))
    } else {
        this.setState(prevState => ({
          activeStep: prevState.activeStep + 1,
        }));
    }
  };

  handleBack = () => {
    if(this.state.activeStep > 0) {
        this.setState(prevState => ({
          activeStep: prevState.activeStep - 1,
        }));
    } else {
        this.setState(prevState => ({
            activeStep: this.props.data.length - 1
        }))
    }
  };

  render() {
    const { classes, theme } = this.props;
    const { activeStep } = this.state;
    const maxSteps = this.props.data.length;

    return (
        <Grid container alignItems="stretch">
            <div className={classes.root}>
                {/* 
                Not sure if we want a header here
                <Paper square elevation={0} className={classes.header}>

                <Typography>{this.props.data[activeStep].label}</Typography>
                </Paper> */}
                <img
                className={classes.img}
                src={this.props.data[activeStep].imgPath}
                alt={this.props.data[activeStep].label}
                />
                <MobileStepper
                steps={maxSteps}
                position="static"
                activeStep={activeStep}
                className={classes.mobileStepper}

                nextButton={
                    <Button size="small" className="nextButton" variant="outlined" color="default" onClick={this.handleNext}>
                    Next
                    </Button>
                }
                backButton={
                    <Button size="small" className="prevButton" variant="outlined" color="default" onClick={this.handleBack}>
                    Back
                    </Button>
                }
                />
            </div>
        </Grid>
    );
  }
}

Carousel.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Carousel);
