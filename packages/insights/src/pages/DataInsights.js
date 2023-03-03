import React, {useState, useEffect} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { getAuthToken } from "@teamhub/api";
import { getOneSearchParam } from '../utils/url';

import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import styles from "../index.css";

import cards from "../config/cards.json";
import K4DataLoader from "../services/k4data";

const DATA_ENDPOINT = `https://data${process.env.K4_ENV === 'production' ? '' : '-' + process.env.K4_ENV}.k4connect.com`;


const useStyles = makeStyles({
  loading: {
    visibility: props => props.showCards ? 'visible' : 'hidden',
    height: props => props.showCards ? 'auto' : 0
  },
  loadingContainer: {
    height: '100%',
    'width': "100%",

  },
  loadingMessage: {
    'display': 'flex',
    'justify-content': 'center',
    'align-items': 'center',
    height: '100%',
    'width': "100%",
    
  },
  sectionHeader: {
    padding: '0px 15px',
  }
});

function LinearProgressComponent(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
    </Box>
  );
}

export default function DataInsights(props) {
  const [showCards, setShowCards] = useState(false);
  const [progress, setProgress] = useState(0);
  const classes = useStyles({showCards, ...props});
  const communityId = getOneSearchParam('communityId', '2476');
  const loader = new K4DataLoader(DATA_ENDPOINT, getAuthToken());

  useEffect(() => {
    installWidgets(cards)
  }, ['showCards']);

  const installWidgets = async (cardsToRender) => {
    let complete = 0;
    await Promise.all(cardsToRender.map(async (card, index) => {
      await loader.addWidget(card.tag, card.embedId, {community: communityId})
      complete++
      setProgress((complete / cardsToRender.length) * 100)
    }))    

    setTimeout(
      () => setShowCards(true)
    , 1000)
    
  }

  return (
    <div className={`${styles["EI_insights"]}`}>

      <div className={classes.loading}>


        <h1 className={classes.sectionHeader}>Engagement</h1>
        <Grid container spacing={0}>
          {cards.filter((item) => item.type === "Engagement").map((item) => {
            return <Grid item xs={12} md={item.width}>
            <Card elevation={0} style={{backgroundColor: "transparent"}}id={item.tag} key={item.embedId}></Card>
            </Grid>
          })}
        </Grid>

        <h1 className={classes.sectionHeader}>Content</h1>
        <Grid container spacing={0}>
          {cards.filter((item) => item.type === "Content").map((item) => {
            return <Grid item xs={12} md={item.width}>
            <Card elevation={0} style={{backgroundColor: "transparent"}}id={item.tag} key={item.embedId}></Card>
            </Grid>
          })}
        </Grid>

        <h1 className={classes.sectionHeader}>RCI Alerts</h1>
        <Grid container spacing={0}>
          {cards.filter((item) => item.type === "RCI-Alerts").map((item) =>  {
            return <Grid item xs={12} md={item.width}>
            <Card elevation={0} style={{backgroundColor: "transparent"}}id={item.tag} key={item.embedId}></Card>
            </Grid>
          })}
        </Grid>

        <h1 className={classes.sectionHeader}>Smart Home</h1>
        <Grid container spacing={0}>
          {cards.filter((item) => item.type === "Smart-Home").map((item) => {
            return <Grid item xs={12} md={item.width}>
            <Card elevation={0} style={{backgroundColor: "transparent"}}id={item.tag} key={item.embedId}></Card>
            </Grid>
          })}
        </Grid>
        
      </div>

      {
        !showCards && 
          <div className={classes.loadingContainer}>
            <div className={classes.loadingMessage}>
              <div style={{width: '450px'}}>
                <LinearProgressComponent value={progress} />
                <h5 style={{'text-align': 'center'}}>Loading Insights Cards...</h5>
              </div>
            </div>
          </div>
      }

    </div>
    


  
   
  );
}
