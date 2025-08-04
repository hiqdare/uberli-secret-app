import { useEffect, useState } from "react";
import { useParams} from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  useMediaQuery
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import GitHubIcon from "@mui/icons-material/GitHub";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CryptoJS from "crypto-js";
import { storeSecret, readSecret } from '../api';
import SecretModal from "./SecretModal";



export default function SecretPage() {
  const MAX_SECRET_LENGTH = 1000;
  const [secret, setSecret] = useState("");
  const [link, setLink] = useState("");
  const [error, setError] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { id } = useParams();
  const [secretData, setSecretData] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState(false);

  console.log("isMobile", isMobile, window.innerWidth);

  const handleSubmit = async () => {
    setError("");
    setLink("");

    const trimmed = secret.trim();

    if (!trimmed) {
      setError("Bitte ein Geheimnis eingeben.");
      return;
    }

    if (trimmed.length > MAX_SECRET_LENGTH) {
      setError(`Das Geheimnis darf maximal ${MAX_SECRET_LENGTH} Zeichen lang sein.`);
      return;
    }

    const key = generateKey(); // 256-bit key
    const encrypted = CryptoJS.AES.encrypt(secret, key).toString();

    try {
      const { id } = await storeSecret(encrypted);

      if (id) {
        const url = `${window.location.origin}/${id}#${key}`;
        setLink(url);
        setSecret("");
      } else {
        setError("Fehler beim Erstellen des Geheimnisses.");
      }
    } catch (e) {
      console.error(e);
      setError("Verbindung zum Server fehlgeschlagen.");
    }
  };

  useEffect(() => {
    if (!id) return;
    const hash = window.location.hash.slice(1); // entfernt das `#`
    if (!hash) {
      setFetchError(true);
      return;
    }
    (async () => {
      if (!id) return;
      const key = window.location.hash.slice(1);
      if (!key) { setFetchError(true); return; }

      try {
        const { value } = await readSecret(id);
        const decrypted = CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
        if (!decrypted) throw new Error('Decryption failed');
        setSecretData(decrypted);
      } catch {
        setFetchError(true);
      }
    })();
  }, [id]);

  function generateKey(length = 32) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
  }


  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#E4BBEF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: isMobile ? 2: 6,
        px: 2
      }}
    >
      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
          width: "100%",
          maxWidth: 1200,
          px: 4,
          pt: isMobile ? 6 : 8,
          pb: 2,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "90vh"
        }}
      >
        {/* Titel */}
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            fontFamily: "'Comfortaa', sans-serif",
            color: "#6E2E87",
            textAlign: "center"
          }}
        >
          Geheimnis teilen
        </Typography>

        {/* Eingabe */}
        <Box sx={{ mb: 4 }}>
          <TextField
            label="Geheimnis"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ mb: 2 }}
            inputProps={{
              maxLength: MAX_SECRET_LENGTH
            }}
            helperText={`${secret.length}/${MAX_SECRET_LENGTH} Zeichen`}
          />


          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                bgcolor: "#6E2E87",
                color: "white",          // <- Textfarbe explizit setzen
                mb: 2,
                ":hover": {
                  bgcolor: "#5A246D"     // optional dunklerer Hover
                }
              }}
            >
              Link generieren
            </Button>
          </Box>


          {link && (
            <Alert
              severity="success"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                px: 2,
                py: 1.5
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{ fontFamily: "'Comfortaa', sans-serif", color: "#3c763d" }}
                >
                  Link:{" "}
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#3c763d", textDecoration: "underline" }}
                  >
                    {link}
                  </a>
                </Typography>
                <ContentCopyIcon
                  fontSize="small"
                  onClick={() => navigator.clipboard.writeText(link)}
                  sx={{
                    cursor: "pointer",
                    color: "#3c763d",
                    "&:hover": { color: "#2a572a" }
                  }}
                />
              </Box>
            </Alert>
          )}

          {error && <Alert severity="error">{error}</Alert>}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            mt: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          {/* Designed by */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: "'Comfortaa', sans-serif",
                color: "#6E2E87",
                mr: 1
              }}
            >
              designed by
            </Typography>
            <a
              href="https://www.uberli.ch"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/images/logo_uberli_purple_150w.png"
                alt="überli"
                style={{ height: 32 }}
              />
            </a>
          </Box>

          {/* GitHub-Link */}
          <a
            href="https://github.com/uberli/secret"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              color: "#6E2E87",
              fontFamily: "'Comfortaa', sans-serif",
              textDecoration: "none",
              fontSize: "0.9rem"
            }}
          >
            <GitHubIcon fontSize="small" sx={{ mr: 0.5 }} />
            Code is Open Source
          </a>
        </Box>
      </Box>
      <SecretModal open={!!id && (!!secretData || fetchError)} secretData={secretData} fetchError={fetchError} />
    </Box>
  );
}
