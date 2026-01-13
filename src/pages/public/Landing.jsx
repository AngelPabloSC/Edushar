import { Box, Container, Typography, Button,Grid} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FeatureCard from "../../components/FeatureCard";
import { featuresData } from "../../data/featuresData";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          minHeight: "520px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          textAlign: "center",
          py: { xs: 8, md: 12 },
          overflow: "hidden",
        }}
      >
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 10 }}>
          <Typography
            variant="h1"
            component="h1"
            fontWeight="black"
            gutterBottom
            sx={{
              fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4.5rem" },
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            Aprende Shuar con{" "}
            <Box component="span" sx={{ color: "secondary.main" }}>
              EduShar
            </Box>
          </Typography>

          <Typography
            variant="h2"
            component="p"
            sx={{
              mb: 5,
              opacity: 0.95,
              fontSize: { xs: "1.1rem", md: "1.4rem" },
              fontWeight: 400,
              lineHeight: 1.5,
            }}
          >
            Sumérgete en la lengua y cultura de la Amazonía ecuatoriana a través de una
            experiencia educativa única.
          </Typography>

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              color="secondary"
              aria-label="Comenzar a aprender Shuar ahora"
              size="large"
              onClick={() => navigate("/register")}
              sx={{
                px: 5,
                py: 1.8,
                fontSize: "1.1rem",
                fontWeight: "bold",
                boxShadow: 4,
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: 6,
                },
                transition: "all 0.3s",
              }}
            >
              Comenzar ahora
            </Button>

            <Button
              variant="outlined"
              aria-label="Saber más sobre EduShar"
              size="large"
              sx={{
                px: 5,
                py: 1.8,
                fontSize: "1.1rem",
                fontWeight: "bold",
                borderColor: "white",
                borderWidth: 2,
                color: "white",
                bgcolor: "rgba(255, 255, 255, 0.1)",
                backdropFilter: "blur(10px)",
                "&:hover": {
                  borderWidth: 2,
                  borderColor: "white",
                  bgcolor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              Saber más
            </Button>
          </Box>
        </Container>

        {/* Decorative terracotta element */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 8,
            bgcolor: "#E2725B",
          }}
        />
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: "background.paper" }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: { xs: 4, md: 6 } }}>
            <Typography
              variant="h2"
              component="h2"
              fontWeight={900}
              sx={{ fontSize: { xs: "1.9rem", md: "2.6rem" } }}
            >
              Características Principales
            </Typography>

            <Typography color="text.secondary" sx={{ mt: 1, maxWidth: 720, mx: "auto" }}>
              Diseñado para preservar y difundir el conocimiento ancestral con herramientas
              modernas.
            </Typography>
          </Box>

          <Grid
            container
            spacing={{ xs: 3, md: 4 }}
            justifyContent="center"
            alignItems="stretch"
          >
            {featuresData.map((feature) => (
              <Grid
                key={feature.id}
                size={{ xs: 12, sm: 6, md: 4 }} // ✅ Grid2 (MUI v7)
                sx={{ display: "flex" }}
              >
                <Box sx={{ width: "100%" }}>
                  <FeatureCard
                    title={feature.title}
                    description={feature.description}
                    image={feature.image}
                    icon={feature.icon}
                    iconColor={feature.iconColor}
                    // onClick={() => navigate(feature.href ?? "/register")}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: { xs: 10, md: 14 }, bgcolor: "background.default" }}>
        <Container maxWidth="md">
          <Box
            sx={{
              bgcolor: "rgba(209, 154, 74, 0.08)",
              borderRadius: 4,
              border: "2px solid",
              borderColor: "rgba(209, 154, 74, 0.2)",
              p: { xs: 5, md: 10 },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h2"
              component="h2"
              fontWeight="black"
              gutterBottom
              color="text.primary"
              sx={{
                fontSize: { xs: "2rem", md: "3.5rem" },
                letterSpacing: "-0.02em",
              }}
            >
              ¿Listo para empezar tu viaje?
            </Typography>

            <Typography
              variant="h3"
              component="p"
              color="text.secondary"
              sx={{
                mb: 5,
                maxWidth: 600,
                mx: "auto",
                fontSize: { xs: "1.1rem", md: "1.3rem" },
                fontWeight: 400,
              }}
            >
              Sé parte de la nueva generación que protege y celebra la riqueza de la lengua
              Shuar. Registro totalmente gratuito.
            </Typography>

            <Box sx={{ display: "flex", gap: 3, justifyContent: "center", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                color="secondary"
                aria-label="Registrarse gratis en EduShar"
                size="large"
                onClick={() => navigate("/register")}
                sx={{
                  px: 6,
                  py: 2.5,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  boxShadow: 6,
                  minWidth: 220,
                }}
              >
                Regístrate gratis
              </Button>

              <Button
                variant="outlined"
                color="secondary"
                aria-label="Ver demostración de EduShar"
                size="large"
                sx={{
                  px: 6,
                  py: 2.5,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  borderWidth: 2,
                  minWidth: 220,
                  "&:hover": {
                    borderWidth: 2,
                    bgcolor: "secondary.main",
                    color: "white",
                  },
                }}
              >
                Ver demo
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Landing;