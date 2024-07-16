import React, { useEffect, useState } from "react";
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Principal } from "@dfinity/principal";
import { AUTH_PRINCIPAL } from "../index";
import { backend } from "../../../declarations/backend";
import Item from "./Item";


export default function Gallery(props) {
  const [items, setItems] = useState();

  async function fetchNFTIDs() {
    let NFT_IDs = [];

    if (AUTH_PRINCIPAL.length > 0)
      NFT_IDs = await backend.get_tokens({ owner: Principal.fromText(AUTH_PRINCIPAL), subaccount: [] }, [], []);

    setItems(NFT_IDs.map(ID => <Item ID={ID} displayPlace="Gallery" key={ID.toString()} setLoading={props.setLoading} />));
  }

  useEffect(() => { fetchNFTIDs() }, [AUTH_PRINCIPAL]);

  return (
    <Paper elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "150px",
        marginTop: { xs: "20px", sm: "50px", md: "70px" },
        marginX: { xs: 2, sm: 16, md: 20, xl: 40 },
        paddingX: { xs: 2, sm: 4 },
        paddingTop: "1%",
        paddingBottom: "4%",
        borderRadius: "8px",
        backgroundColor: "rgba(10, 10, 25, 0.7)", backdropFilter: "blur(5px)"
      }}>
      <Typography variant="h2" component="div" marginBottom="2%"
        fontSize={{ xs: 55, sm: 60, md: 70, lg: 80 }}
        sx={{ textShadow: "2px 2px 2px rgba(0, 0, 0, 0.2), -2px -2px 2px rgba(0, 0, 0, 0.2)" }}
      >
        My NFTs
      </Typography >
      <Grid
        container
        padding={{ xs: 2, sm: 0 }}
        spacing={2}
        justifyContent="center"
      >
        {items}
      </Grid>
    </Paper>
  );
}