import React, { useEffect, useState } from "react";
import { backend } from "../../../declarations/backend";

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Button from '@mui/material/Button';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    backgroundColor: 'rgba(10, 10, 25, 0.75)',
    backdropFilter: "blur(5px)"
  },
}));

export default function Item(props) {
  const [name, setName] = useState();
  const [image, setImage] = useState();
  const [model, setModel] = useState();
  const [openPreview, setPreview] = useState(false);

  const handlePreviewOpen = () => {
    setPreview(true);
  };
  const handlePreviewClose = () => {
    setPreview(false);
  };

  async function fetchNFTData() {
    const data = await backend.get_tokens_metadata([props.ID]);
    const NFTData = data[0][0][0][1].Array;
    setName(NFTData[0].Text);

    const imageUintArray = new Uint8Array(NFTData[1].Blob);
    const imageURL = URL.createObjectURL(
      new Blob([imageUintArray.buffer], { type: "image/png" })
    );
    setImage(imageURL);

    const modelUintArray = new Uint8Array(NFTData[2].Blob);
    const modelURL = URL.createObjectURL(
      new Blob([modelUintArray.buffer], { type: "file/glb" })
    );
    setModel(modelURL);
  }

  useEffect(() => { fetchNFTData() }, []);

  return (
    <React.Fragment>
      <Grid item xs={12} sm={6} lg={8} style={{
        maxWidth: "300px"
      }}>
        <Card elevation={4}>
          <CardMedia
            component="img"
            alt={name}
            image={image}
          />
          <CardContent>
            <Typography variant="h5" component="div">
              {name}
            </Typography>
          </CardContent>
          {props.displayPlace == "Gallery" &&
            <CardActions>
              <Button variant="outlined" startIcon={< VisibilityIcon />} onClick={handlePreviewOpen}>Preview</Button>
            </CardActions>
          }
        </Card>
      </Grid >

      <BootstrapDialog
        onClose={handlePreviewClose}
        open={openPreview}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          {name}
        </DialogTitle>
        <IconButton
          onClick={handlePreviewClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <model-viewer
            src={model}
            exposure="0.5"
            camera-controls
            touch-action="pan-y"
            style={{ width: '80vw', height: '80vw', maxWidth: '550px', maxHeight: '550px' }}
          >
          </model-viewer>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}