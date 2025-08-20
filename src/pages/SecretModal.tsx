import {
  Box,
  Typography,
  Alert,
  IconButton,
  Tooltip,
  Modal
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SecretModalProps {
  open: boolean;
  secretData: string | null;
  fetchError: boolean;
}

export default function SecretModal({ open, secretData, fetchError }: SecretModalProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/", { replace: true });
  };

  const handleCopy = () => {
    if (!secretData) return;
    navigator.clipboard.writeText(secretData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translate(-50%, 10%)",
          bgcolor: "white",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: "90%",
          maxWidth: 600,
          textAlign: "center",
          fontFamily: "'Comfortaa', sans-serif"
        }}
      >
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {fetchError ? (
          <Alert severity="error">
            Für diesen Schlüssel wurde kein Geheimnis gefunden.
          </Alert>
        ) : secretData ? (
          <>
            <Typography variant="h6" sx={{ color: "#6E2E87", mb: 2 }}>
              Dein Geheimnis:
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 2 }}>
              <Typography variant="body1" sx={{ color: "#3c763d", wordBreak: "break-word" }}>
                {secretData}
              </Typography>
              <Tooltip title={copied ? "Kopiert!" : "Kopieren"}>
                <IconButton
                  onClick={handleCopy}
                  size="small"
                  sx={{ color: "#3c763d" }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" sx={{ color: "#999" }}>
              Dieses Geheimnis wird jetzt gelöscht.
            </Typography>
          </>
        ) : (
          <Typography>Lade...</Typography>
        )}
      </Box>
    </Modal>
  );
}
