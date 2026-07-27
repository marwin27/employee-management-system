import {Button} from "@mui/material";

const PrimaryButton = ({children,...props })=>{
    return (
        <Button 
        variant="contained" 
        color="#0E3386"
        size="large"
        {...props}>
            {children}
        </Button>
    )
}

export default PrimaryButton