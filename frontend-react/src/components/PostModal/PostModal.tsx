import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Grid";
import "./PostModal.scss";

export type PostFormValues = {
    title: string;
    description: string;
    introduction?: string;
    external_link?: { [key: string]: string | undefined; };
    content_hashtags: string[];
    image?: string | null | File;
    updated_at: Date;
    user_name: string;
};
interface PostModalProps {
    open: boolean;
    onClose: () => void;
    initialValues: PostFormValues;
}

export default function PostModal({
    open,
    onClose,
    initialValues,
}: PostModalProps) {
    const formatDate = (date: Date) =>
        new Date(date).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).replace(",", " às");
    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            slotProps={{
                paper: { sx: { borderRadius: 3, p: { xs: 1, sm: 2 } } },
            }}
        >
            <DialogTitle>
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid>
                        <Typography variant="h6">
                            {initialValues.title}
                        </Typography>
                    </Grid>

                    <Grid>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textAlign: "right" }}
                        >
                            {initialValues.user_name} <br />
                            {formatDate(initialValues.updated_at)}
                        </Typography>
                    </Grid>
                </Grid>
            </DialogTitle>

            <DialogContent dividers sx={{ overflowX: "hidden" }}>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={16}>
                    {initialValues.introduction && (
                        <Grid size={16}>
                            <Typography variant="h4">
                                Introdução:
                            </Typography>
                            <Typography variant="body1">{initialValues.introduction}</Typography>
                        </Grid>
                    )}

                    <Grid size={16}>
                        <Typography variant="h4">
                            Descrição:
                        </Typography>
                        <Typography variant="body1">{initialValues.description}</Typography>
                    </Grid>



                    {initialValues.external_link && (
                        <Grid size={16}>
                            <Typography variant="h4">
                                Links:
                            </Typography>
                            {Object.entries(initialValues.external_link).map(([key, url]) => (
                                <Typography key={key} variant="body1" sx={{ ml: 2 }}>
                                    {key}:{" "}
                                    <a href={url} target="_blank" rel="noreferrer">
                                        {url}
                                    </a>
                                </Typography>
                            ))}
                        </Grid>
                    )}

                    {initialValues.content_hashtags.length > 0 && (
                        <Grid size={16}>
                            <Typography variant="h4">
                                Hashtags:
                            </Typography>
                            <Typography variant="body1">
                                {initialValues.content_hashtags.join(", ")}
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: { xs: 1, sm: 2 } }}>

                <Button
                    className="button-custom"
                    onClick={onClose}
                >
                    <Typography variant="button">
                        Fechar
                    </Typography>
                </Button>
            </DialogActions>
        </Dialog>
    );
}