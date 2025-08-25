
import { Grid,Avatar } from '@mui/material';

export default function InfoBlock(props) {
  
    return (
        <Grid container style={{border : '2px solid rgb(222, 226, 229)', borderRadius: '5px'}}>
        <Grid item xs={1} style={{paddingTop: '40px', paddingLeft: '15px'}} >
          <Avatar src="/static/illustrations/icons/GSM.svg" />
        </Grid>
        <Grid item xs={11} style={{ display: 'grid', textAlign: 'end',lineHeight: "30px", color: 'black', padding: '20px' }}>
          <span style={{ fontWeight: 'bold' }}>Bruker: {props.bruker}</span>
          <div style={{ fontWeight: 'bold' }}>Posisjon: <span id="main_pos">{localStorage.getItem('pos') || ' '}</span></div>
          <div style={{ fontWeight: 'bold' }}>Tidsstempel (UTC): <span id="main_date">{localStorage.getItem('datetime') || ' '}</span></div>
        </Grid>
      </Grid>
    );
}
