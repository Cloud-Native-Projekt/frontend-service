import React from "react";
import Body from "@/components/Body";
import Header from "@/components/Header";
import Stack from "@mui/material/Stack";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <Stack minHeight="100dvh" direction="column" spacing={0} sx={{ overflow: 'hidden' }}>
      <Header />
      <Body />
      <Footer />
    </Stack>
  );
}
