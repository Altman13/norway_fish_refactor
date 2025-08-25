import { Avatar } from '@mui/material'


export default function Footer() {
    return (
    <div
        className="footer"
        xs={11}
        style={{
        background: 'black',
        color: 'white',
        textAlign: 'center',
        lineHeight: '40px',
        marginTop: '96px',
        display: 'flex',
        height: '40px',
        minHeight: '10px',
        justifyContent: 'center',
        width: '100%'
        }}>
        <div id="lastCodeMsg">MSG</div>
        <Avatar id="lastCode" 
                src="/static/illustrations/icons/Grey.svg" 
                alt="last code" 
                style={{marginLeft: '10px', scale:'80%'}} 
        />
    </div>
    )
}
