import {
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Box,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const FeatureCard = ({ title, description, image, icon: Icon, iconColor, onClick }) => {
  return (
    <Card
      elevation={0}
      sx={{
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
        transition: "transform .2s ease, box-shadow .2s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.14)",
        },
      }}
    >
      <CardActionArea
        onClick={onClick}
        sx={{ height: "100%", alignItems: "stretch" }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={title}
          loading="lazy"
          sx={{
            height: 220,
            objectFit: "cover",
            display: "block",
          }}
        />

        <CardContent sx={{ bgcolor: "#F3E6C7", p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                bgcolor: "rgba(0,0,0,0.06)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <Icon sx={{ color: iconColor, fontSize: 24 }} />
            </Box>

            <Typography fontWeight={900} sx={{ lineHeight: 1.1 }}>
              {title}
            </Typography>
          </Box>

          <Typography
            variant="body2"
            sx={{
              color: "rgba(0,0,0,0.72)",
              lineHeight: 1.6,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

FeatureCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  iconColor: PropTypes.string.isRequired,
  onClick: PropTypes.func,
};

export default FeatureCard;