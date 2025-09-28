import React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { customThemeVars } from "@/theme";

const cardBaseSx = {
  height: "100%",
  display: "flex",
  flexDirection: "column" as const,
  pt: { xs: "8px", sm: "8px", md: "16px" },
};

type CardContainerProps = {
  children: React.ReactNode;
  titleWidth?: number | string;
  showHeader?: boolean;
};

const CardContainer: React.FC<CardContainerProps> = ({
  children,
  titleWidth = "55%",
  showHeader = true,
}) => (
  <Card sx={cardBaseSx}>
    <Stack spacing={showHeader ? 2 : 1.5} sx={{ flex: 1, p: { xs: 1.5, sm: 2 } }}>
      {showHeader && <Skeleton animation="wave" variant="text" width={titleWidth} height={28} />}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", width: "100%" }}>
        {children}
      </Box>
    </Stack>
  </Card>
);

const GaugeSkeleton: React.FC = () => (
  <Stack alignItems="center" spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
    <Skeleton
      variant="rectangular"
      sx={{
        width: { xs: "80%", sm: 140, md: 160 },
        maxWidth: 180,
        height: { xs: 72, sm: 84, md: 100 },
        borderRadius: { xs: "72px 72px 0 0", md: "100px 100px 0 0" },
      }}
    />
    <Skeleton animation="wave" variant="text" width="60%" height={20} />
    <Skeleton animation="wave" variant="text" width="80%" height={14} />
  </Stack>
);

const TrendSkeleton: React.FC = () => (
  <Stack
    alignItems="center"
    spacing={0.5}
    sx={{
      minWidth: { xs: "100%", sm: 108 },
      py: { xs: 0.5, sm: 0 },
    }}
  >
    <Skeleton variant="circular" width={28} height={28} />
    <Skeleton animation="wave" variant="text" width={82} height={16} />
    <Skeleton animation="wave" variant="text" width={96} height={14} />
  </Stack>
);

const GaugeCardSkeleton: React.FC<{ titleWidth?: number | string }> = ({ titleWidth }) => (
  <CardContainer titleWidth={titleWidth}>
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 2, sm: 1.5 }}
      alignItems="center"
      justifyContent="space-evenly"
      sx={{ flex: 1, width: "100%" }}
    >
      <GaugeSkeleton />
      <TrendSkeleton />
      <GaugeSkeleton />
    </Stack>
  </CardContainer>
);

const SunshineMetricSkeleton: React.FC = () => (
  <Stack alignItems="center" spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
    <Box
      sx={{
        width: "100%",
        minHeight: { xs: 96, sm: 104, md: 110 },
        position: "relative",
      }}
    >
      <Skeleton animation="wave"
        variant="text"
        width="70%"
        height={30}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />
    </Box>
    <Stack direction="row" spacing={1} alignItems="center">
      <Skeleton animation="wave" variant="text" width={90} height={16} />
      <Skeleton variant="rounded" width={80} height={24} />
    </Stack>
  </Stack>
);

const SunshineCardSkeleton: React.FC = () => (
  <CardContainer titleWidth="75%">
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 2, sm: 1.5 }}
      alignItems="center"
      sx={{ flex: 1, width: "100%" }}
    >
      <SunshineMetricSkeleton />
      <TrendSkeleton />
      <SunshineMetricSkeleton />
    </Stack>
  </CardContainer>
);

const DistanceRowSkeleton: React.FC = () => (
  <Stack spacing={1} sx={{ width: "100%" }}>
    <Stack direction="row" spacing={1.2} alignItems="center">
      <Skeleton variant="circular" width={28} height={28} />
      <Skeleton animation="wave" variant="text" width="40%" height={18} />
      <Box sx={{ flex: 1 }} />
      <Skeleton animation="wave" variant="text" width="30%" height={16} />
    </Stack>
    <Skeleton animation="wave" variant="rounded" height={22} sx={{ width: "100%" }} />
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      {Array.from({ length: 7 }).map((_, idx) => (
        <Skeleton animation="wave" key={idx} variant="text" width={"11%"} height={12} />
      ))}
    </Stack>
  </Stack>
);

const DistancesCardSkeleton: React.FC = () => (
  <CardContainer showHeader={false}>
    <Stack spacing={2} sx={{ flex: 1, width: "100%" }}>
      <DistanceRowSkeleton />
      <Divider flexItem />
      <DistanceRowSkeleton />
    </Stack>
  </CardContainer>
);

const MapCardSkeleton: React.FC = () => (
  <Card sx={{ p: { xs: 0, sm: 0 }, minHeight: 350 }}>
    <Skeleton animation="wave" variant="rounded" sx={{ width: "120%", height: "120%" }} />
  </Card>
);

const ListSectionSkeleton: React.FC<{ bullets: number }> = ({ bullets }) => (
  <Stack spacing={0.75} sx={{ width: "100%" }}>
    <Skeleton animation="wave" variant="text" width="40%" height={18} />
    <Stack spacing={0.5}>
      {Array.from({ length: bullets }).map((_, idx) => (
        <Stack key={idx} direction="row" spacing={1} alignItems="center">
          <Skeleton variant="circular" width={18} height={18} />
          <Skeleton animation="wave" variant="text" width="85%" height={14} />
        </Stack>
      ))}
    </Stack>
  </Stack>
);

const AllowanceRisksCardSkeleton: React.FC = () => (
  <CardContainer titleWidth="45%">
    <Stack spacing={1.5} sx={{ flex: 1, width: "100%" }}>
      <Skeleton variant="rounded" width={180} height={30} />
      <Skeleton animation="wave" variant="text" width="85%" height={16} />
      <Divider flexItem />
      <ListSectionSkeleton bullets={2} />
      <Divider flexItem />
      <ListSectionSkeleton bullets={3} />
      <Divider flexItem />
      <ListSectionSkeleton bullets={2} />
    </Stack>
  </CardContainer>
);

const RainRowSkeleton: React.FC = () => (
  <Stack spacing={0.75} sx={{ width: "100%" }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <Skeleton animation="wave" variant="text" width="28%" height={16} />
      <Skeleton variant="rounded" width={90} height={24} />
      <Box sx={{ flex: 1 }} />
      <Skeleton animation="wave" variant="text" width="20%" height={14} />
    </Stack>
    <Skeleton animation="wave" variant="rounded" height={18} sx={{ width: "100%" }} />
  </Stack>
);

const RainCardSkeleton: React.FC = () => (
  <CardContainer titleWidth="60%">
    <Stack spacing={1.5} sx={{ flex: 1, width: "100%" }}>
      <RainRowSkeleton />
      <RainRowSkeleton />
    </Stack>
  </CardContainer>
);

const ScoreRowSkeleton: React.FC = () => (
  <Stack direction="row" spacing={1} alignItems="center">
    <Skeleton variant="rounded" width={110} height={26} />
    <Skeleton animation="wave" variant="rounded" sx={{ flex: 1 }} height={12} />
    <Skeleton animation="wave" variant="text" width={36} height={18} />
  </Stack>
);

const ScoresCardSkeleton: React.FC = () => (
  <CardContainer titleWidth="70%">
    <Stack spacing={1.5} sx={{ flex: 1, width: "100%" }}>
      <ScoreRowSkeleton />
      <ScoreRowSkeleton />
      <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
        <Skeleton variant="rounded" width={140} height={30} />
      </Box>
    </Stack>
  </CardContainer>
);

const SuitabilityDashboardSkeleton: React.FC = () => (
  <Box
    sx={{
      width: "100%",
      maxHeight: { md: "90vh", xs: "none", sm: "none" },
      display: "grid",
      gap: {
        xs: customThemeVars.grid.gap.mobile,
        sm: customThemeVars.grid.gap.mobile,
        md: customThemeVars.grid.gap.desktop,
      },
      gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" },
      gridTemplateRows: { md: "repeat(4, minmax(270px, 1fr))" },
      height: "100%",
      maxWidth: "100vw",
    }}
  >
    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "1 / span 2" }, gridRow: { md: "1" } }}>
      <GaugeCardSkeleton titleWidth="60%" />
    </Box>
    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "3 / span 2" }, gridRow: { md: "1" } }}>
      <GaugeCardSkeleton titleWidth="72%" />
    </Box>
    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "1 / span 2" }, gridRow: { md: "2" } }}>
      <SunshineCardSkeleton />
    </Box>
    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "3 / span 2" }, gridRow: { md: "2" } }}>
      <DistancesCardSkeleton />
    </Box>
    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "1 / span 2" }, gridRow: { md: "3 / span 2" }, minHeight: 350 }}>
      <MapCardSkeleton />
    </Box>
    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "3" }, gridRow: { md: "3 / span 2" } }}>
      <AllowanceRisksCardSkeleton />
    </Box>
    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "4" }, gridRow: { md: "3" } }}>
      <RainCardSkeleton />
    </Box>
    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1", md: "4" }, gridRow: { md: "4" } }}>
      <ScoresCardSkeleton />
    </Box>
  </Box>
);

export default SuitabilityDashboardSkeleton;
