import React, { useState } from "react";
import { useForm } from "react-hook-form";

import CloseIcon from '@mui/icons-material/Close';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AUTH_ACTOR } from "../index";
import Item from "./Item";

export default function Mint(props) {
  const { register, handleSubmit } = useForm();
  const [mintedID, setMintedID] = useState("-1");

  async function onSubmit(data) {
    props.setLoading(true);
    const name = data.name;

    const imageFile = data.image[0];
    const imageData = await imageFile.arrayBuffer();
    const imageUintArray = [...new Uint8Array(imageData)];

    const modelFile = data.model[0];
    const modelData = await modelFile.arrayBuffer();
    const modelUintArray = [...new Uint8Array(modelData)];

    const mintResult = await AUTH_ACTOR.mintNFT(name, imageUintArray, modelUintArray);
    const newID = { mintResult }.mintResult[0].Ok[0];

    setMintedID(newID);
    props.setLoading(false);
  }

  return (
    <Paper elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "150px",
        marginTop: { xs: "20px", sm: "50px", md: "70px" },
        marginX: { xs: 2, sm: 16, md: 20, lg: "30%", xl: "35%" },
        paddingX: { xs: 2, sm: 4, md: 8 },
        paddingTop: "1%",
        paddingBottom: "4%",
        borderRadius: "8px",
        backgroundColor: "rgba(10, 10, 25, 0.7)", backdropFilter: "blur(5px)"
      }}>
      {mintedID == "-1" ?
        <>
          <Typography variant="h2" component="div" marginBottom="5%"
            fontSize={{ xs: 55, sm: 60, md: 70, lg: 80 }}
            sx={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.2), -2px -2px 2px rgba(0, 0, 0, 0.2)" }}
          >
            Mint NFT
          </Typography>
          <form>
            <Stack spacing={2} paddingY={0} paddingX={{ xs: 0, sm: 2, md: 8 }}>
              <Typography variant="h6">
                Name
              </Typography >
              <TextField
                {...register("name", { required: true })}
                variant="outlined"
                type="text"
              />
              <Typography variant="h6">
                Thumbnail
              </Typography>
              <TextField
                {...register("image", { required: true })}
                variant="outlined"
                type="file"
                accept="image/x-png,image/jpeg,image/gif,image/svg+xml,image/webp"
              />
              <Typography variant="h6">
                3D Model
              </Typography>
              <TextField
                {...register("model", { required: true })}
                variant="outlined"
                type="file"
                accept="file/glb"
              />
              <Button variant="contained" size="large" onClick={handleSubmit(onSubmit)}>Mint NFT</Button>
            </Stack>
          </form>
        </>
        :
        <>
          <Typography variant="h2" component="div" marginBottom="2%"
            fontSize={{ xs: 55, sm: 60, md: 70, lg: 80 }}
            sx={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.2), -2px -2px 2px rgba(0, 0, 0, 0.2)" }}
          >
            Minted!
          </Typography>
          <Box textAlign="center" maxWidth="350px" spacing={2} paddingY={0} paddingX={{ xs: 0, sm: 2, md: 8 }}>
            <Item ID={mintedID} setLoading={props.setLoading} />
            <Button variant="contained" color="primary" size="large" sx={{ marginTop: "10px" }} endIcon={<CloseIcon />} onClick={() => setMintedID("-1")}>Close Preview</Button>
          </Box>
        </>
      }
    </Paper >
  );
}